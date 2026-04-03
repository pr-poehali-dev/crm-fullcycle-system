"""
CRM API: управление сделками (CRUD) + аудит изменений
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
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, OPTIONS",
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
        if method == "GET":
            search = params.get("search", "")
            status_filter = params.get("status", "")
            stage_filter = params.get("stage", "")
            page = int(params.get("page", 1))
            per_page = int(params.get("per_page", 50))
            offset = (page - 1) * per_page

            where = ["1=1"]
            args = []
            if search:
                where.append("(d.name ILIKE %s OR d.client_name ILIKE %s OR d.manager ILIKE %s)")
                args += [f"%{search}%"] * 3
            if status_filter and status_filter != "Все":
                where.append("d.status = %s")
                args.append(status_filter)
            if stage_filter:
                where.append("d.stage = %s")
                args.append(stage_filter)

            where_sql = " AND ".join(where)

            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.deals d WHERE {where_sql}", args)
            total = cur.fetchone()[0]

            cur.execute(
                f"""SELECT d.id, d.name, d.client_id, d.client_name, d.stage, d.status,
                           d.amount, d.probability, d.manager, d.close_date, d.notes,
                           d.created_at, d.updated_at
                    FROM {SCHEMA}.deals d WHERE {where_sql}
                    ORDER BY d.created_at DESC LIMIT %s OFFSET %s""",
                args + [per_page, offset]
            )
            cols = [d[0] for d in cur.description]
            deals = [dict(zip(cols, row)) for row in cur.fetchall()]

            cur.execute(
                f"""SELECT
                    COUNT(*) FILTER (WHERE status = 'Активная') as active,
                    COUNT(*) FILTER (WHERE status = 'Выиграна') as won,
                    COALESCE(SUM(amount) FILTER (WHERE status = 'Активная'), 0) as pipeline,
                    COALESCE(SUM(amount) FILTER (WHERE status = 'Выиграна' AND EXTRACT(MONTH FROM updated_at) = EXTRACT(MONTH FROM NOW())), 0) as won_month
                    FROM {SCHEMA}.deals""",
                []
            )
            stats_row = cur.fetchone()
            stats = {
                "active": stats_row[0],
                "won": stats_row[1],
                "pipeline": stats_row[2],
                "won_month": stats_row[3],
            }

            return json_response({"deals": deals, "total": total, "stats": stats})

        elif method == "POST":
            name = body.get("name", "").strip()
            if not name:
                return json_response({"error": "name обязателен"}, 400)

            cur.execute(
                f"""INSERT INTO {SCHEMA}.deals
                    (name, client_id, client_name, stage, status, amount, probability, manager, close_date, notes)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                [
                    name,
                    body.get("client_id"), body.get("client_name"),
                    body.get("stage", "Новая"), body.get("status", "Активная"),
                    body.get("amount", 0), body.get("probability", 50),
                    body.get("manager"), body.get("close_date"),
                    body.get("notes"),
                ]
            )
            new_id = cur.fetchone()[0]
            cur.execute(
                f"""INSERT INTO {SCHEMA}.audit_log (entity_type, entity_id, action, manager, changes)
                    VALUES ('deal', %s, 'create', %s, %s)""",
                [new_id, manager, json.dumps({"name": name, "amount": body.get("amount", 0)}, ensure_ascii=False)]
            )
            conn.commit()
            return json_response({"id": new_id, "message": "Сделка создана"}, 201)

        elif method in ("PUT", "PATCH"):
            deal_id = int(params.get("id", 0))
            if not deal_id:
                return json_response({"error": "id обязателен"}, 400)

            cur.execute(f"SELECT * FROM {SCHEMA}.deals WHERE id = %s", [deal_id])
            row = cur.fetchone()
            if not row:
                return json_response({"error": "Сделка не найдена"}, 404)

            cols = [d[0] for d in cur.description]
            old = dict(zip(cols, row))

            fields = ["name", "client_id", "client_name", "stage", "status", "amount", "probability", "manager", "close_date", "notes"]
            updates = []
            args = []
            changes = {}
            for f in fields:
                if f in body:
                    updates.append(f"{f} = %s")
                    args.append(body[f])
                    if str(old.get(f)) != str(body[f]):
                        changes[f] = {"from": str(old.get(f)), "to": str(body[f])}

            if updates:
                updates.append("updated_at = NOW()")
                args.append(deal_id)
                cur.execute(f"UPDATE {SCHEMA}.deals SET {', '.join(updates)} WHERE id = %s", args)
                cur.execute(
                    f"""INSERT INTO {SCHEMA}.audit_log (entity_type, entity_id, action, manager, changes)
                        VALUES ('deal', %s, 'update', %s, %s)""",
                    [deal_id, manager, json.dumps(changes, ensure_ascii=False)]
                )
                conn.commit()

            return json_response({"id": deal_id, "message": "Сделка обновлена"})

        return json_response({"error": "Метод не поддерживается"}, 405)

    except Exception as e:
        conn.rollback()
        return json_response({"error": str(e)}, 500)
    finally:
        cur.close()
        conn.close()
