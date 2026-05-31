// src/pages/Invoices.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    trip_id: '',
    amount: '',
    tax: '',
  });

  useEffect(() => {
    fetchInvoices();
    fetchDropdownData();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [c, t] = await Promise.all([
        api.get('/customers'),
        api.get('/trips'),
      ]);
      setCustomers(c.data);
      setTrips(t.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/invoices', formData);
      fetchInvoices();
      setShowForm(false);
      setFormData({
        customer_id: '',
        trip_id: '',
        amount: '',
        tax: '',
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const columns = [
    { key: 'invoice_number', label: 'Invoice #' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'amount', label: 'Amount (KES)' },
    { key: 'total_amount', label: 'Total (KES)' },
    { key: 'invoice_date', label: 'Date' },
    { key: 'payment_status', label: 'Status' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
        >
          {showForm ? 'Cancel' : 'Create Invoice'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create Invoice</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer_name}
                </option>
              ))}
            </select>
            <select
              name="trip_id"
              value={formData.trip_id}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Trip (Optional)</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.trip_number}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              name="amount"
              placeholder="Amount (KES)"
              value={formData.amount}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="number"
              step="0.01"
              name="tax"
              placeholder="Tax (KES)"
              value={formData.tax}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              Create Invoice
            </button>
          </form>
        </div>
      )}

      <Table columns={columns} data={invoices} />
    </div>
  );
}

export default Invoices;
