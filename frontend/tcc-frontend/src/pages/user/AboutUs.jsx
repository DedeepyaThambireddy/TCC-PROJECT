// src/pages/user/AboutUs.jsx
import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';

const AboutUs = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About TCC System</h2>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl space-y-4">
            <p className="text-gray-700">
              Welcome to the Transport Company Computerization (TCC) System, a project designed to streamline and modernize all bookkeeping and operational activities for a transport company.
            </p>
            <p className="text-gray-700">
              Our system handles everything from consignment intake and charge calculation to automatic truck allocation and dispatch. This digital solution provides managers and users with real-time tracking, detailed reporting, and powerful analytics to optimize fleet usage and reduce waiting times.
            </p>
            <h3 className="text-xl font-semibold pt-4">Core Features:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Automated Consignment Billing</li>
              <li>Smart Auto-Dispatch Logic (at 500 m³)</li>
              <li>Real-time Truck & Consignment Status Tracking</li>
              <li>Admin-level Management of Trucks, Branches, and Users</li>
              <li>Detailed Reporting & Analytics on Revenue and Fleet Efficiency</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutUs;