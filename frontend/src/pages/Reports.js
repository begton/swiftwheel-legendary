// src/pages/Reports.js
import React, { useEffect, useState } from 'react';
import api from '../api';

function Reports() {
  const [vehicleReport, setVehicleReport] = useState([]);
  const [fuelReport, setFuelReport] = useState([]);
  const [revenueReport, setRevenueReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [v, f, r] = await Promise.all([
        api.get('/reports/vehicle-utilization'),
        api.get('/reports/fuel-consumption'),
        api.get('/reports/revenue'),
      ]);
      setVehicleReport(v.data);
      setFuelReport(f.data);
      setRevenueReport(r.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 p-6">Loading reports...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Fleet Reports</h1>

      {/* Vehicle Utilization Report */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Vehicle Utilization Report</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left border-b">Vehicle #</th>
                <th className="px-6 py-3 text-left border-b">Model</th>
                <th className="px-6 py-3 text-left border-b">Total Trips</th>
                <th className="px-6 py-3 text-left border-b">Completed</th>
                <th className="px-6 py-3 text-left border-b">Total Distance (km)</th>
                <th className="px-6 py-3 text-left border-b">Avg Distance</th>
              </tr>
            </thead>
            <tbody>
              {vehicleReport.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{row.vehicle_number}</td>
                  <td className="px-6 py-4">{row.model}</td>
                  <td className="px-6 py-4">{row.total_trips || 0}</td>
                  <td className="px-6 py-4">{row.completed_trips || 0}</td>
                  <td className="px-6 py-4">{row.total_distance ? row.total_distance.toFixed(2) : 0}</td>
                  <td className="px-6 py-4">{row.avg_distance ? row.avg_distance.toFixed(2) : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fuel Consumption Report */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Fuel Consumption Report</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left border-b">Vehicle #</th>
                <th className="px-6 py-3 text-left border-b">Model</th>
                <th className="px-6 py-3 text-left border-b">Total Fuel (L)</th>
                <th className="px-6 py-3 text-left border-b">Total Cost (KES)</th>
                <th className="px-6 py-3 text-left border-b">Avg Fuel/Fill</th>
                <th className="px-6 py-3 text-left border-b">Fill Count</th>
              </tr>
            </thead>
            <tbody>
              {fuelReport.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{row.vehicle_number}</td>
                  <td className="px-6 py-4">{row.model}</td>
                  <td className="px-6 py-4">{row.total_fuel ? row.total_fuel.toFixed(2) : 0}</td>
                  <td className="px-6 py-4">{row.total_cost ? row.total_cost.toFixed(2) : 0}</td>
                  <td className="px-6 py-4">{row.avg_fuel_per_fill ? row.avg_fuel_per_fill.toFixed(2) : 0}</td>
                  <td className="px-6 py-4">{row.fill_count || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Report */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Revenue Report</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left border-b">Date</th>
                <th className="px-6 py-3 text-left border-b">Invoices</th>
                <th className="px-6 py-3 text-left border-b">Total Revenue (KES)</th>
                <th className="px-6 py-3 text-left border-b">Paid (KES)</th>
                <th className="px-6 py-3 text-left border-b">Unpaid (KES)</th>
              </tr>
            </thead>
            <tbody>
              {revenueReport.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{row.date}</td>
                  <td className="px-6 py-4">{row.invoice_count}</td>
                  <td className="px-6 py-4">{row.total_revenue ? row.total_revenue.toFixed(2) : 0}</td>
                  <td className="px-6 py-4">{row.paid_amount ? row.paid_amount.toFixed(2) : 0}</td>
                  <td className="px-6 py-4">{row.unpaid_amount ? row.unpaid_amount.toFixed(2) : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
