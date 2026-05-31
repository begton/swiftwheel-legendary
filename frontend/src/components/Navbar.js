// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onLogout, userRole }) {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold">
            SwiftWheels
          </Link>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">Dashboard</Link>
            {(userRole === 'admin' || userRole === 'fleet_manager') && (
              <>
                <Link to="/vehicles" className="hover:bg-blue-700 px-3 py-2 rounded">Vehicles</Link>
                <Link to="/drivers" className="hover:bg-blue-700 px-3 py-2 rounded">Drivers</Link>
              </>
            )}
            {(userRole === 'admin' || userRole === 'dispatcher') && (
              <Link to="/trips" className="hover:bg-blue-700 px-3 py-2 rounded">Trips</Link>
            )}
            {(userRole === 'admin' || userRole === 'fleet_manager') && (
              <>
                <Link to="/fuel-logs" className="hover:bg-blue-700 px-3 py-2 rounded">Fuel</Link>
                <Link to="/maintenance" className="hover:bg-blue-700 px-3 py-2 rounded">Maintenance</Link>
              </>
            )}
            <Link to="/customers" className="hover:bg-blue-700 px-3 py-2 rounded">Customers</Link>
            <Link to="/invoices" className="hover:bg-blue-700 px-3 py-2 rounded">Invoices</Link>
            {(userRole === 'admin' || userRole === 'fleet_manager' || userRole === 'accountant') && (
              <Link to="/reports" className="hover:bg-blue-700 px-3 py-2 rounded">Reports</Link>
            )}
          </div>

          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
