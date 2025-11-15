// src/components/layout/Sidebar.jsx

/** 
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/trucks', label: 'Trucks', icon: '🚚' },
    { path: '/branches', label: 'Branches', icon: '🏢' },
    { path: '/consignments', label: 'Consignments', icon: '📦' },
    { path: '/dispatch', label: 'Dispatch', icon: '🚛' },
    { path: '/reports', label: 'Reports', icon: '📈' },
  ];

  const isActive = (path) => location.pathname === path || (path === '/consignments' && location.pathname === '/consignments/new');

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center py-4">TCC System</h2>
        <div className="text-center text-sm text-gray-400">
          <p>{user?.name}</p>
          <p className="text-xs capitalize">{user?.role?.replace('_', ' ')}</p>
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

export default Sidebar;

*/


// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth(); // Get the current user

  // --- DEFINE MENUS FOR EACH ROLE ---
  const adminMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/users', label: 'Manage Users', icon: '👥' }, // <-- THIS IS THE NEW LINK
    { path: '/trucks', label: 'Manage Trucks', icon: '🚚' },
    { path: '/branches', label: 'Manage Branches', icon: '🏢' },
    { path: '/consignments', label: 'All Consignments', icon: '📦' }, // Admin sees all
    { path: '/dispatch', label: 'Dispatch', icon: '🚛' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/consignments/new', label: 'New Consignment', icon: '➕' },
  ];

  const userMenu = [
    { path: '/my-consignments', label: 'My Consignments', icon: '📦' }, // User sees only theirs
    { path: '/consignments/new', label: 'New Consignment', icon: '➕' },
    { path: '/track', label: 'Track Consignment', icon: '🔍' },
    { path: '/about', label: 'About Us', icon: 'ℹ️' },
    { path: '/help', label: 'Help', icon: '❓' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];
  // --- END MENUS ---

  // --- CHOOSE THE RIGHT MENU ---
  const menuItems = user?.role === 'admin' ? adminMenu : userMenu;
  const title = user?.role === 'admin' ? 'TCC Admin' : 'TCC User Portal';

  // This function now highlights parent routes
  const isActive = (path) => {
    if ((path === '/consignments' || path === '/my-consignments') && location.pathname === '/consignments/new') {
      return true; // Highlight parent when on "new" page
    }
    return location.pathname === path;
  };

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center py-4">{title}</h2>
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

export default Sidebar;


