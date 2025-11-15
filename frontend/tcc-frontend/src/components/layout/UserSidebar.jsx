// src/components/layout/UserSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/user/my-consignments', label: 'My Consignments', icon: '📦' },
    { path: '/user/new-consignment', label: 'New Consignment', icon: '➕' },
    { path: '/user/settings', label: 'Settings', icon: '⚙️' },
    { path: '/user/about', label: 'About Us', icon: 'ℹ️' },
    { path: '/user/help', label: 'Help', icon: '❓' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center py-4">TCC System</h2>
        <div className="text-center text-sm text-gray-400">
          <p>{user?.name}</p>
          <p className="text-xs capitalize">{user?.role}</p>
        </div>
      </div>

      <nav className="flex-grow">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition duration-200 ${
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default UserSidebar;