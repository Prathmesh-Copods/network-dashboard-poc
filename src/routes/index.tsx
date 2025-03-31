import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NetworkDashboard from 'pages/NetworkDashboard';
import ServiceDashboard from 'pages/ServiceDashboard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<NetworkDashboard />} />
      <Route path="/service/:serviceId" element={<ServiceDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
