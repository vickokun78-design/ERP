-- ==========================================
-- NBHX ERP ENTERPRISE 2026
-- Demo Data Seed
-- ==========================================

-- Insert Company
INSERT INTO companies (id, name, legal_name, tax_id, address, city, state, country, postal_code, phone, email, industry)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'NBHX Group',
    'NBHX Plásticos y Componentes Automotrices S.A. de C.V.',
    'NHB123456789',
    'Av. Industria Automotriz #1000, Parque Industrial',
    'Querétaro',
    'Querétaro',
    'Mexico',
    '76120',
    '+52 (442) 123-4567',
    'contacto@nbhx.com',
    'Automotriz / Plásticos'
);

-- Insert Roles
INSERT INTO roles (id, company_id, name, description, permissions, is_system) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SUPER_ADMIN', 'Super Administrador del Sistema', '["*"]', true),
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ADMIN', 'Administrador', '["production:*", "inventory:*", "quality:*", "engineering:*", "hr:*", "finance:*", "admin:*"]', true),
('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'MANAGER', 'Gerente de Planta', '["production:read", "production:create", "production:update", "inventory:read", "quality:read", "quality:approve"]', true),
('b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SUPERVISOR', 'Supervisor de Producción', '["production:read", "production:execute", "inventory:read"]', true),
('b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'OPERATOR', 'Operador', '["production:read", "production:execute"]', true),
('b6eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'QUALITY_INSPECTOR', 'Inspector de Calidad', '["quality:read", "quality:create", "quality:update"]', true),
('b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'VIEWER', 'Solo Lectura', '["production:read", "inventory:read", "quality:read"]', true);

-- Insert Admin User (password: Nbhx2026!)
INSERT INTO users (id, company_id, email, password_hash, first_name, last_name, employee_id, department, position, is_active, is_verified)
VALUES (
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'admin@nbhx.com',
    '$2b$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash
    'Administrador',
    'Sistema',
    'EMP001',
    'IT',
    'System Administrator',
    true,
    true
);

-- Assign Admin Role
INSERT INTO user_roles (user_id, role_id) VALUES
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');

-- Insert Work Centers
INSERT INTO work_centers (id, company_id, code, name, description, type, location, capacity_per_hour, cost_per_hour, status) VALUES
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'INY-001', 'Inyectora #1', 'Inyectora de 300 toneladas', 'INJECTION', 'Línea A', 120, 850.00, 'ACTIVE'),
('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'INY-002', 'Inyectora #2', 'Inyectora de 500 toneladas', 'INJECTION', 'Línea A', 150, 1200.00, 'ACTIVE'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a46', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'INY-003', 'Inyectora #3', 'Inyectora de 200 toneladas', 'INJECTION', 'Línea B', 100, 650.00, 'ACTIVE'),
('d4eebc99-9c0b-4ef8-bb6d-6bb9bd380a47', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ENS-001', 'Ensambladora #1', 'Estación de ensamble manual', 'ASSEMBLY', 'Línea C', 80, 450.00, 'ACTIVE'),
('d5eebc99-9c0b-4ef8-bb6d-6bb9bd380a48', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ENS-002', 'Ensambladora #2', 'Estación de ensamble semi-automática', 'ASSEMBLY', 'Línea C', 120, 650.00, 'ACTIVE'),
('d6eebc99-9c0b-4ef8-bb6d-6bb9bd380a49', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'PNT-001', 'Pintura #1', 'Cabina de pintura automática', 'PAINTING', 'Línea D', 200, 1500.00, 'ACTIVE');

-- Insert Products (Finished Goods)
INSERT INTO products (id, company_id, sku, name, description, category, unit_of_measure, standard_cost, selling_price, is_manufactured, is_active) VALUES
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FG-001', 'Parachoques Delantero Modelo X', 'Parachoques delantero para vehículo modelo X', 'PARACHOQUES', 'PCS', 850.00, 1200.00, true, true),
('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a56', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FG-002', 'Parachoques Trasero Modelo X', 'Parachoques trasero para vehículo modelo X', 'PARACHOQUES', 'PCS', 750.00, 1100.00, true, true),
('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a57', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FG-003', 'Facia Delantera Modelo Y', 'Facia delantera para vehículo modelo Y', 'FACIAS', 'PCS', 650.00, 950.00, true, true),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a58', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FG-004', 'Spoiler Trasero Modelo Z', 'Spoiler trasero deportivo modelo Z', 'ACCESORIOS', 'PCS', 320.00, 550.00, true, true),
('e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a59', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FG-005', 'Moldura Lateral Set', 'Set de molduras laterales universales', 'MOLDURAS', 'SET', 180.00, 320.00, true, true);

-- Insert Raw Materials
INSERT INTO products (id, company_id, sku, name, description, category, unit_of_measure, standard_cost, is_manufactured, is_purchased, is_active) VALUES
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'RM-001', 'Polipropileno Negro', 'Resina de polipropileno color negro', 'RESINAS', 'KG', 45.00, false, true, true),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a67', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'RM-002', 'ABS Natural', 'Resina ABS color natural', 'RESINAS', 'KG', 52.00, false, true, true),
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a68', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'RM-003', 'Pintura Base Negro', 'Pintura base color negro', 'PINTURAS', 'L', 180.00, false, true, true),
('f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a69', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'RM-004', 'Adhesivo Industrial', 'Adhesivo epóxico industrial', 'ADHESIVOS', 'L', 250.00, false, true, true),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a70', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'RM-005', 'Tornillería M6', 'Tornillos M6x20mm inoxidable', 'HARDWARE', 'PCS', 2.50, false, true, true);

-- Insert Warehouses
INSERT INTO warehouses (id, company_id, code, name, type) VALUES
('g1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'MP-01', 'Almacén Materia Prima', 'RAW_MATERIAL'),
('g2eebc99-9c0b-4ef8-bb6d-6bb9bd380a78', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'PT-01', 'Almacén Producto Terminado', 'FINISHED_GOOD'),
('g3eebc99-9c0b-4ef8-bb6d-6bb9bd380a79', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WIP-01', 'Almacén Proceso', 'WIP'),
('g4eebc99-9c0b-4ef8-bb6d-6bb9bd380a80', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'CUAR-01', 'Cuarentena', 'QUARANTINE');

-- Insert Demo Work Orders
INSERT INTO work_orders (id, company_id, order_number, product_id, quantity_planned, quantity_produced, status, priority, planned_start_date, planned_end_date, assigned_work_center_id, created_by) VALUES
('h1eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WO-2026-00120', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 500, 500, 'COMPLETED', 'HIGH', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('h2eebc99-9c0b-4ef8-bb6d-6bb9bd380a89', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WO-2026-00121', 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a56', 400, 380, 'IN_PROGRESS', 'MEDIUM', NOW() - INTERVAL '2 days', NOW() + INTERVAL '1 day', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('h3eebc99-9c0b-4ef8-bb6d-6bb9bd380a90', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WO-2026-00122', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a57', 600, 0, 'PENDING', 'HIGH', NOW() + INTERVAL '1 day', NOW() + INTERVAL '3 days', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a46', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('h4eebc99-9c0b-4ef8-bb6d-6bb9bd380a91', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WO-2026-00123', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a58', 300, 250, 'IN_PROGRESS', 'CRITICAL', NOW() - INTERVAL '1 day', NOW() + INTERVAL '2 days', 'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380a47', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('h5eebc99-9c0b-4ef8-bb6d-6bb9bd380a92', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WO-2026-00124', 'e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a59', 800, 620, 'IN_PROGRESS', 'MEDIUM', NOW() - INTERVAL '1 day', NOW() + INTERVAL '1 day', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('h6eebc99-9c0b-4ef8-bb6d-6bb9bd380a93', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WO-2026-00125', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 450, 0, 'RELEASED', 'HIGH', NOW(), NOW() + INTERVAL '2 days', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('h7eebc99-9c0b-4ef8-bb6d-6bb9bd380a94', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WO-2026-00126', 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a56', 350, 0, 'PENDING', 'LOW', NOW() + INTERVAL '2 days', NOW() + INTERVAL '4 days', 'd5eebc99-9c0b-4ef8-bb6d-6bb9bd380a48', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33');

-- Insert Demo Non-Conformities
INSERT INTO non_conformities (id, company_id, ncr_number, type, source, severity, status, product_id, work_order_id, quantity_affected, description, detected_by) VALUES
('i1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'NCR-2026-001', 'INTERNAL', 'PRODUCTION', 'HIGH', 'OPEN', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'h2eebc99-9c0b-4ef8-bb6d-6bb9bd380a89', 25, 'Defecto de inyección: manchas en superficie', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('i2eebc99-9c0b-4ef8-bb6d-6bb9bd380a100', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'NCR-2026-002', 'INTERNAL', 'IN_PROCESS', 'MEDIUM', 'CAPA_DEFINED', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a57', 'h3eebc99-9c0b-4ef8-bb6d-6bb9bd380a90', 15, 'Dimensiones fuera de tolerancia', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('i3eebc99-9c0b-4ef8-bb6d-6bb9bd380a101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'NCR-2026-003', 'EXTERNAL', 'INCOMING', 'CRITICAL', 'CLOSED', 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a67', NULL, 500, 'Lote de material con certificado de calidad vencido', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33');

-- Insert Demo OEE Data
INSERT INTO oee_data (work_center_id, shift_date, shift_number, availability, performance, quality, oee, planned_production_time, actual_production_time, total_pieces, good_pieces, scrap_pieces) VALUES
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', CURRENT_DATE, 1, 95.5, 92.0, 98.5, 86.7, 480, 458, 550, 542, 8),
('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', CURRENT_DATE, 1, 98.0, 89.5, 99.0, 86.9, 480, 470, 680, 673, 7),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a46', CURRENT_DATE, 1, 92.0, 95.5, 97.0, 85.2, 480, 442, 420, 407, 13),
('d4eebc99-9c0b-4ef8-bb6d-6bb9bd380a47', CURRENT_DATE, 1, 97.5, 94.0, 99.5, 91.3, 480, 468, 380, 378, 2),
('d5eebc99-9c0b-4ef8-bb6d-6bb9bd380a48', CURRENT_DATE, 1, 0, 0, 0, 0, 480, 0, 0, 0, 0); -- Machine down

-- Insert Demo Inventory
INSERT INTO inventory (product_id, warehouse_id, quantity_on_hand, quantity_reserved, unit_cost) VALUES
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'g1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 5000, 500, 45.00),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a67', 'g1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 3500, 300, 52.00),
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a68', 'g1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 200, 50, 180.00),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'g2eebc99-9c0b-4ef8-bb6d-6bb9bd380a78', 850, 200, 850.00),
('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a56', 'g2eebc99-9c0b-4ef8-bb6d-6bb9bd380a78', 620, 150, 750.00);

-- Insert Demo Audit Logs
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values, ip_address) VALUES
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'LOGIN', 'USER', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '{"timestamp": "2026-01-15T08:30:00Z"}', '192.168.1.100'),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'CREATE', 'WORK_ORDER', 'h1eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', '{"order_number": "WO-2026-00120"}', '192.168.1.100'),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'UPDATE', 'WORK_ORDER', 'h2eebc99-9c0b-4ef8-bb6d-6bb9bd380a89', '{"status": "IN_PROGRESS"}', '192.168.1.100');
