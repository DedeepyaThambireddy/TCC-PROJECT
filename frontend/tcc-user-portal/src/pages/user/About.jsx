// src/pages/user/About.jsx
import React from 'react';

const About = () => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">About TCC System</h2>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl space-y-4">
        <p className="text-gray-700">
          Welcome to the Transport Company Computerization (TCC) System, a project designed to streamline and modernize all bookkeeping and operational activities for a transport company.
        </p>
        <p className="text-gray-700">
          Our system handles everything from consignment intake and charge calculation to automatic truck allocation and dispatch. This digital solution provides managers and users with real-time tracking, detailed reporting, and powerful analytics to optimize fleet usage and reduce waiting times.
        </p>
      </div>
    </>
  );
};

export default About;