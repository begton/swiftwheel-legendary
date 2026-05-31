-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2026 at 10:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `swiftwheel_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `account_status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customer_name`, `contact_number`, `email`, `city`, `address`, `account_status`, `created_at`, `updated_at`) VALUES
(1, 'ABC Retail Store', '+254712000001', 'supplier@abcretail.com', 'Nairobi', '123 Mombasa Road', 'active', '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(2, 'Kenya Wholesalers Ltd', '+254712000002', 'info@kenyawholesale.com', 'Kisumu', '456 Juja Road', 'active', '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(3, 'Fresh Produce Mart', '+254712000003', 'sales@freshproduce.com', 'Eldoret', '789 Uhuru Street', 'active', '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(4, 'Construction Supplies Co', '+254712000004', 'orders@connsupply.com', 'Mombasa', '321 Digo Road', 'active', '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(5, 'Express Logistics Hub', '+254712000005', 'dispatch@expresslog.com', 'Nairobi', '654 Industrial Area', 'active', '2026-05-29 15:16:50', '2026-05-29 15:16:50');

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `driver_name` varchar(100) NOT NULL,
  `license_number` varchar(100) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `employment_status` enum('active','on_leave','terminated') DEFAULT 'active',
  `date_of_birth` date DEFAULT NULL,
  `license_expiry` date NOT NULL,
  `violations` int(11) DEFAULT 0,
  `accidents` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`id`, `user_id`, `driver_name`, `license_number`, `contact_number`, `email`, `employment_status`, `date_of_birth`, `license_expiry`, `violations`, `accidents`, `created_at`, `updated_at`) VALUES
(1, 4, 'John Kamau', 'DL12345', '+254712345678', 'john@example.com', 'active', '1985-05-15', '2026-05-15', 0, 0, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(2, NULL, 'Peter Mwangi', 'DL12346', '+254712345679', 'peter@example.com', 'active', '1988-08-20', '2025-08-20', 2, 1, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(3, NULL, 'Alice Omondi', 'DL12347', '+254712345680', 'alice@example.com', 'active', '1990-03-10', '2026-03-10', 0, 0, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(4, NULL, 'David Kipchoge', 'DL12348', '+254712345681', 'david@example.com', 'on_leave', '1992-12-05', '2025-12-05', 1, 0, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(5, NULL, 'Sarah Njeri', 'DL12349', '+254712345682', 'sarah@example.com', 'active', '1987-07-22', '2026-07-22', 0, 0, '2026-05-29 15:16:50', '2026-05-29 15:16:50');

-- --------------------------------------------------------

--
-- Table structure for table `fuel_logs`
--

CREATE TABLE `fuel_logs` (
  `id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `trip_id` int(11) DEFAULT NULL,
  `fuel_quantity` decimal(10,2) NOT NULL,
  `fuel_cost` decimal(10,2) NOT NULL,
  `fuel_station` varchar(100) DEFAULT NULL,
  `mileage_at_fill` decimal(10,2) DEFAULT NULL,
  `fuel_type` varchar(50) DEFAULT NULL,
  `log_date` date NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fuel_logs`
--

INSERT INTO `fuel_logs` (`id`, `vehicle_id`, `trip_id`, `fuel_quantity`, `fuel_cost`, `fuel_station`, `mileage_at_fill`, `fuel_type`, `log_date`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 15.00, 2250.00, 'Shell Nairobi', 45000.00, 'Diesel', '2024-01-20', 1, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(2, 2, 2, 20.00, 3000.00, 'Caltex Mombasa', 52000.00, 'Diesel', '2024-01-21', 1, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(3, 1, 3, 12.00, 1800.00, 'Shell Kisumu', 45350.00, 'Diesel', '2024-01-22', 1, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(4, 4, 4, 8.00, 1200.00, 'BP Nairobi', 28000.00, 'Petrol', '2024-01-23', 1, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(5, 3, NULL, 18.00, 2700.00, 'Total Maintenance', 38000.00, 'Diesel', '2024-01-24', 1, '2026-05-29 15:16:50', '2026-05-29 15:16:50');

-- --------------------------------------------------------

--
-- Table structure for table `gps_tracking`
--

CREATE TABLE `gps_tracking` (
  `id` int(11) NOT NULL,
  `trip_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `speed_kmh` decimal(10,2) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gps_tracking`
--

INSERT INTO `gps_tracking` (`id`, `trip_id`, `vehicle_id`, `latitude`, `longitude`, `speed_kmh`, `timestamp`, `created_at`) VALUES
(1, 1, 1, -1.28654000, 36.81667000, 85.00, '2024-01-20 06:15:00', '2026-05-29 15:16:50'),
(2, 1, 1, -1.28700000, 36.81700000, 87.00, '2024-01-20 06:30:00', '2026-05-29 15:16:50'),
(3, 1, 1, -1.28750000, 36.81750000, 90.00, '2024-01-20 06:45:00', '2026-05-29 15:16:50'),
(4, 2, 2, -4.04167000, 39.66869000, 95.00, '2024-01-21 04:30:00', '2026-05-29 15:16:50'),
(5, 3, 1, -0.30631000, 34.74950000, 75.00, '2024-01-22 08:00:00', '2026-05-29 15:16:50');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `trip_id` int(11) DEFAULT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` enum('unpaid','paid','partial','overdue') DEFAULT 'unpaid',
  `payment_method` varchar(100) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoice_number`, `customer_id`, `trip_id`, `invoice_date`, `due_date`, `amount`, `tax`, `total_amount`, `payment_status`, `payment_method`, `payment_date`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'INV-2024-001', 1, 1, '2024-01-20', '2024-02-20', 5000.00, 500.00, 5500.00, 'paid', 'bank_transfer', NULL, NULL, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(2, 'INV-2024-002', 2, 2, '2024-01-21', '2024-02-21', 7500.00, 750.00, 8250.00, 'paid', 'check', NULL, NULL, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(3, 'INV-2024-003', 3, 3, '2024-01-22', '2024-02-22', 4500.00, 450.00, 4950.00, 'unpaid', NULL, NULL, NULL, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(4, 'INV-2024-004', 4, 4, '2024-01-23', '2024-02-23', 3000.00, 300.00, 3300.00, 'partial', 'cash', NULL, NULL, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(5, 'INV-2024-005', 5, 5, '2024-01-24', '2024-02-24', 6000.00, 600.00, 6600.00, 'unpaid', NULL, NULL, NULL, '2026-05-29 15:16:50', '2026-05-29 15:16:50');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance`
