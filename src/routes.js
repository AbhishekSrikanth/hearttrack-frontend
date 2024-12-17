import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDetail from './pages/PatientDetail';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<DoctorDashboard />} />
      <Route path="/patients/:id" element={<PatientDetail />} />
    </Routes>
  </Router>
);

export default AppRoutes;
