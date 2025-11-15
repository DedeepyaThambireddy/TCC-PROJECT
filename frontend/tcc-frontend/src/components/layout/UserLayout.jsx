// src/components/layout/UserLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import Navbar from './Navbar';

const UserLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* <-- All User pages will render here */}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;