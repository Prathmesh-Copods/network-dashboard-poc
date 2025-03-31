import React, { useEffect, useState } from "react";
import { fetchNetworkHeaderData } from "../../../services/api";
import { NetworkHeaderData } from "../../../types/networkDashboard";

const NetworkHeader: React.FC = () => {
  const [headerData, setHeaderData] = useState<NetworkHeaderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await fetchNetworkHeaderData();
      setHeaderData(data);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching network header data:", err);
      setError("Failed to fetch network data");
      if (headerData) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading && !headerData) {
    return <div className="p-4 bg-black text-gray-400">Loading network data...</div>;
  }

  if (error && !headerData) {
    return <div className="p-4 bg-black text-red-500">{error}</div>;
  }

  if (!headerData) {
    return <div className="p-4 bg-black text-gray-400">No network data available</div>;
  }

  return (
    <header className="bg-black text-white w-full">
      {/* Top row with time and location info */}
      <div className="flex justify-between items-center px-6 py-2 border-b border-gray-800">
        <div className="text-sm font-medium text-gray-300">{headerData.timeRange}</div>
        <div className="text-xl font-bold tracking-wider">{headerData.location}</div>
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-gray-300">{headerData.utc}</span>
          <span className="text-sm font-medium">
            {headerData.currentTime}
          </span>
          <span className="text-sm font-medium">{headerData.date}</span>
        </div>
      </div>

      {/* Domain panels */}
      <div className="grid grid-cols-4 gap-px">
        {headerData.domains.map((domain) => (
          <div 
            key={domain.id} 
            className="bg-gray-800 flex items-center px-4 py-3"
          >
            <div className="flex items-center space-x-4">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold
                ${domain.id === "I" ? "bg-blue-950 text-blue-400 border border-blue-600" : ""}
                ${domain.id === "II" ? "bg-green-950 text-green-400 border border-green-600" : ""}
                ${domain.id === "III" ? "bg-indigo-950 text-indigo-400 border border-indigo-600" : ""}
                ${domain.id === "IV" ? "bg-purple-950 text-purple-400 border border-purple-600" : ""}
              `}>
                {domain.id}
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">{domain.name}</div>
                <div className="flex items-center">
                  <span className="text-3xl font-semibold mr-2">{domain.services}</span>
                  <span className="text-gray-400 text-sm mr-4">Services</span>
                  
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-600"></span>
                    <span className="text-3xl font-semibold">{domain.critical}</span>
                    <span className="text-gray-400 text-sm">Critical</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show error message if refresh fails but we have old data */}
      {error && (
        <div className="bg-red-900 bg-opacity-80 text-white text-sm py-1 px-3 absolute bottom-0 right-0">
          {error}. Retrying...
        </div>
      )}
    </header>
  );
};

export default NetworkHeader;