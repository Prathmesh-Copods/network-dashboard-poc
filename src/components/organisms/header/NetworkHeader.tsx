import React from "react";

const NetworkHeader: React.FC = () => {
  const formattedDate = "22 MAY 2014 TUESDAY";
  const timeDisplay = "09:05 HRS";
  const timeRange = "1HR - 8:00 AM TO 9:00 AM";
  const location = "CALIFORNIA";
  const utcTime = "UTC 8:00";

  // Domain data array for mapping
  const domains = [
    {
      id: "I",
      color: "#60deff",
      name: "Domain Enterprise",
      services: 120,
      critical: 12
    },
    {
      id: "II",
      color: "#709145",
      name: "Domain name text",
      services: 430,
      critical: 8
    },
    {
      id: "III",
      color: "#8a88ff",
      name: "Domain 3",
      services: 45,
      critical: 32
    },
    {
      id: "IV",
      color: "#ff8fff",
      name: "Domain 1",
      services: 84,
      critical: 16
    }
  ];

  return (
    <header className="bg-[#27272e] text-white font-sans">
      <div className="bg-[#282828] px-4 py-1.5 flex justify-between items-center text-xs border-b border-gray-700">
        <div className="text-gray-400">{timeRange}</div>
        <div className="text-lg font-semibold tracking-wider">{location}</div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">{utcTime}</span>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">{timeDisplay}</span>
            <span className="text-gray-300">{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 items-start p-4">
        {domains.map((domain) => (
          <div 
            key={domain.id} 
            className="bg-[#2e2e35] p-3 flex items-start space-x-3 rounded-s-none"
          >
            <div 
              className="h-7 w-7 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0 mt-1"
              style={{ 
                borderColor: domain.color, 
                borderWidth: '2px',
                color: domain.color
              }}
            >
              {domain.id}
            </div>
            <div>
              <h2 className="font-normal text-sm text-gray-200">
                {domain.name}
              </h2>
              <div className="flex items-baseline mt-1 space-x-4">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{domain.services}</span>
                  <span className="text-xs text-gray-400 ml-1">Services</span>
                </div>
                <div className="flex items-baseline">
                  <span className="inline-block h-1.5 w-1.5 bg-[#f40030] mr-1.5"></span>
                  <span className="text-lg font-bold">{domain.critical}</span>
                  <span className="text-xs text-gray-400 ml-1">Critical</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};

export default NetworkHeader;