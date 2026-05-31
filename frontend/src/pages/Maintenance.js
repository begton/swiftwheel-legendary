// src/pages/Maintenance.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';

function Maintenance() {
  const [maintenance, setMaintenance] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    maintenance_type: '',
    description: '',
    maintenance_date: '',
    estimated_cost: '',
    service_provider: '',
    status: 'scheduled',
  });

  useEffect(() => {
    fetchMaintenance();
    fetchVehicles();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const response = await api.get('/maintenance');
      setMaintenance(response.data);
    } catch (error) {
      console.error('Error fetching maintenance:', error);
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
      await api.post('/maintenance', formData);
      fetchMaintenance();
      setShowForm(false);
      setFormData({
        vehicle_id: '',
        maintenance_type: '',
        description: '',
        maintenance_date: '',
        estimated_cost: '',
        service_provider: '',
        status: 'scheduled',
      });
    } catch (error) {
      console.error('Error saving maintenance:', error);
    }
  };

  const columns = [
    { key: 'vehicle_number', label: 'Vehicle' },
    { key: 'maintenance_type', label: 'Type' },
    { key: 'maintenance_date', label: 'Date' },
    { key: 'estimated_cost', label: 'Est. Cost' },
    { key: 'service_provider', label: 'Provider' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Maintenance</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
        >
          {showForm ? 'Cancel' : 'Schedule Maintenance'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Schedule Maintenance</h2>
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
              type="text"
              name="maintenance_type"
              placeholder="Maintenance Type"
              value={formData.maintenance_type}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="date"
              name="maintenance_date"
              value={formData.maintenance_date}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="number"
              step="0.01"
              name="estimated_cost"
              placeholder="Estimated Cost"
              value={formData.estimated_cost}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="service_provider"
              placeholder="Service Provider"
              value={formData.service_provider}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="md:col-span-2 border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              rows="3"
            ></textarea>
            <button
              type="submit"
              className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              Schedule Maintenance
            </button>
          </form>
        </div>
      )}

      <Table columns={columns} data={maintenance} />
    </div>
  );
}

export default Maintenance;
