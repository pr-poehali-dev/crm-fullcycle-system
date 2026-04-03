"""
CRM API: коммуникации + полная история аудита изменений
"""
import json
import os
import psycopg2

SCHEMA = "t_p74910184_crm_fullcycle_system"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Manager",
    }

def json_response(data, status=200):
    return {
        "statusCode": status,
        "headers": {**cors_headers(), "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False, default=str),
    }

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    manager = event.get("headers", {}).get("X-Manager", "Система")

    conn = get_conn()
    cur = conn.cursor()

    try:
        endpoint = params.get("endpoint", "communications")

        if endpoint == "audit":
            entity_type = params.get("entity_type", "")
            entity_id = params.get("entity_id", "")
            page = int(params.get("page", 1))
            per_page = int(params.get("per_page", 50))
            offset = (page - 1) * per_page

            where = ["1=1"]
            args = []
            if entity_type:
                where.append("entity_type = %s")
                args.append(entity_type)
            if entity_id:
                where.append("entity_id = %s")
                args.append(int(entity_id))

            where_sql = " AND ".join(where)
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.audit_log WHERE {where_sql}", args)
            total = cur.fetchone()[0]

            cur.execute(
                f"""SELECT id, entity_type, entity_id, action, manager, changes, created_at
                    FROM {SCHEMA}.audit_log WHERE {where_sql}
                    ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                args + [per_page, offset]
            )
            cols = [d[0] for d in cur.description]
            logs = [dict(zip(cols, row)) for row in cur.fetchall()]
            return json_response({"logs": logs, "total": total})

        if method == "GET":
            type_filter = params.get("type", "")
            search = params.get("search", "")
            mgr_filter = params.get("manager", "")
            page = int(params.get("page", 1))
            per_page = int(params.get("per_page", 50))
            offset = (page - 1) * per_page

            where = ["1=1"]
            args = []
            if type_filter and type_filter != "Все":
                where.append("type = %s")
                args.append(type_filter)
            if search:
                where.append("(client_name ILIKE %s OR manager ILIKE %s OR description ILIKE %s)")
                args += [f"%{search}%"] * 3
            if mgr_filter:
                where.append("manager = %s")
                args.append(mgr_filter)

            where_sql = " AND ".join(where)
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.communications WHERE {where_sql}", args)
            total = cur.fetchone()[0]

            cur.execute(
                f"""SELECT id, type, client_id, client_name, deal_id, manager,
                           description, duration, call_result, subject, location, comm_datetime, created_at
                    FROM {SCHEMA}.communications WHERE {where_sql}
                    ORDER BY comm_datetime DESC LIMIT %s OFFSET %s""",
                args + [per_page, offset]
            )
            cols = [d[0] for d in cur.description]
            comms = [dict(zip(cols, row)) for row in cur.fetchall()]

            cur.execute(
                f"""SELECT
                    COUNT(*) FILTER (WHERE type = 'Письмо') as emails,
                    COUNT(*) FILTER (WHERE type = 'Звонок') as calls,
                    COUNT(*) FILTER (WHERE type = 'Встреча') as meetings,
                    COUNT(*) FILTER (WHERE type = 'Заметка') as notes
                    FROM {SCHEMA}.communications""",
                []
            )
            stats_row = cur.fetchone()
            stats = {"emails": stats_row[0], "calls": stats_row[1], "meetings": stats_row[2], "notes": stats_row[3]}

            cur.execute(f"SELECT DISTINCT manager FROM {SCHEMA}.communications ORDER BY manager", [])
            managers = [row[0] for row in cur.fetchall()]

            return json_response({"communications": comms, "total": total, "stats": stats, "managers": managers})

        elif method == "POST":
            comm_type = body.get("type", "").strip()
            description = body.get("description", "").strip()
            comm_manager = body.get("manager", manager).strip()
            if not comm_type or not description or not comm_manager:
                return json_response({"error": "type, description и manager обязательны"}, 400)

            cur.execute(
                f"""INSERT INTO {SCHEMA}.communications
                    (type, client_id, client_name, deal_id, manager, description,
                     duration, call_result, subject, location, comm_datetime)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, COALESCE(%s::timestamp, NOW()))
                    RETURNING id""",
                [
                    comm_type,
                    body.get("client_id"), body.get("client_name"),
                    body.get("deal_id"), comm_manager, description,
                    body.get("duration"), body.get("call_result"),
                    body.get("subject"), body.get("location"),
                    body.get("comm_datetime"),
                ]
            )
            new_id = cur.fetchone()[0]
            cur.execute(
                f"""INSERT INTO {SCHEMA}.audit_log (entity_type, entity_id, action, manager, changes)
                    VALUES ('communication', %s, 'create', %s, %s)""",
                [new_id, comm_manager, json.dumps({"type": comm_type, "client_name": body.get("client_name")}, ensure_ascii=False)]
            )
            conn.commit()
            return json_response({"id": new_id, "message": "Коммуникация добавлена"}, 201)

        return json_response({"error": "Метод не поддерживается"}, 405)

    except Exception as e:
        conn.rollback()
        return json_response({"error": str(e)}, 500)
    finally:
        cur.close()
        conn.close()
