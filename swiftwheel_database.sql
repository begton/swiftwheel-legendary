-- SwiftWheels Fleet Management System - Database Setup
-- Copy and paste all queries below into XAMPP PhpMyAdmin

-- Create Database
CREATE DATABASE IF NOT EXISTS swiftwheel_db;
USE swiftwheel_db;

-- ============ USERS TABLE ============
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'fleet_manager', 'dispatcher', 'driver', 'accountant') NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============ VEHICLES TABLE ============
CREATE TABLE vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_number VARCHAR(50) UNIQUE NOT NULL,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  model VARCHAR(100) NOT NULL,
  capacity INT NOT NULL,
  purchase_date DATE NOT NULL,
  insurance_expiry DATE NOT NULL,
  status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
  current_mileage DECIMAL(10, 2) DEFAULT 0,
  fuel_type VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============ DRIVERS TABLE ============
CREATE TABLE drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  driver_name VARCHAR(100) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  employment_status ENUM('active', 'on_leave', 'terminated') DEFAULT 'active',
  date_of_birth DATE,
  license_expiry DATE NOT NULL,
  violations INT DEFAULT 0,
  accidents INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============ CUSTOMERS TABLE ============
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  city VARCHAR(100),
  address TEXT,
  account_status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============ TRIPS TABLE ============
CREATE TABLE trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_number VARCHAR(50) UNIQUE NOT NULL,
  vehicle_id INT NOT NULL,
  driver_id INT NOT NULL,
  customer_id INT,
  trip_date DATE NOT NULL,
  departure_time TIME,
  arrival_time TIME,
  origin_location VARCHAR(255) NOT NULL,
  destination_location VARCHAR(255) NOT NULL,
  distance_km DECIMAL(10, 2),
  trip_status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  cargo_description TEXT,
  cargo_weight DECIMAL(10, 2),
  fuel_used DECIMAL(10, 2),
  trip_cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- ============ FUEL_LOGS TABLE ============
CREATE TABLE fuel_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id INT NOT NULL,
  trip_id INT,
  fuel_quantity DECIMAL(10, 2) NOT NULL,
  fuel_cost DECIMAL(10, 2) NOT NULL,
  fuel_station VARCHAR(100),
  mileage_at_fill DECIMAL(10, 2),
  fuel_type VARCHAR(50),
  log_date DATE NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============ MAINTENANCE TABLE ============
CREATE TABLE maintenance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id INT NOT NULL,
  maintenance_type VARCHAR(100) NOT NULL,
  description TEXT,
  maintenance_date DATE NOT NULL,
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  service_provider VARCHAR(100),
  status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  spare_parts TEXT,
  mechanic_notes TEXT,
  next_service_date DATE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============ INVOICES TABLE ============
CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INT NOT NULL,
  trip_id INT,
  invoice_date DATE NOT NULL,
  due_date DATE,
  amount DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2),
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status ENUM('unpaid', 'paid', 'partial', 'overdue') DEFAULT 'unpaid',
  payment_method VARCHAR(100),
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL
);

-- ============ GPS_TRACKING TABLE ============
CREATE TABLE gps_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  speed_kmh DECIMAL(10, 2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  INDEX (vehicle_id),
  INDEX (trip_id),
  INDEX (timestamp)
);

-- ============ PAYMENTS TABLE ============
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  payment_amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method ENUM('cash', 'check', 'bank_transfer', 'credit_card') NOT NULL,
  transaction_id VARCHAR(100),
  reference_number VARCHAR(100),
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============ INSERT SAMPLE DATA ============

-- Insert sample users
INSERT INTO users (username, email, password, role, status) VALUES
('admin', 'admin@swiftwheel.com', 'hashed_password_123', 'admin', 'active'),
('manager1', 'manager@swiftwheel.com', 'hashed_password_123', 'fleet_manager', 'active'),
('dispatcher1', 'dispatcher@swiftwheel.com', 'hashed_password_123', 'dispatcher', 'active'),
('driver1', 'driver1@swiftwheel.com', 'hashed_password_123', 'driver', 'active'),
('accountant1', 'accountant@swiftwheel.com', 'hashed_password_123', 'accountant', 'active');

