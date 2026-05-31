// server.js - Main Express Server
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ==================== AUTHENTICATION ROUTES ====================

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validate input
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const connection = await pool.getConnection();
    
    // Check if user exists
    const [users] = await connection.query(
      'SELECT email FROM users WHERE email = ?',
      [email]
    );

    if (users.length > 0) {
      await connection.release();
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 8);

    // Insert user
    await connection.query(
      'INSERT INTO users SET ?',
      { username, email, password: hashedPassword, role, status: 'active' }
    );

    await connection.release();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      await connection.release();
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];
    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      await connection.release();
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await connection.release();
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== VEHICLE ROUTES ====================

// Get All Vehicles
app.get('/api/vehicles', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [vehicles] = await connection.query('SELECT * FROM vehicles');
    await connection.release();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
});

// Get Single Vehicle
app.get('/api/vehicles/:id', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [vehicles] = await connection.query(
      'SELECT * FROM vehicles WHERE id = ?',
      [req.params.id]
    );
    await connection.release();
    
    if (vehicles.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.status(200).json(vehicles[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle', error: error.message });
  }
});

// Add Vehicle
app.post('/api/vehicles', authMiddleware, async (req, res) => {
  try {
    const {
      vehicle_number, registration_number, model, capacity,
      purchase_date, insurance_expiry, fuel_type, color
    } = req.body;

    if (!vehicle_number || !registration_number || !model || !capacity) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const connection = await pool.getConnection();
    const result = await connection.query(
      'INSERT INTO vehicles SET ?',
      {
        vehicle_number, registration_number, model, capacity,
        purchase_date, insurance_expiry, fuel_type, color, status: 'active'
      }
    );
    await connection.release();

    res.status(201).json({
      message: 'Vehicle added successfully',
      id: result[0].insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding vehicle', error: error.message });
  }
});

// Update Vehicle
app.put('/api/vehicles/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE vehicles SET ? WHERE id = ?',
      [updateData, id]
    );
    await connection.release();

    res.status(200).json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating vehicle', error: error.message });
  }
});

// Delete Vehicle
app.delete('/api/vehicles/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.query('DELETE FROM vehicles WHERE id = ?', [id]);
    await connection.release();

    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
  }
});

// ==================== DRIVER ROUTES ====================

// Get All Drivers
app.get('/api/drivers', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [drivers] = await connection.query('SELECT * FROM drivers');
    await connection.release();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers', error: error.message });
  }
});

// Add Driver
app.post('/api/drivers', authMiddleware, async (req, res) => {
  try {
    const {
      driver_name, license_number, contact_number, email,
      date_of_birth, license_expiry
    } = req.body;

    if (!driver_name || !license_number || !contact_number || !license_expiry) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const connection = await pool.getConnection();
    const result = await connection.query(
      'INSERT INTO drivers SET ?',
      {
        driver_name, license_number, contact_number, email,
        date_of_birth, license_expiry, employment_status: 'active'
      }
    );
    await connection.release();

    res.status(201).json({
      message: 'Driver added successfully',
      id: result[0].insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding driver', error: error.message });
  }
});

// Update Driver
app.put('/api/drivers/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE drivers SET ? WHERE id = ?',
      [updateData, id]
    );
    await connection.release();

    res.status(200).json({ message: 'Driver updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating driver', error: error.message });
  }
});

// ==================== TRIP ROUTES ====================

// Get All Trips
app.get('/api/trips', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [trips] = await connection.query(`
      SELECT t.*, v.vehicle_number, d.driver_name, c.customer_name
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      LEFT JOIN drivers d ON t.driver_id = d.id
      LEFT JOIN customers c ON t.customer_id = c.id
      ORDER BY t.trip_date DESC
    `);
    await connection.release();
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
});

// Add Trip
app.post('/api/trips', authMiddleware, async (req, res) => {
  try {
    const {
      vehicle_id, driver_id, customer_id, trip_date,
      origin_location, destination_location, cargo_description
    } = req.body;

    if (!vehicle_id || !driver_id || !trip_date || !origin_location || !destination_location) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const trip_number = 'TRP-' + Date.now();
    const connection = await pool.getConnection();
    
    const result = await connection.query(
      'INSERT INTO trips SET ?',
      {
        trip_number, vehicle_id, driver_id, customer_id,
        trip_date, origin_location, destination_location,
        cargo_description, trip_status: 'scheduled'
      }
    );
    
    await connection.release();

    res.status(201).json({
      message: 'Trip created successfully',
      id: result[0].insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating trip', error: error.message });
  }
});

// Update Trip Status
app.put('/api/trips/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE trips SET ? WHERE id = ?',
      [updateData, id]
    );
    await connection.release();

    res.status(200).json({ message: 'Trip updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating trip', error: error.message });
  }
});

// ==================== FUEL LOG ROUTES ====================

// Get Fuel Logs
app.get('/api/fuel-logs', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [logs] = await connection.query(`
      SELECT f.*, v.vehicle_number
      FROM fuel_logs f
      LEFT JOIN vehicles v ON f.vehicle_id = v.id
      ORDER BY f.log_date DESC
    `);
    await connection.release();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fuel logs', error: error.message });
  }
});

