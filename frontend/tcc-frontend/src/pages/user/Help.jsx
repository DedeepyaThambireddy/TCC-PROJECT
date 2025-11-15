// src/pages/user/Help.jsx
import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';

const Help = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Help & Support</h2>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl space-y-6">
            <h3 className="text-xl font-semibold">Frequently Asked Questions (FAQ)</h3>
            
            <div className="border-b pb-4">
              <h4 className="font-semibold text-gray-800">1. How do I create a new consignment?</h4>
              <p className="text-gray-700 mt-1">
                Click on the "New Consignment" link in the sidebar. Fill out all the details for the sender, receiver, and the package volume. Select an origin and destination branch. The system will automatically calculate the charge when you submit.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h4 className="font-semibold text-gray-800">2. How can I track my consignment?</h4>
              <p className="text-gray-700 mt-1">
                Click on "My Consignments" in the sidebar. You will see a list of all your consignments and their current status ("Pending", "In-Transit", or "Delivered").
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h4 className="font-semibold text-gray-800">3. Why is my consignment still "Pending"?</h4>
              <p className="text-gray-700 mt-1">
                A consignment remains "Pending" until the total volume of goods for its specific route (e.g., Kadapa to Hyderabad) reaches 500 m³ and a truck is available at the origin. Once both conditions are met, it will be dispatched automatically.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800">4. Who do I contact for support?</h4>
              <p className="text-gray-700 mt-1">
                For any issues, please contact the system administrator at <span className="text-blue-600 font-medium">admin@tccsystem.com</span>.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;