-- Insert sample vehicles
INSERT INTO vehicles (vehicle_number, registration_number, model, capacity, purchase_date, insurance_expiry, status, fuel_type, color) VALUES
('SWL-001', 'ABC123', 'Toyota Hiace 2020', 2000, '2020-01-15', '2025-01-15', 'active', 'Diesel', 'White'),
('SWL-002', 'ABC124', 'Isuzu Truck 2019', 3000, '2019-05-20', '2024-05-20', 'active', 'Diesel', 'Blue'),
('SWL-003', 'ABC125', 'Mercedes Sprinter 2021', 2500, '2021-03-10', '2026-03-10', 'maintenance', 'Diesel', 'Black'),
('SWL-004', 'ABC126', 'Toyota Prado 2022', 800, '2022-07-25', '2027-07-25', 'active', 'Petrol', 'Silver'),
('SWL-005', 'ABC127', 'Hyundai H350 2018', 2200, '2018-09-12', '2024-09-12', 'active', 'Diesel', 'Gray');

-- Insert sample drivers
INSERT INTO drivers (user_id, driver_name, license_number, contact_number, email, employment_status, date_of_birth, license_expiry, violations, accidents) VALUES
(4, 'John Kamau', 'DL12345', '+254712345678', 'john@example.com', 'active', '1985-05-15', '2026-05-15', 0, 0),
(NULL, 'Peter Mwangi', 'DL12346', '+254712345679', 'peter@example.com', 'active', '1988-08-20', '2025-08-20', 2, 1),
(NULL, 'Alice Omondi', 'DL12347', '+254712345680', 'alice@example.com', 'active', '1990-03-10', '2026-03-10', 0, 0),
(NULL, 'David Kipchoge', 'DL12348', '+254712345681', 'david@example.com', 'on_leave', '1992-12-05', '2025-12-05', 1, 0),
(NULL, 'Sarah Njeri', 'DL12349', '+254712345682', 'sarah@example.com', 'active', '1987-07-22', '2026-07-22', 0, 0);

-- Insert sample customers
INSERT INTO customers (customer_name, contact_number, email, city, address, account_status) VALUES
('ABC Retail Store', '+254712000001', 'supplier@abcretail.com', 'Nairobi', '123 Mombasa Road', 'active'),
('Kenya Wholesalers Ltd', '+254712000002', 'info@kenyawholesale.com', 'Kisumu', '456 Juja Road', 'active'),
('Fresh Produce Mart', '+254712000003', 'sales@freshproduce.com', 'Eldoret', '789 Uhuru Street', 'active'),
('Construction Supplies Co', '+254712000004', 'orders@connsupply.com', 'Mombasa', '321 Digo Road', 'active'),
('Express Logistics Hub', '+254712000005', 'dispatch@expresslog.com', 'Nairobi', '654 Industrial Area', 'active');

-- Insert sample trips
INSERT INTO trips (trip_number, vehicle_id, driver_id, customer_id, trip_date, departure_time, arrival_time, origin_location, destination_location, distance_km, trip_status, cargo_description, cargo_weight, fuel_used, trip_cost) VALUES
('TRP-2024-001', 1, 1, 1, '2024-01-20', '08:00:00', '12:30:00', 'Nairobi', 'Kisumu', 350, 'completed', 'Electronics shipment', 500, 15, 5000),
('TRP-2024-002', 2, 2, 2, '2024-01-21', '06:00:00', '14:00:00', 'Nairobi', 'Mombasa', 480, 'completed', 'Food products', 2500, 20, 7500),
('TRP-2024-003', 1, 1, 3, '2024-01-22', '07:30:00', NULL, 'Kisumu', 'Eldoret', 250, 'in_progress', 'Vegetables', 1800, NULL, 4500),
('TRP-2024-004', 4, 3, 4, '2024-01-23', '08:00:00', '18:00:00', 'Nairobi', 'Nakuru', 200, 'completed', 'Construction materials', 800, 8, 3000),
('TRP-2024-005', 2, 5, 5, '2024-01-24', '09:00:00', NULL, 'Mombasa', 'Dar es Salaam', 400, 'scheduled', 'General cargo', 2000, NULL, 6000);