// Add Fuel Log
app.post('/api/fuel-logs', authMiddleware, async (req, res) => {
  try {
    const { vehicle_id, fuel_quantity, fuel_cost, fuel_station, log_date } = req.body;

    if (!vehicle_id || !fuel_quantity || !fuel_cost) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const connection = await pool.getConnection();
    const result = await connection.query(
      'INSERT INTO fuel_logs SET ?',
      {
        vehicle_id, fuel_quantity, fuel_cost, fuel_station,
        log_date: log_date || new Date().toISOString().split('T')[0],
        created_by: req.user.id
      }
    );
    await connection.release();

    res.status(201).json({
      message: 'Fuel log recorded successfully',
      id: result[0].insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recording fuel log', error: error.message });
  }
});

// ==================== MAINTENANCE ROUTES ====================

// Get Maintenance Records
app.get('/api/maintenance', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [maintenance] = await connection.query(`
      SELECT m.*, v.vehicle_number
      FROM maintenance m
      LEFT JOIN vehicles v ON m.vehicle_id = v.id
      ORDER BY m.maintenance_date DESC
    `);
    await connection.release();
    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching maintenance records', error: error.message });
  }
});

// Add Maintenance Record
app.post('/api/maintenance', authMiddleware, async (req, res) => {
  try {
    const {
      vehicle_id, maintenance_type, description,
      maintenance_date, estimated_cost, service_provider
    } = req.body;

    if (!vehicle_id || !maintenance_type || !maintenance_date) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const connection = await pool.getConnection();
    const result = await connection.query(
      'INSERT INTO maintenance SET ?',
      {
        vehicle_id, maintenance_type, description,
        maintenance_date, estimated_cost, service_provider,
        status: 'scheduled', created_by: req.user.id
      }
    );
    await connection.release();

    res.status(201).json({
      message: 'Maintenance record created successfully',
      id: result[0].insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating maintenance record', error: error.message });
  }
});

// ==================== CUSTOMER ROUTES ====================

// Get All Customers
app.get('/api/customers', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [customers] = await connection.query('SELECT * FROM customers');
    await connection.release();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
});

// Add Customer
app.post('/api/customers', authMiddleware, async (req, res) => {
  try {
    const { customer_name, contact_number, email, city, address } = req.body;

    if (!customer_name || !contact_number) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const connection = await pool.getConnection();
    const result = await connection.query(
      'INSERT INTO customers SET ?',
      { customer_name, contact_number, email, city, address, account_status: 'active' }
    );
    await connection.release();

    res.status(201).json({
      message: 'Customer added successfully',
      id: result[0].insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding customer', error: error.message });
  }
});

// ==================== INVOICE ROUTES ====================

// Get All Invoices
app.get('/api/invoices', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [invoices] = await connection.query(`
      SELECT i.*, c.customer_name
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      ORDER BY i.invoice_date DESC
    `);
    await connection.release();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
  }
});

// Create Invoice
app.post('/api/invoices', authMiddleware, async (req, res) => {
  try {
    const { customer_id, trip_id, amount, tax } = req.body;

    if (!customer_id || !amount) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const invoice_number = 'INV-' + Date.now();
    const total_amount = parseFloat(amount) + (parseFloat(tax) || 0);
    const invoice_date = new Date().toISOString().split('T')[0];
    const due_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const connection = await pool.getConnection();
    const result = await connection.query(
      'INSERT INTO invoices SET ?',
      {
        invoice_number, customer_id, trip_id, amount, tax, total_amount,
        invoice_date, due_date, payment_status: 'unpaid'
      }
    );
    await connection.release();

    res.status(201).json({
      message: 'Invoice created successfully',
      id: result[0].insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating invoice', error: error.message });
  }
});

// ==================== REPORTS ROUTES ====================

// Vehicle Utilization Report
app.get('/api/reports/vehicle-utilization', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [report] = await connection.query(`
      SELECT
        v.id, v.vehicle_number, v.model,
        COUNT(t.id) as total_trips,
        SUM(CASE WHEN t.trip_status = 'completed' THEN 1 ELSE 0 END) as completed_trips,
        SUM(t.distance_km) as total_distance,
        AVG(t.distance_km) as avg_distance
      FROM vehicles v
      LEFT JOIN trips t ON v.id = t.vehicle_id
      GROUP BY v.id, v.vehicle_number, v.model
    `);
    await connection.release();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// Fuel Consumption Report
app.get('/api/reports/fuel-consumption', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [report] = await connection.query(`
      SELECT
        v.vehicle_number, v.model,
        SUM(f.fuel_quantity) as total_fuel,
        SUM(f.fuel_cost) as total_cost,
        AVG(f.fuel_quantity) as avg_fuel_per_fill,
        COUNT(f.id) as fill_count
      FROM fuel_logs f
      LEFT JOIN vehicles v ON f.vehicle_id = v.id
      GROUP BY f.vehicle_id, v.vehicle_number, v.model
    `);
    await connection.release();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// Revenue Report
app.get('/api/reports/revenue', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [report] = await connection.query(`
      SELECT
        DATE(invoice_date) as date,
        COUNT(id) as invoice_count,
        SUM(amount) as total_revenue,
        SUM(CASE WHEN payment_status = 'paid' THEN amount ELSE 0 END) as paid_amount,
        SUM(CASE WHEN payment_status = 'unpaid' THEN amount ELSE 0 END) as unpaid_amount
      FROM invoices
      GROUP BY DATE(invoice_date)
      ORDER BY date DESC
    `);
    await connection.release();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SwiftWheels Backend Server running on port ${PORT}`);
});

module.exports = app;
