// src/pages/Vehicles.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    vehicle_number: '',
    registration_number: '',
    model: '',
    capacity: '',
    purchase_date: '',
    insurance_expiry: '',
    fuel_type: '',
    color: '',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

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
      if (editingId) {
        await api.put(`/vehicles/${editingId}`, formData);
      } else {
        await api.post('/vehicles', formData);
      }
      fetchVehicles();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        vehicle_number: '',
        registration_number: '',
        model: '',
        capacity: '',
        purchase_date: '',
        insurance_expiry: '',
        fuel_type: '',
        color: '',
      });
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const handleEdit = (vehicle) => {
    setFormData(vehicle);
    setEditingId(vehicle.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const columns = [
    { key: 'vehicle_number', label: 'Vehicle Number' },
    { key: 'model', label: 'Model' },
    { key: 'registration_number', label: 'Registration' },
    { key: 'capacity', label: 'Capacity (kg)' },
    { key: 'fuel_type', label: 'Fuel Type' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Vehicles</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
        >
          {showForm ? 'Cancel' : 'Add Vehicle'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Vehicle</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="vehicle_number"
              placeholder="Vehicle Number"
              value={formData.vehicle_number}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              name="registration_number"
              placeholder="Registration Number"
              value={formData.registration_number}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              name="model"
              placeholder="Model"
              value={formData.model}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity (kg)"
              value={formData.capacity}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="date"
              name="insurance_expiry"
              value={formData.insurance_expiry}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              name="fuel_type"
              placeholder="Fuel Type"
              value={formData.fuel_type}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="color"
              placeholder="Color"
              value={formData.color}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              {editingId ? 'Update' : 'Add'} Vehicle
            </button>
          </form>
        </div>
      )}

      <Table
        columns={columns}
        data={vehicles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Vehicles;
