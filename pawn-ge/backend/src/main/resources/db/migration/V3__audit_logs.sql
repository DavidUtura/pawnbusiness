-- V3: audit_logs table (required by ge.pawn.common.AuditLog entity)
-- Previously this migration was described as added but was never committed,
-- which caused "Schema-validation: missing table [audit_logs]" on startup.

CREATE TABLE audit_logs (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        VARCHAR(255) NOT NULL,
    user_name      VARCHAR(255) NOT NULL,
    action         VARCHAR(255) NOT NULL,
    entity_type    VARCHAR(255) NOT NULL,
    entity_id      UUID         NOT NULL,
    previous_value TEXT,
    new_value      TEXT,
    ip_address     VARCHAR(255) NOT NULL,
    user_agent     VARCHAR(2048) NOT NULL,
    lombard_id     UUID         NOT NULL,
    timestamp      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_lombard_id ON audit_logs (lombard_id);
CREATE INDEX idx_audit_logs_user_id    ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_entity     ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_timestamp  ON audit_logs (timestamp);
