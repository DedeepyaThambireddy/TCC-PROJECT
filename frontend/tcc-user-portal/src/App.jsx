// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

// Layouts and Pages
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardRedirect from './pages/DashboardRedirect';
import MyConsignments from './pages/user/MyConsignments';
import NewConsignment from './pages/user/NewConsignment';
import TrackConsignment from './pages/user/TrackConsignment';
import About from './pages/user/About';
import Contact from './pages/user/Contact';

// This is the new layout wrapper for logged-in users
const UserLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-100">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Gateway */}
          <Route 
            path="/" 
            element={<PrivateRoute><DashboardRedirect /></PrivateRoute>} 
          />
          
          {/* Protected User Routes */}
          <Route 
            path="/my-consignments" 
            element={<PrivateRoute><UserLayout><MyConsignments /></UserLayout></PrivateRoute>} 
          />
          <Route 
            path="/new-consignment" 
            element={<PrivateRoute><UserLayout><NewConsignment /></UserLayout></PrivateRoute>} 
          />
          <Route 
            path="/track" 
            element={<PrivateRoute><UserLayout><TrackConsignment /></UserLayout></PrivateRoute>} 
          />
          <Route 
            path="/about" 
            element={<PrivateRoute><UserLayout><About /></UserLayout></PrivateRoute>} 
          />
          <Route 
            path="/contact" 
            element={<PrivateRoute><UserLayout><Contact /></UserLayout></PrivateRoute>} 
          />

          {/* 404 redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;