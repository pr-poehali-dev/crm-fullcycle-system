ALTER TABLE t_p74910184_crm_fullcycle_system.users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'manager';

UPDATE t_p74910184_crm_fullcycle_system.users SET role = 'admin' WHERE id = (SELECT id FROM t_p74910184_crm_fullcycle_system.users ORDER BY created_at ASC LIMIT 1);
