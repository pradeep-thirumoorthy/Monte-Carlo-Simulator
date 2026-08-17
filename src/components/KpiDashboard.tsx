import React from 'react';
import type { SimulationOutput } from '../lib/simulator';
import { formatCurrency, formatPercent } from '../lib/format';
import { Target, TrendingDown, Wallet } from 'lucide-react';

interface KpiDashboardProps {
  output: SimulationOutput;
}

export function KpiDashboard({ output }: KpiDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 flex items-center">
        <div className="rounded-xl bg-blue-900/30 p-3 mr-4 text-blue-400">
          <Wallet size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">Median Ending Value</p>
          <h3 className="text-2xl font-bold text-slate-100">
            {formatCurrency(output.medianEndingValue)}
          </h3>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 flex items-center">
        <div className="rounded-xl bg-amber-900/30 p-3 mr-4 text-amber-500">
          <Target size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">Probability of Success</p>
          <h3 className="text-2xl font-bold text-slate-100">
            {formatPercent(output.probabilityOfSuccess)}
          </h3>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 flex items-center">
        <div className="rounded-xl bg-rose-900/30 p-3 mr-4 text-rose-500">
          <TrendingDown size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">Value at Risk (95% CI)</p>
          <h3 className="text-2xl font-bold text-slate-100">
            {formatCurrency(output.valueAtRisk)}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Below Median Expectations</p>
        </div>
      </div>
    </div>
  );
}
