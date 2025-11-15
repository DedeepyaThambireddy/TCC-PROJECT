// src/pages/admin/ViewDispatches.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../contexts/AuthContext'; // <-- IMPORT useAuth

const ViewDispatches = () => {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // <-- GET USER

  useEffect(() => {
    fetchDispatches();
  }, []);

  const fetchDispatches = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/dispatch');
      setDispatches(response.data.data);
    } catch (err) {
      console.error('Error fetching dispatches:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW FUNCTION ---
  const handleComplete = async (id) => {
    setError('');
    if (window.confirm('Are you sure this dispatch has been completed? This will mark all consignments as "Delivered" and free the truck.')) {
      try {
        await axios.put(`http://localhost:5000/api/dispatch/${id}/complete`);
        fetchDispatches(); // Refresh the list
      } catch (err) {
        console.error('Error completing dispatch:', err);
        setError(err.response?.data?.message || 'Failed to complete dispatch');
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Dispatch Manifests</h2>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <div className="space-y-6">
            {loading ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">Loading...</div>
            ) : dispatches.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">No dispatches found.</div>
            ) : (
              dispatches.map(dispatch => (
                <div key={dispatch._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-blue-600">{dispatch.manifestNumber}</h3>
                      <p className="text-gray-600">
                        {dispatch.origin?.name} ➔ {dispatch.destination?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{dispatch.truck?.truckNumber}</p>
                      {/* --- UPDATED STATUS & BUTTON --- */}
                      {dispatch.status === 'In-Transit' ? (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          In-Transit
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Completed
                        </span>
                      )}
                      {user?.role === 'admin' && dispatch.status === 'In-Transit' && (
                        <button
                          onClick={() => handleComplete(dispatch._id)}
                          className="mt-2 text-xs bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-lg"
                        >
                          Mark as Completed
                        </button>
                      )}
                      {/* --- END UPDATE --- */}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p><strong>Total Volume:</strong> {dispatch.totalVolume} m³</p>
                    <p><strong>Consignments:</strong> {dispatch.consignments.length}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Consignment Details:</h4>
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2">Number</th>
                          <th className="p-2">Sender</th>
                          <th className="p-2">Receiver</th>
                          <th className="p-2">Volume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dispatch.consignments.map(c => (
                          <tr key={c._id} className="border-b">
                            <td className="p-2">{c.consignmentNumber}</td>
                            <td className="p-2">{c.senderName}</td>
                            <td className="p-2">{c.receiverName}</td>
                            <td className="p-2">{c.volume} m³</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewDispatches;