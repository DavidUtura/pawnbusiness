-- ============================================================
-- Pawn.ge — V2 seed data (dev convenience)
-- Creates a super admin + demo Lombard tenant.
-- Password for both accounts: "Admin123!" (BCrypt-hashed below)
-- Change/remove before any non-local deployment.
-- ============================================================

INSERT INTO lombards (created_at, name, slug, description, phone_number, email, address, latitude, longitude, active)
VALUES (now(), 'Demo Lombard', 'demo-lombard',
        'Seed demo tenant for local development.',
        '+995500000000', 'demo@lombard.ge', 'Tbilisi, Rustaveli 1', 41.6938, 44.8015, TRUE);

-- role SUPER_ADMIN / password Admin123!
INSERT INTO users (created_at, email, password, first_name, last_name, phone_number, role, enabled)
VALUES (now(), 'admin@pawn.ge',
        '$2b$10$J3bmzylXKDe4xXfpNuhBv.N5WfO.8lkicQIUq2TAJhMQapxDXbYRS',
        'Super', 'Admin', '+995555000000', 'SUPER_ADMIN', TRUE);

-- role LOMBARD_ADMIN / password Admin123! (tenant resolved server-side via lombard_id)
INSERT INTO users (created_at, email, password, first_name, last_name, phone_number, role, enabled, lombard_id)
VALUES (now(), 'owner@demo-lombard.ge',
        '$2b$10$J3bmzylXKDe4xXfpNuhBv.N5WfO.8lkicQIUq2TAJhMQapxDXbYRS',
        'Demo', 'Owner', '+995555000001', 'LOMBARD_ADMIN', TRUE,
        (SELECT id FROM lombards WHERE slug = 'demo-lombard'));
