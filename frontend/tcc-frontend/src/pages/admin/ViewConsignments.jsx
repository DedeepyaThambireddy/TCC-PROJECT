// src/pages/admin/ViewConsignments.jsx
/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../contexts/AuthContext';

const ViewConsignments = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    setLoading(true);
    setError('');
    try {
      // This is the correct route for the Admin
      const response = await axios.get('http://localhost:5000/api/consignments/all');
      setConsignments(response.data.data);
    } catch (err) {
      console.error('Error fetching consignments:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    setError('');
    if (window.confirm('Are you sure you want to delete this "Pending" consignment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/consignments/${id}`);
        fetchConsignments(); // Refresh the list
      } catch (err) {
        console.error('Error deleting consignment:', err);
        setError(err.response?.data?.message || 'Failed to delete consignment');
      }
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Consignment List</h2>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3">Number</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Sender</th>
                    <th className="p-3">Receiver</th>
                    <th className="p-3">Origin</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Volume (m³)</th>
                    <th className="p-3">Charge ($)</th>
                    <th className="p-3">Truck</th>
                    {user?.role === 'admin' && <th className="p-3">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="10" className="p-3 text-center">Loading...</td></tr>
                  ) : consignments.length === 0 ? (
                    <tr><td colSpan="10" className="p-3 text-center">No consignments found.</td></tr>
                  ) : (
                    consignments.map((c) => (
                      <tr key={c._id} className="border-b">
                        <td className="p-3 font-medium">{c.consignmentNumber}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3">{c.senderName}</td>
                        <td className="p-3">{c.receiverName}</td>
                        <td className="p-3">{c.origin?.name}</td>
                        <td className="p-3">{c.destination?.name}</td>
                        <td className="p-3">{c.volume}</td>
                        <td className="p-3">${c.charge.toFixed(2)}</td>
                        <td className="p-3">{c.assignedTruck?.truckNumber || 'N/A'}</td>
                        {user?.role === 'admin' && (
                          <td className="p-3">
                            {c.status === 'Pending' && (
                              <button
                                onClick={() => handleDelete(c._id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


export default ViewConsignments;
*/


// src/pages/admin/ViewConsignments.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../contexts/AuthContext';

const ViewConsignments = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    setLoading(true);
    setError('');
    try {
      // --- THIS IS THE FIX ---
      // We now call the /all route for the admin
      const response = await axios.get('http://localhost:5000/api/consignments/all');
      // --- END FIX ---
      setConsignments(response.data.data);
    } catch (err) {
      console.error('Error fetching consignments:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    setError('');
    if (window.confirm('Are you sure you want to delete this "Pending" consignment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/consignments/${id}`);
        fetchConsignments(); // Refresh the list
      } catch (err) {
        console.error('Error deleting consignment:', err);
        setError(err.response?.data?.message || 'Failed to delete consignment');
      }
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Consignment List</h2>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3">Number</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Sender</th>
                    <th className="p-3">Receiver</th>
                    <th className="p-3">Origin</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Volume (m³)</th>
                    <th className="p-3">Charge ($)</th>
                    <th className="p-3">Truck</th>
                    {user?.role === 'admin' && <th className="p-3">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="10" className="p-3 text-center">Loading...</td></tr>
                  ) : consignments.length === 0 ? (
                    <tr><td colSpan="10" className="p-3 text-center">No consignments found.</td></tr>
                  ) : (
                    consignments.map((c) => (
                      <tr key={c._id} className="border-b">
                        <td className="p-3 font-medium">{c.consignmentNumber}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3">{c.senderName}</td>
                        <td className="p-3">{c.receiverName}</td>
                        <td className="p-3">{c.origin?.name}</td>
                        <td className="p-3">{c.destination?.name}</td>
                        <td className="p-3">{c.volume}</td>
                        <td className="p-3">${c.charge.toFixed(2)}</td>
                        <td className="p-3">{c.assignedTruck?.truckNumber || 'N/A'}</td>
                        {user?.role === 'admin' && (
                          <td className="p-3">
                            {c.status === 'Pending' && (
                              <button
                                onClick={() => handleDelete(c._id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewConsignments;