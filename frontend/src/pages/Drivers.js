// src/pages/Drivers.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    driver_name: '',
    license_number: '',
    contact_number: '',
    email: '',
    date_of_birth: '',
    license_expiry: '',
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/drivers/${editingId}`, formData);
      } else {
        await api.post('/drivers', formData);
      }
      fetchDrivers();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error('Error saving driver:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      driver_name: '',
      license_number: '',
      contact_number: '',
      email: '',
      date_of_birth: '',
      license_expiry: '',
    });
  };

  const handleEdit = (driver) => {
    setFormData(driver);
    setEditingId(driver.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/drivers/${id}`);
        fetchDrivers();
      } catch (error) {
        console.error('Error deleting driver:', error);
      }
    }
  };

  const columns = [
    { key: 'driver_name', label: 'Name' },
    { key: 'license_number', label: 'License Number' },
    { key: 'contact_number', label: 'Contact' },
    { key: 'email', label: 'Email' },
    { key: 'employment_status', label: 'Status' },
    { key: 'accidents', label: 'Accidents' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Drivers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
        >
          {showForm ? 'Cancel' : 'Add Driver'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Driver</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="driver_name"
              placeholder="Driver Name"
              value={formData.driver_name}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              name="license_number"
              placeholder="License Number"
              value={formData.license_number}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="tel"
              name="contact_number"
              placeholder="Contact Number"
              value={formData.contact_number}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="date"
              name="license_expiry"
              value={formData.license_expiry}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              {editingId ? 'Update' : 'Add'} Driver
            </button>
          </form>
        </div>
      )}

      <Table
        columns={columns}
        data={drivers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Drivers;
