import { useState } from 'react';
import type { SimulationInput } from '../lib/simulator';
import { Settings, TrendingUp, DollarSign, Target, Activity, CalendarDays } from 'lucide-react';
import { Select, Slider, InputNumber, ConfigProvider, theme } from 'antd';
import { BankOutlined, LineChartOutlined, FlagOutlined } from '@ant-design/icons';

interface InputPanelProps {
  input: SimulationInput;
  onChange: (key: keyof SimulationInput, value: number) => void;
}

export function InputPanel({ input, onChange }: InputPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>('investment');

  const categoryOptions = [
    { value: 'investment', label: <span className="flex items-center gap-2"><BankOutlined /> Investment Setup</span> },
    { value: 'market', label: <span className="flex items-center gap-2"><LineChartOutlined /> Market Conditions</span> },
    { value: 'goals', label: <span className="flex items-center gap-2"><FlagOutlined /> Investment Goals</span> },
  ];

  const renderInputs = () => {
    switch (activeCategory) {
      case 'investment':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 uppercase flex items-center gap-1.5">
                <DollarSign size={16} className="text-blue-400" /> Initial Investment
              </label>
              <div className="flex gap-4">
                <Slider
                  min={0}
                  max={1000000}
                  step={10000}
                  value={input.initialInvestment}
                  onChange={(val) => onChange('initialInvestment', val)}
                  className="flex-1"
                />
                <InputNumber
                  min={0}
                  value={input.initialInvestment}
                  onChange={(val) => onChange('initialInvestment', val || 0)}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|,(?=\d{3})/g, '') as unknown as number}
                  className="w-32"
                  size="large"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 uppercase flex items-center gap-1.5">
                <TrendingUp size={16} className="text-emerald-400" /> Annual Contribution
              </label>
              <div className="flex gap-4">
                <Slider
                  min={0}
                  max={250000}
                  step={1000}
                  value={input.annualContribution}
                  onChange={(val) => onChange('annualContribution', val)}
                  className="flex-1"
                  trackStyle={{ backgroundColor: '#10b981' }}
                  handleStyle={{ borderColor: '#10b981' }}
                />
                <InputNumber
                  min={0}
                  value={input.annualContribution}
                  onChange={(val) => onChange('annualContribution', val || 0)}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|,(?=\d{3})/g, '') as unknown as number}
                  className="w-32"
                  size="large"
                />
              </div>
            </div>
          </div>
        );
      case 'market':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 uppercase flex items-center gap-1.5 justify-between">
                <span className="flex items-center gap-1.5"><Activity size={16} className="text-indigo-400" /> Mean Annual Return</span>
                <span className="text-slate-400 font-normal normal-case text-xs bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-800/50">Target: 7%</span>
              </label>
              <div className="flex gap-4">
                <Slider
                  min={0}
                  max={0.2}
                  step={0.005}
                  value={input.meanReturn}
                  onChange={(val) => onChange('meanReturn', val)}
                  className="flex-1"
                  trackStyle={{ backgroundColor: '#6366f1' }}
                  handleStyle={{ borderColor: '#6366f1' }}
                />
                <InputNumber
                  min={0}
                  max={0.5}
                  step={0.01}
                  value={input.meanReturn}
                  onChange={(val) => onChange('meanReturn', val || 0)}
                  formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                  parser={(value) => (Number(value?.replace('%', '')) / 100) as unknown as number}
                  className="w-32"
                  size="large"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 uppercase flex items-center gap-1.5 justify-between">
                <span className="flex items-center gap-1.5"><Activity size={16} className="text-rose-400" /> Inflation Rate</span>
                <span className="text-slate-400 font-normal normal-case text-xs bg-rose-900/30 px-2 py-0.5 rounded border border-rose-800/50">Typical: 3%</span>
              </label>
              <div className="flex gap-4">
                <Slider
                  min={0}
                  max={0.15}
                  step={0.005}
                  value={input.inflationRate}
                  onChange={(val) => onChange('inflationRate', val)}
                  className="flex-1"
                  trackStyle={{ backgroundColor: '#f43f5e' }}
                  handleStyle={{ borderColor: '#f43f5e' }}
                />
                <InputNumber
                  min={0}
                  max={0.3}
                  step={0.01}
                  value={input.inflationRate}
                  onChange={(val) => onChange('inflationRate', val || 0)}
                  formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                  parser={(value) => (Number(value?.replace('%', '')) / 100) as unknown as number}
                  className="w-32"
                  size="large"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 uppercase flex items-center gap-1.5 justify-between">
                <span className="flex items-center gap-1.5"><Activity size={16} className="text-slate-400" /> Management Fee</span>
                <span className="text-slate-400 font-normal normal-case text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Typical: 1%</span>
              </label>
              <div className="flex gap-4">
                <Slider
                  min={0}
                  max={0.05}
                  step={0.001}
                  value={input.managementFee}
                  onChange={(val) => onChange('managementFee', val)}
                  className="flex-1"
                  trackStyle={{ backgroundColor: '#64748b' }}
                  handleStyle={{ borderColor: '#64748b' }}
                />
                <InputNumber
                  min={0}
                  max={0.1}
                  step={0.001}
                  value={input.managementFee}
                  onChange={(val) => onChange('managementFee', val || 0)}
                  formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`}
                  parser={(value) => (Number(value?.replace('%', '')) / 100) as unknown as number}
                  className="w-32"
                  size="large"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 uppercase flex items-center gap-1.5 justify-between">
                <span className="flex items-center gap-1.5"><Activity size={16} className="text-amber-400" /> Volatility / Risk</span>
                <span className="text-slate-400 font-normal normal-case text-xs bg-amber-900/30 px-2 py-0.5 rounded border border-amber-800/50">Risk: 15%</span>
              </label>
              <div className="flex gap-4">
                <Slider
                  min={0}
                  max={0.4}
                  step={0.01}
                  value={input.volatility}
                  onChange={(val) => onChange('volatility', val)}
                  className="flex-1"
                  trackStyle={{ backgroundColor: '#f59e0b' }}
                  handleStyle={{ borderColor: '#f59e0b' }}
                />
                <InputNumber
                  min={0}
                  max={1}
                  step={0.01}
                  value={input.volatility}
                  onChange={(val) => onChange('volatility', val || 0)}
                  formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                  parser={(value) => (Number(value?.replace('%', '')) / 100) as unknown as number}
                  className="w-32"
                  size="large"
                />
              </div>
            </div>
          </div>
        );
      case 'goals':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 uppercase flex items-center gap-1.5">
                <CalendarDays size={16} className="text-purple-400" /> Years to Retain
              </label>
              <div className="flex gap-4">
                <Slider
                  min={1}
                  max={60}
                  step={1}
                  value={input.years}
                  onChange={(val) => onChange('years', val)}
                  className="flex-1"
                  trackStyle={{ backgroundColor: '#a855f7' }}
                  handleStyle={{ borderColor: '#a855f7' }}
                />
                <InputNumber
                  min={1}
                  max={100}
                  value={input.years}
                  onChange={(val) => onChange('years', val || 1)}
                  formatter={(value) => `${value} yrs`}
                  parser={(value) => value!.replace(' yrs', '') as unknown as number}
                  className="w-32"
                  size="large"
                />
              </div>
            </div>

            <div className="space-y-2 p-4 bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-xl shadow-inner">
              <label className="text-sm font-bold text-amber-500 uppercase flex items-center gap-1.5 mb-2">
                <Target size={18} className="text-amber-400" /> Target Goal Amount
              </label>
              <InputNumber
                min={0}
                value={input.targetGoal}
                onChange={(val) => onChange('targetGoal', val || 0)}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|,(?=\d{3})/g, '') as unknown as number}
                className="w-full"
                size="large"
                style={{ fontSize: '1.25rem', width: '100%' }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgElevated: '#1e293b', // slate-800 for dropdown bg
          colorBorder: '#334155', // slate-700
          colorText: '#f8fafc',
        },
        components: {
          Select: {
            selectorBg: '#0f172a', // slate-900
            colorBorder: '#334155', // slate-700
          },
          InputNumber: {
            colorBgContainer: '#0f172a', // slate-900
            colorBorder: '#334155', // slate-700
          }
        }
      }}
    >
      <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 h-full flex flex-col">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-2 text-slate-100">
            <Settings size={22} className="text-blue-500" />
            <h2 className="text-lg font-extrabold tracking-tight">Parameters</h2>
          </div>

          <Select
            value={activeCategory}
            onChange={(value) => setActiveCategory(value)}
            options={categoryOptions}
            className="w-full shadow-sm"
            size="large"
            dropdownStyle={{ borderRadius: '0.5rem' }}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-4">
          {renderInputs()}
        </div>
      </div>
    </ConfigProvider>
  );
}
