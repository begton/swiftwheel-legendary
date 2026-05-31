// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../api';

function Dashboard({ userRole }) {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalDrivers: 0,
    activeTrips: 0,
    totalCustomers: 0,
    pendingInvoices: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [vehicles, drivers, trips, customers, invoices] = await Promise.all([
        api.get('/vehicles'),
        api.get('/drivers'),
        api.get('/trips'),
        api.get('/customers'),
        api.get('/invoices'),
      ]);

      setStats({
        totalVehicles: vehicles.data.length,
        totalDrivers: drivers.data.length,
        activeTrips: trips.data.filter((t) => t.trip_status === 'in_progress').length,
        totalCustomers: customers.data.length,
        pendingInvoices: invoices.data.filter((i) => i.payment_status === 'unpaid').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`${color} rounded-lg shadow-lg p-6 text-white`}>
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Vehicles"
          value={stats.totalVehicles}
          icon="🚗"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Drivers"
          value={stats.totalDrivers}
          icon="👨‍💼"
          color="bg-green-500"
        />
        <StatCard
          title="Active Trips"
          value={stats.activeTrips}
          icon="📍"
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon="👥"
          color="bg-purple-500"
        />
        <StatCard
          title="Pending Invoices"
          value={stats.pendingInvoices}
          icon="📋"
          color="bg-red-500"
        />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to SwiftWheels</h2>
        <p className="text-gray-600 mb-4">
          SwiftWheels Fleet Management System helps you manage all your fleet operations efficiently.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold text-blue-700 mb-2">Key Features</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Vehicle Management</li>
              <li>✓ Driver Tracking</li>
              <li>✓ Trip Scheduling</li>
              <li>✓ Fuel Monitoring</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold text-green-700 mb-2">More Features</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Maintenance Tracking</li>
              <li>✓ Invoice Management</li>
              <li>✓ GPS Tracking</li>
              <li>✓ Comprehensive Reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