--

CREATE TABLE `maintenance` (
  `id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `maintenance_type` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `maintenance_date` date NOT NULL,
  `estimated_cost` decimal(10,2) DEFAULT NULL,
  `actual_cost` decimal(10,2) DEFAULT NULL,
  `service_provider` varchar(100) DEFAULT NULL,
  `status` enum('scheduled','in_progress','completed','cancelled') DEFAULT 'scheduled',
  `spare_parts` text DEFAULT NULL,
  `mechanic_notes` text DEFAULT NULL,
  `next_service_date` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance`
--

INSERT INTO `maintenance` (`id`, `vehicle_id`, `maintenance_type`, `description`, `maintenance_date`, `estimated_cost`, `actual_cost`, `service_provider`, `status`, `spare_parts`, `mechanic_notes`, `next_service_date`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'Regular Service', 'Oil change and filter replacement', '2024-01-20', 3000.00, 3200.00, 'AutoCare Garage', 'completed', 'Oil, Air Filter', NULL, '2024-04-20', 1, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(2, 2, 'Tire Replacement', 'Replace front tires', '2024-01-19', 8000.00, 8500.00, 'Michelin Service', 'completed', 'Goodyear Tires x2', NULL, '2025-01-19', 1, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(3, 3, 'Engine Overhaul', 'Full engine maintenance', '2024-01-22', 15000.00, NULL, 'Expert Mechanics', 'in_progress', 'Engine gasket, Spark plugs', NULL, '2024-04-22', 1, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(4, 4, 'Brake Service', 'Brake pad replacement', '2024-01-15', 2500.00, 2500.00, 'Elite Auto Service', 'completed', 'Brake Pads', NULL, '2025-01-15', 1, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(5, 5, 'Scheduled Service', 'General checkup', '2024-01-25', 2000.00, NULL, 'Premium Motors', 'scheduled', NULL, NULL, '2024-04-25', 1, '2026-05-29 15:16:50', '2026-05-29 15:16:50');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `payment_amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` enum('cash','check','bank_transfer','credit_card') NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `reference_number` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `invoice_id`, `payment_amount`, `payment_date`, `payment_method`, `transaction_id`, `reference_number`, `notes`, `created_by`, `created_at`) VALUES
(1, 1, 5500.00, '2024-01-20', 'bank_transfer', 'TXN123456', 'REF001', NULL, 5, '2026-05-29 15:16:50'),
(2, 2, 8250.00, '2024-01-21', 'check', 'CHK123456', 'REF002', NULL, 5, '2026-05-29 15:16:50'),
(3, 4, 1650.00, '2024-01-23', 'cash', 'CASH001', 'REF003', NULL, 5, '2026-05-29 15:16:50');

-- --------------------------------------------------------

--
-- Table structure for table `trips`
--

CREATE TABLE `trips` (
  `id` int(11) NOT NULL,
  `trip_number` varchar(50) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `trip_date` date NOT NULL,
  `departure_time` time DEFAULT NULL,
  `arrival_time` time DEFAULT NULL,
  `origin_location` varchar(255) NOT NULL,
  `destination_location` varchar(255) NOT NULL,
  `distance_km` decimal(10,2) DEFAULT NULL,
  `trip_status` enum('scheduled','in_progress','completed','cancelled') DEFAULT 'scheduled',
  `cargo_description` text DEFAULT NULL,
  `cargo_weight` decimal(10,2) DEFAULT NULL,
  `fuel_used` decimal(10,2) DEFAULT NULL,
  `trip_cost` decimal(10,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trips`
--

INSERT INTO `trips` (`id`, `trip_number`, `vehicle_id`, `driver_id`, `customer_id`, `trip_date`, `departure_time`, `arrival_time`, `origin_location`, `destination_location`, `distance_km`, `trip_status`, `cargo_description`, `cargo_weight`, `fuel_used`, `trip_cost`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'TRP-2024-001', 1, 1, 1, '2024-01-20', '08:00:00', '12:30:00', 'Nairobi', 'Kisumu', 350.00, 'completed', 'Electronics shipment', 500.00, 15.00, 5000.00, NULL, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(2, 'TRP-2024-002', 2, 2, 2, '2024-01-21', '06:00:00', '14:00:00', 'Nairobi', 'Mombasa', 480.00, 'completed', 'Food products', 2500.00, 20.00, 7500.00, NULL, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(3, 'TRP-2024-003', 1, 1, 3, '2024-01-22', '07:30:00', NULL, 'Kisumu', 'Eldoret', 250.00, 'in_progress', 'Vegetables', 1800.00, NULL, 4500.00, NULL, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(4, 'TRP-2024-004', 4, 3, 4, '2024-01-23', '08:00:00', '18:00:00', 'Nairobi', 'Nakuru', 200.00, 'completed', 'Construction materials', 800.00, 8.00, 3000.00, NULL, '2026-05-29 15:16:50', '2026-05-29 15:16:50'),
(5, 'TRP-2024-005', 2, 5, 5, '2024-01-24', '09:00:00', NULL, 'Mombasa', 'Dar es Salaam', 400.00, 'scheduled', 'General cargo', 2000.00, NULL, 6000.00, NULL, '2026-05-29 15:16:50', '2026-05-29 15:16:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','fleet_manager','dispatcher','driver','accountant') NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@swiftwheel.com', '$2b$10$PfWuUgKME6oc2eYJy8vdPuLp0mdLNEA.WvbRooag6UmpNla0.Gtqy', 'admin', 'active', '2026-05-29 15:16:49', '2026-05-29 15:24:40'),
(2, 'manager1', 'manager@swiftwheel.com', 'hashed_password_123', 'fleet_manager', 'active', '2026-05-29 15:16:49', '2026-05-29 15:16:49'),
(3, 'dispatcher1', 'dispatcher@swiftwheel.com', 'hashed_password_123', 'dispatcher', 'active', '2026-05-29 15:16:49', '2026-05-29 15:16:49'),
(4, 'driver1', 'driver1@swiftwheel.com', 'hashed_password_123', 'driver', 'active', '2026-05-29 15:16:49', '2026-05-29 15:16:49'),
(5, 'accountant1', 'accountant@swiftwheel.com', 'hashed_password_123', 'accountant', 'active', '2026-05-29 15:16:49', '2026-05-29 15:16:49');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `vehicle_number` varchar(50) NOT NULL,
  `registration_number` varchar(50) NOT NULL,
  `model` varchar(100) NOT NULL,
  `capacity` int(11) NOT NULL,
  `purchase_date` date NOT NULL,
  `insurance_expiry` date NOT NULL,
  `status` enum('active','maintenance','inactive') DEFAULT 'active',
  `current_mileage` decimal(10,2) DEFAULT 0.00,
  `fuel_type` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `vehicle_number`, `registration_number`, `model`, `capacity`, `purchase_date`, `insurance_expiry`, `status`, `current_mileage`, `fuel_type`, `color`, `created_at`, `updated_at`) VALUES
(1, 'SWL-001', 'ABC123', 'Toyota Hiace 2020', 2000, '2020-01-15', '2025-01-15', 'active', 0.00, 'Diesel', 'White', '2026-05-29 15:16:49', '2026-05-29 15:16:49'),
(2, 'SWL-002', 'ABC124', 'Isuzu Truck 2019', 3000, '2019-05-20', '2024-05-20', 'active', 0.00, 'Diesel', 'Blue', '2026-05-29 15:16:49', '2026-05-29 15:16:49'),
(3, 'SWL-003', 'ABC125', 'Mercedes Sprinter 2021', 2500, '2021-03-10', '2026-03-10', 'maintenance', 0.00, 'Diesel', 'Black', '2026-05-29 15:16:49', '2026-05-29 15:16:49'),
(4, 'SWL-004', 'ABC126', 'Toyota Prado 2022', 800, '2022-07-25', '2027-07-25', 'active', 0.00, 'Petrol', 'Silver', '2026-05-29 15:16:49', '2026-05-29 15:16:49'),
(5, 'SWL-005', 'ABC127', 'Hyundai H350 2018', 2200, '2018-09-12', '2024-09-12', 'active', 0.00, 'Diesel', 'Gray', '2026-05-29 15:16:49', '2026-05-29 15:16:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `license_number` (`license_number`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_driver_employment` (`employment_status`);

--
-- Indexes for table `fuel_logs`
--
ALTER TABLE `fuel_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `trip_id` (`trip_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_fuel_log_date` (`log_date`);

--
-- Indexes for table `gps_tracking`
--
ALTER TABLE `gps_tracking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `trip_id` (`trip_id`),
  ADD KEY `timestamp` (`timestamp`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `trip_id` (`trip_id`),
  ADD KEY `idx_invoice_status` (`payment_status`);

--
-- Indexes for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_maintenance_status` (`status`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `trip_number` (`trip_number`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `idx_trip_status` (`trip_status`),
  ADD KEY `idx_trip_date` (`trip_date`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vehicle_number` (`vehicle_number`),
  ADD UNIQUE KEY `registration_number` (`registration_number`),
  ADD KEY `idx_vehicle_status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `fuel_logs`
--
ALTER TABLE `fuel_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `gps_tracking`
--
ALTER TABLE `gps_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `maintenance`
--
ALTER TABLE `maintenance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `trips`
--
ALTER TABLE `trips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `drivers`
--
ALTER TABLE `drivers`
  ADD CONSTRAINT `drivers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `fuel_logs`
--
ALTER TABLE `fuel_logs`
  ADD CONSTRAINT `fuel_logs_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fuel_logs_ibfk_2` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fuel_logs_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `gps_tracking`
--
ALTER TABLE `gps_tracking`
  ADD CONSTRAINT `gps_tracking_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gps_tracking_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `maintenance_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `trips`
--
ALTER TABLE `trips`
  ADD CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `trips_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `trips_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
