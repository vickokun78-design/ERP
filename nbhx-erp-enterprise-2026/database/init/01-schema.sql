-- ==========================================
-- NBHX ERP ENTERPRISE 2026
-- Database Schema - PostgreSQL
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location tracking (optional)
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ==========================================
-- CORE TABLES
-- ==========================================

-- Companies
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    tax_id VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Mexico',
    postal_code VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    industry VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users & Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50),
    department VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(50),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(255),
    last_login_at TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, name)
);

-- User Roles (Many-to-Many)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500),
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- PRODUCTION MODULE
-- ==========================================

-- Work Centers (Machines/Workstations)
CREATE TABLE work_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- INJECTION, ASSEMBLY, etc.
    location VARCHAR(255),
    capacity_per_hour DECIMAL(10,2),
    setup_time_minutes INTEGER DEFAULT 0,
    cost_per_hour DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, MAINTENANCE, INACTIVE
    last_maintenance_at TIMESTAMP WITH TIME ZONE,
    next_maintenance_at TIMESTAMP WITH TIME ZONE,
    specifications JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, code)
);

-- Products/SKUs
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    unit_of_measure VARCHAR(20) DEFAULT 'PCS',
    standard_cost DECIMAL(12,4),
    selling_price DECIMAL(12,4),
    weight_kg DECIMAL(10,4),
    dimensions JSONB, -- {length, width, height}
    shelf_life_days INTEGER,
    reorder_point INTEGER DEFAULT 0,
    max_stock INTEGER,
    is_manufactured BOOLEAN DEFAULT true,
    is_purchased BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, sku)
);

-- Bills of Materials (BOM)
CREATE TABLE boms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    version INTEGER DEFAULT 1,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    effective_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, version)
);

-- BOM Components
CREATE TABLE bom_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bom_id UUID REFERENCES boms(id) ON DELETE CASCADE,
    component_id UUID REFERENCES products(id),
    quantity DECIMAL(12,4) NOT NULL,
    unit_of_measure VARCHAR(20),
    scrap_rate DECIMAL(5,4) DEFAULT 0,
    is_optional BOOLEAN DEFAULT false,
    sequence INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Routing (Manufacturing Process)
CREATE TABLE routings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    version INTEGER DEFAULT 1,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    effective_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    total_estimated_time DECIMAL(10,2),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, version)
);

-- Routing Operations
CREATE TABLE routing_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    routing_id UUID REFERENCES routings(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    work_center_id UUID REFERENCES work_centers(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_time_minutes DECIMAL(10,2),
    setup_time_minutes DECIMAL(10,2) DEFAULT 0,
    is_quality_check_required BOOLEAN DEFAULT false,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Orders
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    order_number VARCHAR(50) NOT NULL,
    product_id UUID REFERENCES products(id),
    bom_id UUID REFERENCES boms(id),
    routing_id UUID REFERENCES routings(id),
    quantity_planned INTEGER NOT NULL,
    quantity_produced INTEGER DEFAULT 0,
    quantity_scrap INTEGER DEFAULT 0,
    quantity_rework INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, RELEASED, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD
    priority VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    planned_start_date TIMESTAMP WITH TIME ZONE,
    planned_end_date TIMESTAMP WITH TIME ZONE,
    actual_start_date TIMESTAMP WITH TIME ZONE,
    actual_end_date TIMESTAMP WITH TIME ZONE,
    assigned_work_center_id UUID REFERENCES work_centers(id),
    notes TEXT,
    custom_fields JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    released_by UUID REFERENCES users(id),
    released_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES users(id),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, order_number)
);

-- Work Order Operations
CREATE TABLE work_order_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
    routing_operation_id UUID REFERENCES routing_operations(id),
    sequence INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED
    estimated_time_minutes DECIMAL(10,2),
    actual_time_minutes DECIMAL(10,2),
    setup_start_at TIMESTAMP WITH TIME ZONE,
    setup_end_at TIMESTAMP WITH TIME ZONE,
    start_at TIMESTAMP WITH TIME ZONE,
    end_at TIMESTAMP WITH TIME ZONE,
    operator_id UUID REFERENCES users(id),
    quantity_good INTEGER DEFAULT 0,
    quantity_scrap INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Production Transactions
CREATE TABLE production_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID REFERENCES work_orders(id),
    work_order_operation_id UUID REFERENCES work_order_operations(id),
    transaction_type VARCHAR(50) NOT NULL, -- PRODUCTION, SCRAP, REWORK
    product_id UUID REFERENCES products(id),
    quantity DECIMAL(12,4) NOT NULL,
    unit_of_measure VARCHAR(20),
    lot_number VARCHAR(100),
    serial_number VARCHAR(100),
    operator_id UUID REFERENCES users(id),
    work_center_id UUID REFERENCES work_centers(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OEE Data
CREATE TABLE oee_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_center_id UUID REFERENCES work_centers(id),
    shift_date DATE NOT NULL,
    shift_number INTEGER DEFAULT 1,
    availability DECIMAL(5,2) DEFAULT 0,
    performance DECIMAL(5,2) DEFAULT 0,
    quality DECIMAL(5,2) DEFAULT 0,
    oee DECIMAL(5,2) DEFAULT 0,
    planned_production_time INTEGER, -- minutes
    actual_production_time INTEGER,
    ideal_cycle_time DECIMAL(10,2), -- seconds
    total_pieces INTEGER,
    good_pieces INTEGER,
    scrap_pieces INTEGER,
    downtime_minutes INTEGER DEFAULT 0,
    downtime_reasons JSONB DEFAULT '[]',
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INVENTORY MODULE
-- ==========================================

-- Warehouses
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- RAW_MATERIAL, FINISHED_GOOD, WIP, QUARANTINE
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, code)
);

