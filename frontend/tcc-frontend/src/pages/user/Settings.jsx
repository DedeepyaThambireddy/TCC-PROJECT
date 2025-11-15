// src/pages/user/Settings.jsx
import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Update Profile</h3>
            <p className="text-gray-600 mb-4">This feature is not yet implemented.</p>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Full Name
                </label>
                <input type="text" id="name" className="w-full px-3 py-2 border rounded-lg bg-gray-100" disabled value={user?.name || ''} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input type="email" id="email" className="w-full px-3 py-2 border rounded-lg bg-gray-100" disabled value={user?.email || ''} />
              </div>
              <button
                type="submit"
                disabled
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
              >
                Save Changes
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;