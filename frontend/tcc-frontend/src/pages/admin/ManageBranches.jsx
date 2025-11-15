// src/pages/admin/ManageBranches.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';

const ManageBranches = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/branches');
      setBranches(response.data.data);
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
      await axios.post('http://localhost:5000/api/branches', formData);
      setFormData({ name: '', location: '' }); // Clear form
      fetchBranches(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add branch');
    } finally {
      setLoading(false);
    }
  };

  // --- NEW FUNCTION ---
  const handleDelete = async (id) => {
    setError(''); // Clear previous errors
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await axios.delete(`http://localhost:5000/api/branches/${id}`);
        fetchBranches(); // Refresh the list
      } catch (err) {
        console.error('Error deleting branch:', err);
        // Display the specific error from the backend
        setError(err.response?.data?.message || 'Failed to delete branch');
      }
    }
  };
  // --- END NEW FUNCTION ---

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Branches</h2>

          {/* --- Add Branch Form --- */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4">Add New Branch</h3>
            {/* THIS ERROR DIV WILL NOW SHOW DELETE ERRORS TOO */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Branch Name (e.g., Mumbai)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location (e.g., Maharashtra)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Adding...' : 'Add Branch'}
              </button>
            </form>
          </div>

          {/* --- List of Branches --- */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">All Branches</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3">Name</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Trucks Count</th>
                    <th className="p-3">Actions</th> {/* <-- NEW COLUMN */}
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch) => (
                    <tr key={branch._id} className="border-b">
                      <td className="p-3">{branch.name}</td>
                      <td className="p-3">{branch.location}</td>
                      <td className="p-3">{branch.trucks.length}</td>
                      {/* --- NEW COLUMN DATA --- */}
                      <td className="p-3">
                        <button
                          onClick={() => handleDelete(branch._id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                          // Optionally disable if trucks > 0, but backend already handles this
                          disabled={branch.trucks.length > 0} 
                        >
                          Delete
                        </button>
                      </td>
                      {/* --- END NEW COLUMN DATA --- */}
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

export default ManageBranches;