-- Warehouse Locations
CREATE TABLE warehouse_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255),
    zone VARCHAR(50),
    aisle VARCHAR(20),
    rack VARCHAR(20),
    level VARCHAR(20),
    position VARCHAR(20),
    max_weight DECIMAL(10,2),
    max_volume DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(warehouse_id, code)
);

-- Inventory
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    warehouse_id UUID REFERENCES warehouses(id),
    location_id UUID REFERENCES warehouse_locations(id),
    lot_number VARCHAR(100),
    serial_number VARCHAR(100),
    quantity_on_hand DECIMAL(12,4) DEFAULT 0,
    quantity_reserved DECIMAL(12,4) DEFAULT 0,
    quantity_available DECIMAL(12,4) GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
    unit_cost DECIMAL(12,4),
    expiration_date DATE,
    received_at TIMESTAMP WITH TIME ZONE,
    last_movement_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, warehouse_id, location_id, lot_number, serial_number)
);

-- Inventory Transactions
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_type VARCHAR(50) NOT NULL, -- RECEIPT, ISSUE, TRANSFER, ADJUSTMENT, CONSUMPTION, PRODUCTION
    product_id UUID REFERENCES products(id),
    warehouse_id UUID REFERENCES warehouses(id),
    location_id UUID REFERENCES warehouse_locations(id),
    lot_number VARCHAR(100),
    serial_number VARCHAR(100),
    quantity DECIMAL(12,4) NOT NULL,
    unit_of_measure VARCHAR(20),
    unit_cost DECIMAL(12,4),
    reference_type VARCHAR(50), -- WORK_ORDER, PURCHASE_ORDER, etc.
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- QUALITY MODULE
-- ==========================================

-- Non-Conformities (NCR)
CREATE TABLE non_conformities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    ncr_number VARCHAR(50) NOT NULL,
    type VARCHAR(50), -- INTERNAL, EXTERNAL, CUSTOMER_COMPLAINT
    source VARCHAR(50), -- PRODUCTION, INCOMING, IN_PROCESS, FINAL, CUSTOMER
    severity VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, IN_INVESTIGATION, CAPA_DEFINED, CLOSED
    product_id UUID REFERENCES products(id),
    work_order_id UUID REFERENCES work_orders(id),
    lot_number VARCHAR(100),
    quantity_affected INTEGER,
    quantity_quarantined INTEGER,
    quantity_scrap INTEGER,
    quantity_rework INTEGER,
    description TEXT NOT NULL,
    immediate_action TEXT,
    root_cause TEXT,
    corrective_action TEXT,
    preventive_action TEXT,
    detected_by UUID REFERENCES users(id),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_to UUID REFERENCES users(id),
    closed_by UUID REFERENCES users(id),
    closed_at TIMESTAMP WITH TIME ZONE,
    closure_notes TEXT,
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, ncr_number)
);

-- Quality Inspections
CREATE TABLE quality_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_number VARCHAR(50) NOT NULL,
    inspection_type VARCHAR(50), -- INCOMING, IN_PROCESS, FINAL, FIRST_PIECE
    reference_type VARCHAR(50), -- WORK_ORDER, PURCHASE_ORDER
    reference_id UUID,
    product_id UUID REFERENCES products(id),
    lot_number VARCHAR(100),
    quantity_inspected INTEGER,
    quantity_passed INTEGER,
    quantity_failed INTEGER,
    result VARCHAR(20), -- PASS, FAIL, CONDITIONAL
    inspected_by UUID REFERENCES users(id),
    inspected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quality Checklists
CREATE TABLE quality_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    name VARCHAR(255) NOT NULL,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quality Checklist Items
CREATE TABLE quality_checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_id UUID REFERENCES quality_checklists(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    description TEXT NOT NULL,
    check_type VARCHAR(50), -- VISUAL, MEASUREMENT, FUNCTIONAL
    specification TEXT,
    tolerance_min DECIMAL(12,4),
    tolerance_max DECIMAL(12,4),
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_work_orders_company ON work_orders(company_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_dates ON work_orders(planned_start_date, planned_end_date);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX idx_inventory_lot ON inventory(lot_number);
CREATE INDEX idx_ncr_company ON non_conformities(company_id);
CREATE INDEX idx_ncr_status ON non_conformities(status);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_oee_workcenter_date ON oee_data(work_center_id, shift_date);

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
