import React from 'react';
import { useParams } from 'react-router-dom';

const ServiceDashboard: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  return (
    <div>
      <h1>Service Dashboard</h1>
      <p>Details for Service ID: {serviceId}</p>
    </div>
  );
};

export default ServiceDashboard;
