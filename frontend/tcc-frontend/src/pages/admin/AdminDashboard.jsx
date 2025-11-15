// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTrucks: 0,
    availableTrucks: 0,
    totalBranches: 0,
    totalConsignments: 0,
    pendingConsignments: 0,
    dispatchedConsignments: 0
  });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]); // <-- ADD THIS STATE

  useEffect(() => {
    // Use Promise.all to fetch everything at once
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, activityRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/stats'),
          axios.get('http://localhost:5000/api/activity?limit=5')
        ]);
        setStats(statsRes.data);
        setActivities(activityRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    // ... (Your StatCard component code is perfect, no changes)
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {loading ? '...' : value}
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
  
  // --- NEW: Helper function to format time ---
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };
  // --- END NEW FUNCTION ---

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            <p className="text-gray-600">Welcome to your Transport Management Dashboard</p>
          </div>

          {/* --- Stat Cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Trucks" value={stats.totalTrucks} icon="🚚" color="border-blue-500" />
            <StatCard title="Available Trucks" value={stats.availableTrucks} icon="✅" color="border-green-500" />
            <StatCard title="Total Branches" value={stats.totalBranches} icon="🏢" color="border-purple-500" />
            <StatCard title="Total Consignments" value={stats.totalConsignments} icon="📦" color="border-yellow-500" />
            <StatCard title="Pending Consignments" value={stats.pendingConsignments} icon="⏳" color="border-orange-500" />
            <StatCard title="Dispatched" value={stats.dispatchedConsignments} icon="🚛" color="border-indigo-500" />
          </div>

          {/* --- Quick Actions --- */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/trucks" className="bg-blue-500 hover:bg-blue-600 text-white text-center px-6 py-3 rounded-lg transition duration-200">
                Manage Trucks
              </Link>
              <Link to="/branches" className="bg-green-500 hover:bg-green-600 text-white text-center px-6 py-3 rounded-lg transition duration-200">
                Manage Branches
              </Link>
              <Link to="/consignments/new" className="bg-purple-500 hover:bg-purple-600 text-white text-center px-6 py-3 rounded-lg transition duration-200">
                New Consignment
              </Link>
              <Link to="/reports" className="bg-indigo-500 hover:bg-indigo-600 text-white text-center px-6 py-3 rounded-lg transition duration-200">
                View Reports
              </Link>
            </div>
          </div>

          {/* --- RECENT ACTIVITY (UPDATED) --- */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading activities...</div>
            ) : activities.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No recent activities to display</p>
                <p className="text-sm mt-2">Go add a truck or consignment!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {activities.map((activity) => (
                  <li key={activity._id} className="py-4">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{activity.details}</h4>
                          <p className="text-sm text-gray-500">
                            {formatTimeAgo(activity.createdAt)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          Action: <span className="font-medium">{activity.action} {activity.entity}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* --- END UPDATE --- */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;