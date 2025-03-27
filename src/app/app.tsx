import Button from "components/atoms/button";
import logo from "/favicon.svg";

function App() {
  return (
    <main className="bg-slate-900 min-h-screen text-white p-6">
      <header className="pt-16 z-10 relative max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <img src={logo} alt="Network Dashboard Logo" className="w-16 h-16" />
          <h3 className="text-2xl sm:text-4xl leading-none font-bold tracking-tight text-blue-200">
            <span className="text-[#60A5FA] opacity-75">Network</span> Dashboard
          </h3>
        </div>
        <h1 className="text-6xl lg:text-7xl leading-none font-extrabold tracking-tight mb-8 sm:mb-10 text-blue-400">
          Domain & Service Monitoring
        </h1>
        <p className="max-w-screen-lg text-lg sm:text-xl text-gray-300 font-medium mb-10 sm:mb-11">
          Comprehensive network visualization and monitoring dashboard for enterprise domains. 
          Visualize network services across:{" "}
          <code className="font-mono text-green-500 font-bold">User Access Domain</code>,{" "}
          <code className="font-mono text-red-500 font-bold">Application Domain</code>,{" "}
          <code className="font-mono text-yellow-500 font-bold">Infrastructure Domain</code>,{" "}
          and <code className="font-mono text-purple-500 font-bold">Security Domain</code>.
          Track critical services and monitor network health in real-time.
        </p>
      </header>
      <section className="max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <div className="sm:flex sm:space-x-6 space-y-4 sm:space-y-0 items-center">
          <Button>Launch Dashboard</Button>
          <Button>View Documentation</Button>
        </div>
      </section>
      <footer className="pb-16 max-w-screen-lg xl:max-w-screen-xl mx-auto text-center sm:text-right text-gray-400 font-bold mt-16">
        <p>Network Dashboard POC © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}

export default App;