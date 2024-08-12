
import { DashboardProvider } from "./DashboardContextApi";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <DashboardProvider>
      <div>
        <h1 className="text-center">Dynamic Dashboard</h1>
        <Dashboard></Dashboard>
      </div>
    </DashboardProvider>
  );
}

export default App;
