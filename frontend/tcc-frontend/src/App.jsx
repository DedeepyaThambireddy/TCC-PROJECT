// src/App.jsx

/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBranches from './pages/admin/ManageBranches';
import ManageTrucks from './pages/admin/ManageTrucks';
import NewConsignment from './pages/admin/NewConsignment';
import ViewConsignments from './pages/admin/ViewConsignments';
import ViewDispatches from './pages/admin/ViewDispatches';
import Reports from './pages/admin/Reports'; // <-- ADD THIS

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/branches" element={<PrivateRoute><ManageBranches /></PrivateRoute>} />
          <Route path="/trucks" element={<PrivateRoute><ManageTrucks /></PrivateRoute>} />
          <Route path="/consignments" element={<PrivateRoute><ViewConsignments /></PrivateRoute>} />
          <Route path="/consignments/new" element={<PrivateRoute><NewConsignment /></PrivateRoute>} />
          <Route path="/dispatch" element={<PrivateRoute><ViewDispatches /></PrivateRoute>} />
          
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

*/


// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

// --- SHARED PAGES ---
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import DashboardRedirect from './pages/DashboardRedirect';
import NewConsignment from './pages/admin/NewConsignment';

// --- ADMIN PAGES ---
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBranches from './pages/admin/ManageBranches';
import ManageTrucks from './pages/admin/ManageTrucks';
import ViewConsignments from './pages/admin/ViewConsignments';
import ViewDispatches from './pages/admin/ViewDispatches';
import Reports from './pages/admin/Reports';
import ManageUsers from './pages/admin/ManageUsers'; // <-- ADD THIS IMPORT

// --- USER PAGES ---

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Gateway */}
          <Route path="/" element={<PrivateRoute><DashboardRedirect /></PrivateRoute>} />
          
          {/* --- ADMIN ROUTES --- */}
          <Route path="/dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute allowedRoles={['admin']}><ManageUsers /></PrivateRoute>} /> {/* <-- ADD THIS ROUTE */}
          <Route path="/trucks" element={<PrivateRoute allowedRoles={['admin']}><ManageTrucks /></PrivateRoute>} />
          <Route path="/branches" element={<PrivateRoute allowedRoles={['admin']}><ManageBranches /></PrivateRoute>} />
          <Route path="/consignments" element={<PrivateRoute allowedRoles={['admin']}><ViewConsignments /></PrivateRoute>} />
          <Route path="/dispatch" element={<PrivateRoute allowedRoles={['admin']}><ViewDispatches /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute allowedRoles={['admin']}><Reports /></PrivateRoute>} />

          {/* --- SHARED ROUTE --- */}
          <Route path="/consignments/new" element={<PrivateRoute allowedRoles={['admin', 'user']}><NewConsignment /></PrivateRoute>} />

          {/* --- USER ROUTES --- */}
          
          {/* 404 redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
