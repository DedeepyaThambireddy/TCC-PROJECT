import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // This file is for your Tailwind CSS styles
import App from './App'; // This will be your main App component

// This finds the <div id="root"> in your index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// This renders your entire React app into that div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);