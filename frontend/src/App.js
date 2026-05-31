// src/App.js - Main App Component
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import FuelLogs from './pages/FuelLogs';
import Maintenance from './pages/Maintenance';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <Router>
      {isAuthenticated && <Navbar onLogout={handleLogout} userRole={userRole} />}
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard userRole={userRole} /> : <Navigate to="/login" />}
        />
        <Route
          path="/vehicles"
          element={isAuthenticated ? <Vehicles /> : <Navigate to="/login" />}
        />
        <Route
          path="/drivers"
          element={isAuthenticated ? <Drivers /> : <Navigate to="/login" />}
        />
        <Route
          path="/trips"
          element={isAuthenticated ? <Trips /> : <Navigate to="/login" />}
        />
        <Route
          path="/fuel-logs"
          element={isAuthenticated ? <FuelLogs /> : <Navigate to="/login" />}
        />
        <Route
          path="/maintenance"
          element={isAuthenticated ? <Maintenance /> : <Navigate to="/login" />}
        />
        <Route
          path="/customers"
          element={isAuthenticated ? <Customers /> : <Navigate to="/login" />}
        />
        <Route
          path="/invoices"
          element={isAuthenticated ? <Invoices /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={isAuthenticated ? <Reports /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
