// src/pages/admin/ManageTrucks.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';

const ManageTrucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ truckNumber: '', capacity: 500, status: 'Available', currentBranch: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrucks();
    fetchBranches();
  }, []);

  const fetchTrucks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/trucks');
      setTrucks(response.data.data);
    } catch (err) {
      console.error('Error fetching trucks:', err);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/branches');
      setBranches(response.data.data);
      if (response.data.data.length > 0) {
        setFormData(prev => ({...prev, currentBranch: response.data.data[0]._id}));
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/trucks', formData);
      setFormData({ truckNumber: '', capacity: 500, status: 'Available', currentBranch: branches[0]?._id || '' });
      fetchTrucks(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add truck');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this truck? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/trucks/${id}`);
        fetchTrucks(); // Refresh the list
      } catch (err) {
        console.error('Error deleting truck:', err);
        setError(err.response?.data?.message || 'Failed to delete truck');
      }
    }
  };

  // --- NEW COLOR FUNCTION ---
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Dispatched': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  // --- END NEW FUNCTION ---

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Trucks</h2>

          {/* Add Truck Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4">Add New Truck</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="truckNumber"
                value={formData.truckNumber}
                onChange={handleChange}
                placeholder="Truck Number (e.g., MH-12-3456)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Capacity (m³)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <select
                name="currentBranch"
                value={formData.currentBranch}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>{branch.name}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:col-span-3 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Adding...' : 'Add Truck'}
              </button>
            </form>
          </div>

          {/* List of Trucks */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">All Trucks</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3">Truck Number</th>
                    <th className="p-3">Branch</th>
                    <th className="p-3">Capacity (m³)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trucks.map((truck) => (
                    <tr key={truck._id} className="border-b">
                      <td className="p-3">{truck.truckNumber}</td>
                      <td className="p-3">{truck.currentBranch?.name}</td>
                      <td className="p-3">{truck.capacity}</td>
                      <td className="p-3">
                        {/* --- UPDATED STATUS SPAN --- */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(truck.status)}`}>
                          {truck.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDelete(truck._id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageTrucks;