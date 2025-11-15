// src/pages/user/NewConsignment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NewConsignment = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    senderName: '', senderAddress: '',
    receiverName: '', receiverAddress: '',
    volume: '', origin: '', destination: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { api } = useAuth(); // Use api from context

  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch all available branches for the dropdowns
  const fetchBranches = async () => {
    try {
      const response = await api.get('/branches');
      setBranches(response.data.data);
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.origin === formData.destination) {
      setError('Origin and Destination cannot be the same.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.post('/consignments', formData);
      setSuccess(`Consignment ${response.data.data.consignmentNumber} created! An email confirmation has been sent. ${response.data.dispatchMessage}`);
      setFormData({
        senderName: '', senderAddress: '',
        receiverName: '', receiverAddress: '',
        volume: '', origin: '', destination: ''
      });
      // Redirect to the main list after a short delay
      setTimeout(() => navigate('/my-consignments'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create consignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book a New Consignment</h2>
      <div className="bg-white p-8 rounded-lg shadow-md">
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <fieldset className="border p-4 rounded-lg">
              <legend className="font-semibold px-2">Sender Details</legend>
              <input type="text" name="senderName" value={formData.senderName} onChange={handleChange} placeholder="Sender Name" className="w-full mt-2 p-2 border rounded" required />
              <textarea name="senderAddress" value={formData.senderAddress} onChange={handleChange} placeholder="Sender Address" className="w-full mt-4 p-2 border rounded" rows="2" required />
            </fieldset>

            <fieldset className="border p-4 rounded-lg">
              <legend className="font-semibold px-2">Receiver Details</legend>
              <input type="text" name="receiverName" value={formData.receiverName} onChange={handleChange} placeholder="Receiver Name" className="w-full mt-2 p-2 border rounded" required />
              <textarea name="receiverAddress" value={formData.receiverAddress} onChange={handleChange} placeholder="Receiver Address" className="w-full mt-4 p-2 border rounded" rows="2" required />
            </fieldset>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <fieldset className="border p-4 rounded-lg">
              <legend className="font-semibold px-2">Origin</legend>
              <select name="origin" value={formData.origin} onChange={handleChange} className="w-full mt-2 p-2 border rounded bg-white" required>
                <option value="">Select Origin Branch</option>
                {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </fieldset>

            <fieldset className="border p-4 rounded-lg">
              <legend className="font-semibold px-2">Destination</legend>
              <select name="destination" value={formData.destination} onChange={handleChange} className="w-full mt-2 p-2 border rounded bg-white" required>
                <option value="">Select Destination Branch</option>
                {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </fieldset>
            
            <fieldset className="border p-4 rounded-lg">
              <legend className="font-semibold px-2">Volume (m³)</legend>
              <input type="number" name="volume" value={formData.volume} onChange={handleChange} placeholder="e.g., 50" className="w-full mt-2 p-2 border rounded" required min="1" />
            </fieldset>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-200 disabled:bg-gray-400"
          >
            {loading ? 'Submitting...' : 'Book Consignment'}
          </button>
        </form>
      </div>
    </>
  );
};

export default NewConsignment;