-- Insert sample fuel logs
INSERT INTO fuel_logs (vehicle_id, trip_id, fuel_quantity, fuel_cost, fuel_station, mileage_at_fill, fuel_type, log_date, created_by) VALUES
(1, 1, 15, 2250, 'Shell Nairobi', 45000, 'Diesel', '2024-01-20', 1),
(2, 2, 20, 3000, 'Caltex Mombasa', 52000, 'Diesel', '2024-01-21', 1),
(1, 3, 12, 1800, 'Shell Kisumu', 45350, 'Diesel', '2024-01-22', 1),
(4, 4, 8, 1200, 'BP Nairobi', 28000, 'Petrol', '2024-01-23', 1),
(3, NULL, 18, 2700, 'Total Maintenance', 38000, 'Diesel', '2024-01-24', 1);

-- Insert sample maintenance records
INSERT INTO maintenance (vehicle_id, maintenance_type, description, maintenance_date, estimated_cost, actual_cost, service_provider, status, spare_parts, next_service_date, created_by) VALUES
(1, 'Regular Service', 'Oil change and filter replacement', '2024-01-20', 3000, 3200, 'AutoCare Garage', 'completed', 'Oil, Air Filter', '2024-04-20', 1),
(2, 'Tire Replacement', 'Replace front tires', '2024-01-19', 8000, 8500, 'Michelin Service', 'completed', 'Goodyear Tires x2', '2025-01-19', 1),
(3, 'Engine Overhaul', 'Full engine maintenance', '2024-01-22', 15000, NULL, 'Expert Mechanics', 'in_progress', 'Engine gasket, Spark plugs', '2024-04-22', 1),
(4, 'Brake Service', 'Brake pad replacement', '2024-01-15', 2500, 2500, 'Elite Auto Service', 'completed', 'Brake Pads', '2025-01-15', 1),
(5, 'Scheduled Service', 'General checkup', '2024-01-25', 2000, NULL, 'Premium Motors', 'scheduled', NULL, '2024-04-25', 1);

-- Insert sample invoices
INSERT INTO invoices (invoice_number, customer_id, trip_id, invoice_date, due_date, amount, tax, total_amount, payment_status, payment_method) VALUES
('INV-2024-001', 1, 1, '2024-01-20', '2024-02-20', 5000, 500, 5500, 'paid', 'bank_transfer'),
('INV-2024-002', 2, 2, '2024-01-21', '2024-02-21', 7500, 750, 8250, 'paid', 'check'),
('INV-2024-003', 3, 3, '2024-01-22', '2024-02-22', 4500, 450, 4950, 'unpaid', NULL),
('INV-2024-004', 4, 4, '2024-01-23', '2024-02-23', 3000, 300, 3300, 'partial', 'cash'),
('INV-2024-005', 5, 5, '2024-01-24', '2024-02-24', 6000, 600, 6600, 'unpaid', NULL);

-- Insert sample GPS tracking
INSERT INTO gps_tracking (trip_id, vehicle_id, latitude, longitude, speed_kmh, timestamp) VALUES
(1, 1, -1.28654, 36.81667, 85, '2024-01-20 08:15:00'),
(1, 1, -1.28700, 36.81700, 87, '2024-01-20 08:30:00'),
(1, 1, -1.28750, 36.81750, 90, '2024-01-20 08:45:00'),
(2, 2, -4.04167, 39.66869, 95, '2024-01-21 06:30:00'),
(3, 1, -0.30631, 34.74950, 75, '2024-01-22 10:00:00');

-- Insert sample payments
INSERT INTO payments (invoice_id, payment_amount, payment_date, payment_method, transaction_id, reference_number, created_by) VALUES
(1, 5500, '2024-01-20', 'bank_transfer', 'TXN123456', 'REF001', 5),
(2, 8250, '2024-01-21', 'check', 'CHK123456', 'REF002', 5),
(4, 1650, '2024-01-23', 'cash', 'CASH001', 'REF003', 5);

-- ============ CREATE INDEXES FOR PERFORMANCE ============
CREATE INDEX idx_vehicle_status ON vehicles(status);
CREATE INDEX idx_driver_employment ON drivers(employment_status);
CREATE INDEX idx_trip_status ON trips(trip_status);
CREATE INDEX idx_trip_date ON trips(trip_date);
CREATE INDEX idx_invoice_status ON invoices(payment_status);
CREATE INDEX idx_fuel_log_date ON fuel_logs(log_date);
CREATE INDEX idx_maintenance_status ON maintenance(status);

-- Display all tables to verify
SELECT 'Database setup complete!' AS status;
