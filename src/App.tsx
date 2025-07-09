import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toast } from './components/ui/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Validate } from './pages/Validate';
import { History } from './pages/History';
import { Billing } from './pages/Billing';
import { Settings } from './pages/Settings';
import { Success } from './pages/Success';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
          } />
          <Route path="/success" element={<Success />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/validate" element={
            <ProtectedRoute>
              <Validate />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Redirect any unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Toast />
      </div>
    </Router>
  );
}

export default App;