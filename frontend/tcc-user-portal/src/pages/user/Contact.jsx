// src/pages/user/Contact.jsx
import React from 'react';

const Contact = () => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg space-y-4">
        <p className="text-gray-700">
          Have questions about your consignment or need help with a booking? Our team is here to help.
        </p>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Customer Support</h3>
          <p className="text-gray-700">Email: <span className="text-blue-600">sana630863@gmail.com</span></p>
          <p className="text-gray-700">Phone: <span className="text-blue-600">+91 8523076025</span></p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Head Office</h3>
          <p className="text-gray-700"> Transport Lane, Kadapa, India</p>
        </div>
      </div>
    </>
  );
};

export default Contact;