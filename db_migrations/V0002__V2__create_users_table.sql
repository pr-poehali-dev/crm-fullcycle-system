CREATE TABLE t_p74910184_crm_fullcycle_system.users (
    id SERIAL PRIMARY KEY,
    yandex_id VARCHAR(50),
    email VARCHAR(255),
    name VARCHAR(255),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE INDEX idx_users_yandex_id ON t_p74910184_crm_fullcycle_system.users(yandex_id);
CREATE INDEX idx_users_email ON t_p74910184_crm_fullcycle_system.users(email);

CREATE TABLE t_p74910184_crm_fullcycle_system.refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p74910184_crm_fullcycle_system.users(id),
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
