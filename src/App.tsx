import { useState, useMemo } from 'react';
import { runSimulation, type SimulationInput } from './lib/simulator';
import { InputPanel } from './components/InputPanel';
import { KpiDashboard } from './components/KpiDashboard';
import { Charts } from './components/Charts';
import { LayoutDashboard } from 'lucide-react';

function App() {
  const [input, setInput] = useState<SimulationInput>({
    initialInvestment: 100000,
    annualContribution: 10000,
    years: 30,
    meanReturn: 0.07,
    volatility: 0.15,
    inflationRate: 0.03,
    managementFee: 0.01,
    targetGoal: 1000000,
  });

  // Use a debounced non-blocking effect to keep UI responsive
  // Let Vite hot reload easily by memoizing the output when not simulating.
  const simulationResult = useMemo(() => runSimulation(input, 2000), [input]);

  const handleInputChange = (key: keyof SimulationInput, value: number) => {
    // Basic clamping validation
    if (key === 'years' && value > 100) value = 100;
    if (key === 'years' && value < 1) value = 1;
    if (key === 'meanReturn' && value > 1) value = 1;
    if (key === 'volatility' && value > 1) value = 1;

    setInput((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-900/50">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 px-6 py-4 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/20 text-white">
            <LayoutDashboard size={22} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-100">Monte Carlo Simulator <span className="text-slate-500 font-medium ml-2 text-sm hidden sm:inline-block">Investment Risk Analysis</span></h1>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-0 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 xl:col-span-3">
            <div className="sticky top-[88px] h-[calc(100vh-120px)]">
              <InputPanel input={input} onChange={handleInputChange} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 xl:col-span-9">
            <KpiDashboard output={simulationResult} />
            <Charts output={simulationResult} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
