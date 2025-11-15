// src/pages/user/MyConsignments.jsx
/*
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MyConsignments = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api } = useAuth();

  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    setLoading(true);
    try {
      // Backend will only send this user's consignments
      //const response = await api.get('/consignments/my-consignments');
      // We must call the /my-consignments route for users
      const response = await api.get('/my-consignments');
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
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Consignments</h2>
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
                <tr><td colSpan="7" className="p-3 text-center">You have no consignments.</td></tr>
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
    </>
  );
};

export default MyConsignments;
*/
/*

// src/pages/user/MyConsignments.jsx
// src/pages/user/MyConsignments.jsx
// src/pages/user/MyConsignments.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MyConsignments = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api, user } = useAuth(); // Use api from context

  useEffect(() => {
    if (user) { // Only fetch if the user is loaded
      fetchConsignments();
    }
  }, [user]);

  const fetchConsignments = async () => {
    setLoading(true);
    try {
      // --- THIS IS THE FIX ---
      // We now call the /my-consignments route
      const response = await api.get('/consignments/my-consignments');
      // --- END FIX ---
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
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Consignments</h2>
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
                <tr><td colSpan="7" className="p-3 text-center">You have no consignments.</td></tr>
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
    </>
  );
};

export default MyConsignments;


// src/pages/user/MyConsignments.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MyConsignments = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api, user } = useAuth(); // Use api from context

  useEffect(() => {
    if (user) { // Only fetch if the user is loaded
      fetchConsignments();
    }
  }, [user]); // Re-fetch if the user changes

  const fetchConsignments = async () => {
    setLoading(true);
    try {
      // --- THIS IS THE FIX ---
      // We must call the /my-consignments route, not the main one
      const response = await api.get('/consignments/my-consignments');
      // --- END FIX ---
      
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
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Consignments</h2>
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
                <tr><td colSpan="7" className="p-3 text-center">You have no consignments.</td></tr>
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
    </>
  );
};

export default MyConsignments;

*/

// src/pages/user/MyConsignments.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MyConsignments = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api } = useAuth();

  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    setLoading(true);
    try {
      // ✅ Correct path based on server.js + router mounting
      const response = await api.get('/consignments/my-consignments');
      setConsignments(response.data.data || []);
    } catch (err) {
      console.error('Error fetching consignments:', err);
      setConsignments([]);
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Consignments</h2>
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
                <tr><td colSpan="7" className="p-3 text-center">You have no consignments.</td></tr>
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
    </>
  );
};

export default MyConsignments;
