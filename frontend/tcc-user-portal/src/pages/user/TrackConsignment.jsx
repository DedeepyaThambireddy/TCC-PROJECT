// src/pages/user/TrackConsignment.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const TrackConsignment = () => {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { api, user } = useAuth(); // Get user and api

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    try {
      // We use the main GET route. The backend will check
      // if this user is allowed to see this consignment.
      const response = await api.get('/consignments/my-consignments');
      const allUserConsignments = response.data.data;
      
      const found = allUserConsignments.find(
        c => c.consignmentNumber.toLowerCase() === trackingId.toLowerCase()
      );

      if (found) {
        setResult(found);
      } else {
        setError('Tracking ID not found in your account.');
      }
    } catch (err) {
      setError('An error occurred while tracking.');
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In-Transit': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Track Your Consignment</h2>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg">
        <form onSubmit={handleTrack}>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="trackingId">
            Enter Your Tracking ID (e.g., TCC-10001)
          </label>
          <div className="flex">
            <input
              type="text"
              id="trackingId"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="TCC-10001"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? '...' : 'Track'}
            </button>
          </div>
        </form>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mt-6">{error}</div>}
        
        {result && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-xl font-semibold">Tracking Result:</h3>
            <div className="mt-4 space-y-2">
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                  {result.status}
                </span>
              </p>
              <p><strong>From:</strong> {result.origin.name}</p>
              <p><strong>To:</strong> {result.destination.name}</p>
              <p><strong>Receiver:</strong> {result.receiverName}</p>
              <p><strong>Assigned Truck:</strong> {result.assignedTruck?.truckNumber || 'Waiting for dispatch...'}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TrackConsignment;