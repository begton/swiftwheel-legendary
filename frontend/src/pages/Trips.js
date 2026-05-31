// src/pages/Trips.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';

function Trips() {
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    driver_id: '',
    customer_id: '',
    trip_date: '',
    origin_location: '',
    destination_location: '',
    cargo_description: '',
    trip_status: 'scheduled',
  });

  useEffect(() => {
    fetchTrips();
    fetchDropdownData();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips');
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [v, d, c] = await Promise.all([
        api.get('/vehicles'),
        api.get('/drivers'),
        api.get('/customers'),
      ]);
      setVehicles(v.data);
      setDrivers(d.data);
      setCustomers(c.data);
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
      if (editingId) {
        await api.put(`/trips/${editingId}`, formData);
      } else {
        await api.post('/trips', formData);
      }
      fetchTrips();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      vehicle_id: '',
      driver_id: '',
      customer_id: '',
      trip_date: '',
      origin_location: '',
      destination_location: '',
      cargo_description: '',
      trip_status: 'scheduled',
    });
  };

  const handleEdit = (trip) => {
    setFormData(trip);
    setEditingId(trip.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/trips/${id}`);
        fetchTrips();
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  const columns = [
    { key: 'trip_number', label: 'Trip #' },
    { key: 'vehicle_number', label: 'Vehicle' },
    { key: 'driver_name', label: 'Driver' },
    { key: 'origin_location', label: 'From' },
    { key: 'destination_location', label: 'To' },
    { key: 'trip_date', label: 'Date' },
    { key: 'trip_status', label: 'Status' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Trips</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
        >
          {showForm ? 'Cancel' : 'Create Trip'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Create'} Trip</h2>
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
                  {v.vehicle_number} - {v.model}
                </option>
              ))}
            </select>
            <select
              name="driver_id"
              value={formData.driver_id}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Driver</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.driver_name}
                </option>
              ))}
            </select>
            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer_name}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="trip_date"
              value={formData.trip_date}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              name="origin_location"
              placeholder="Origin Location"
              value={formData.origin_location}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              name="destination_location"
              placeholder="Destination Location"
              value={formData.destination_location}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <textarea
              name="cargo_description"
              placeholder="Cargo Description"
              value={formData.cargo_description}
              onChange={handleChange}
              className="md:col-span-2 border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              rows="3"
            ></textarea>
            <select
              name="trip_status"
              value={formData.trip_status}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              type="submit"
              className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              {editingId ? 'Update' : 'Create'} Trip
            </button>
          </form>
        </div>
      )}

      <Table
        columns={columns}
        data={trips}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Trips;
