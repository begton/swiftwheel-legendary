// src/pages/FuelLogs.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';

function FuelLogs() {
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    fuel_quantity: '',
    fuel_cost: '',
    fuel_station: '',
    log_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchFuelLogs();
    fetchVehicles();
  }, []);

  const fetchFuelLogs = async () => {
    try {
      const response = await api.get('/fuel-logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching fuel logs:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fuel-logs', formData);
      fetchFuelLogs();
      setShowForm(false);
      setFormData({
        vehicle_id: '',
        fuel_quantity: '',
        fuel_cost: '',
        fuel_station: '',
        log_date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error recording fuel log:', error);
    }
  };

  const columns = [
    { key: 'vehicle_number', label: 'Vehicle' },
    { key: 'fuel_quantity', label: 'Quantity (L)' },
    { key: 'fuel_cost', label: 'Cost (KES)' },
    { key: 'fuel_station', label: 'Station' },
    { key: 'log_date', label: 'Date' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Fuel Logs</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
        >
          {showForm ? 'Cancel' : 'Record Fuel'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Record Fuel Purchase</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="vehicle_id"
              value={formData.vehicle_id}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vehicle_number}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              name="fuel_quantity"
              placeholder="Quantity (Liters)"
              value={formData.fuel_quantity}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="number"
              step="0.01"
              name="fuel_cost"
              placeholder="Cost (KES)"
              value={formData.fuel_cost}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              name="fuel_station"
              placeholder="Fuel Station"
              value={formData.fuel_station}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="date"
              name="log_date"
              value={formData.log_date}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              Record Fuel Log
            </button>
          </form>
        </div>
      )}

      <Table columns={columns} data={logs} />
    </div>
  );
}

export default FuelLogs;
