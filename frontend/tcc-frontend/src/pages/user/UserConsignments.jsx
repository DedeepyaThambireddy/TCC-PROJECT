// src/pages/user/UserConsignments.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';

const UserConsignments = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchConsignments();
  }, [user]);

  const fetchConsignments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // This will now only get this user's consignments
      const response = await axios.get('http://localhost:5000/api/consignments');
      setConsignments(response.data.data);
    } catch (err) {
      console.error('Error fetching consignments:', err);
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Consignment Status</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3">Number</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Receiver</th>
                    <th className="p-3">Origin</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Charge ($)</th>
                    <th className="p-3">Truck</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="p-3 text-center">Loading...</td></tr>
                  ) : consignments.length === 0 ? (
                    <tr><td colSpan="7" className="p-3 text-center">You have not created any consignments yet.</td></tr>
                  ) : (
                    consignments.map((c) => (
                      <tr key={c._id} className="border-b">
                        <td className="p-3 font-medium">{c.consignmentNumber}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3">{c.receiverName}</td>
                        <td className="p-3">{c.origin?.name}</td>
                        <td className="p-3">{c.destination?.name}</td>
                        <td className="p-3">${c.charge.toFixed(2)}</td>
                        <td className="p-3">{c.assignedTruck?.truckNumber || 'N/A'}</td>
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

export default UserConsignments;