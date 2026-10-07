import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CivicProvider } from './context/CivicContext.jsx';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CitizenDashboard from './pages/CitizenDashboard.jsx';
import WorkerDashboard from './pages/WorkerDashboard.jsx';
import WardOfficerDashboard from './pages/WardOfficerDashboard.jsx';
import CommissionerDashboard from "./pages/CommissionerDashboardFixed.jsx";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CivicProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                <Route
                  path="/citizen"
                  element={
                    <ProtectedRoute allowedRoles={['citizen']}>
                      <CitizenDashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/worker"
                  element={
                    <ProtectedRoute allowedRoles={['worker']}>
                      <WorkerDashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/ward-officer"
                  element={
                    <ProtectedRoute allowedRoles={['ward_officer']}>
                      <WardOfficerDashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/commissioner"
                  element={
                    <ProtectedRoute allowedRoles={['commissioner']}>
                      <CommissionerDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CivicProvider>
    </AuthProvider>
  );
}