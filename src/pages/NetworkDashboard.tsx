import { NetworkHeader } from "components/organisms/header";
import NetworkGraph from "components/molecules/NetworkGraph";

const NetworkDashboard = () => (
  <div className="flex flex-col h-screen bg-black">
    <NetworkHeader />
    <div className="flex flex-1 p-4">
      {/* Left side - NetworkGraph (40% width) */}
      <div className="w-2/5 pr-4">
        <NetworkGraph className="h-full w-full" />
      </div>
      
      {/* Right side - placeholder (60% width) */}
      <div className="w-3/5 bg-slate-900 rounded-lg">
        <div className="p-6 h-full flex items-center justify-center">
          <div className="text-slate-400 text-center">
            <div className="text-xl font-medium mb-3">Service Details Panel</div>
            <p className="text-slate-500">Select a service node from the graph to view detailed information</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NetworkDashboard;