"""
CRM API: управление клиентами (CRUD) + аудит изменений
"""
import json
import os
import psycopg2
from datetime import date

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
            segment = params.get("segment", "")
            industry = params.get("industry", "")
            page = int(params.get("page", 1))
            per_page = int(params.get("per_page", 50))
            offset = (page - 1) * per_page

            where = ["1=1"]
            args = []
            if search:
                where.append("(name ILIKE %s OR company ILIKE %s OR email ILIKE %s OR phone ILIKE %s)")
                args += [f"%{search}%"] * 4
            if segment and segment != "Все":
                where.append("segment = %s")
                args.append(segment)
            if industry:
                where.append("industry = %s")
                args.append(industry)

            where_sql = " AND ".join(where)

            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.clients WHERE {where_sql}", args)
            total = cur.fetchone()[0]

            cur.execute(
                f"""SELECT id, name, company, phone, email, segment, industry,
                           last_contact, total_revenue, notes, created_at, updated_at
                    FROM {SCHEMA}.clients WHERE {where_sql}
                    ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                args + [per_page, offset]
            )
            cols = [d[0] for d in cur.description]
            clients = [dict(zip(cols, row)) for row in cur.fetchall()]

            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.clients WHERE segment = 'VIP'", [])
            vip_count = cur.fetchone()[0]

            return json_response({"clients": clients, "total": total, "vip_count": vip_count})

        elif method == "POST":
            name = body.get("name", "").strip()
            company = body.get("company", "").strip()
            if not name or not company:
                return json_response({"error": "name и company обязательны"}, 400)

            cur.execute(
                f"""INSERT INTO {SCHEMA}.clients
                    (name, company, phone, email, segment, industry, last_contact, total_revenue, notes)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                [
                    name, company,
                    body.get("phone"), body.get("email"),
                    body.get("segment", "Новый"), body.get("industry"),
                    body.get("last_contact"), body.get("total_revenue", 0),
                    body.get("notes"),
                ]
            )
            new_id = cur.fetchone()[0]
            cur.execute(
                f"""INSERT INTO {SCHEMA}.audit_log (entity_type, entity_id, action, manager, changes)
                    VALUES ('client', %s, 'create', %s, %s)""",
                [new_id, manager, json.dumps({"name": name, "company": company}, ensure_ascii=False)]
            )
            conn.commit()
            return json_response({"id": new_id, "message": "Клиент создан"}, 201)

        elif method in ("PUT", "PATCH"):
            client_id = int(params.get("id", 0))
            if not client_id:
                return json_response({"error": "id обязателен"}, 400)

            cur.execute(f"SELECT * FROM {SCHEMA}.clients WHERE id = %s", [client_id])
            row = cur.fetchone()
            if not row:
                return json_response({"error": "Клиент не найден"}, 404)

            cols = [d[0] for d in cur.description]
            old = dict(zip(cols, row))

            fields = ["name", "company", "phone", "email", "segment", "industry", "last_contact", "total_revenue", "notes"]
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
                args.append(client_id)
                cur.execute(f"UPDATE {SCHEMA}.clients SET {', '.join(updates)} WHERE id = %s", args)
                cur.execute(
                    f"""INSERT INTO {SCHEMA}.audit_log (entity_type, entity_id, action, manager, changes)
                        VALUES ('client', %s, 'update', %s, %s)""",
                    [client_id, manager, json.dumps(changes, ensure_ascii=False)]
                )
                conn.commit()

            return json_response({"id": client_id, "message": "Клиент обновлён"})

        return json_response({"error": "Метод не поддерживается"}, 405)

    except Exception as e:
        conn.rollback()
        return json_response({"error": str(e)}, 500)
    finally:
        cur.close()
        conn.close()
