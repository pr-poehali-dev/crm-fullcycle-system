CREATE TABLE t_p74910184_crm_fullcycle_system.clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    segment VARCHAR(50) DEFAULT 'New',
    industry VARCHAR(100),
    last_contact DATE,
    total_revenue BIGINT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p74910184_crm_fullcycle_system.deals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    client_id INTEGER REFERENCES t_p74910184_crm_fullcycle_system.clients(id),
    client_name VARCHAR(255),
    stage VARCHAR(50) DEFAULT 'New',
    status VARCHAR(50) DEFAULT 'Active',
    amount BIGINT DEFAULT 0,
    probability INTEGER DEFAULT 50,
    manager VARCHAR(255),
    close_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p74910184_crm_fullcycle_system.communications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    client_id INTEGER REFERENCES t_p74910184_crm_fullcycle_system.clients(id),
    client_name VARCHAR(255),
    deal_id INTEGER REFERENCES t_p74910184_crm_fullcycle_system.deals(id),
    manager VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(50),
    call_result VARCHAR(50),
    subject VARCHAR(500),
    location VARCHAR(500),
    comm_datetime TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p74910184_crm_fullcycle_system.audit_log (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    action VARCHAR(50) NOT NULL,
    manager VARCHAR(255),
    changes JSONB,
    created_at TIMESTAMP DEFAULT NOW()
)
