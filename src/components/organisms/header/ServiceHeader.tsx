import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';

const IconButton: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <button className={`p-1 hover:bg-slate-700 rounded ${className}`}>
    {children}
  </button>
);

const Icon: React.FC<{ path: string }> = ({ path }) => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const ServiceHeader: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  
  const currentTime = new Date();
  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    weekday: 'long'
  }).toUpperCase();
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const timezone = "IST";

  const iconPaths = {
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    menu: "M4 6h16M4 12h16M4 18h16",
    expand: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
  };
  
  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="border-b border-slate-700 px-4 py-2 flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center text-blue-400 hover:text-blue-300">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
          </Link>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1 text-slate-400" />
            <span>{formattedTime} {timezone}</span>
          </div>
        </div>
        <div className="font-medium">{formattedDate}</div>
      </div>
      
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-2 md:mb-0">
          <div>
            <h1 className="text-xl font-bold">
              {serviceId ? `Web Service ${serviceId}` : 'Service Dashboard'}
            </h1>
            <div className="text-sm text-slate-300 flex items-center mt-1">
              <span className="inline-block h-2 w-2 rounded-full bg-[#f40030] mr-2"></span>
              <span>56.9% MoS Degradation</span>
              <span className="mx-2">|</span>
              <span>Application: Audio</span>
            </div>
          </div>
        </div>
        
        <nav className="flex items-center space-x-4">
          <button className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 text-sm">
            View: Default
          </button>
          <IconButton>
            <Icon path={iconPaths.search} />
          </IconButton>
          <div className="flex space-x-2">
            <IconButton>
              <Icon path={iconPaths.menu} />
            </IconButton>
            <IconButton>
              <Icon path={iconPaths.expand} />
            </IconButton>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default ServiceHeader;