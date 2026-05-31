// src/pages/Customers.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    contact_number: '',
    email: '',
    city: '',
    address: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      fetchCustomers();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        customer_name: '',
        contact_number: '',
        email: '',
        city: '',
        address: '',
      });
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const columns = [
    { key: 'customer_name', label: 'Name' },
    { key: 'contact_number', label: 'Contact' },
    { key: 'email', label: 'Email' },
    { key: 'city', label: 'City' },
    { key: 'account_status', label: 'Status' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
        >
          {showForm ? 'Cancel' : 'Add Customer'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Customer</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="customer_name"
              placeholder="Customer Name"
              value={formData.customer_name}
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
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="md:col-span-2 border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              rows="3"
            ></textarea>
            <button
              type="submit"
              className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              {editingId ? 'Update' : 'Add'} Customer
            </button>
          </form>
        </div>
      )}

      <Table
        columns={columns}
        data={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Customers;
