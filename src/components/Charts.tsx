import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Select, ConfigProvider, theme } from 'antd';
import { AreaChartOutlined, LineChartOutlined, BarChartOutlined, PieChartOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { SimulationOutput } from '../lib/simulator';
import { formatCompact, formatCurrency } from '../lib/format';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartsProps {
  output: SimulationOutput;
}

export function Charts({ output }: ChartsProps) {
  const [activeChart, setActiveChart] = useState<string>('spaghetti');

  // Chart axes colors for dark theme
  const gridColor = '#334155'; // slate-700
  const tickColor = '#94a3b8'; // slate-400

  // 1. Spaghetti Chart Data
  const spaghettiData = useMemo(() => {
    const labels = output.percentiles.map((p) => `Year ${p.year}`);
    const datasets = output.paths.map((path, i) => ({
      label: `Path ${i + 1}`,
      data: path,
      borderColor: '#3b82f6',
      borderWidth: 1,
      pointRadius: 0,
      tension: 0.1,
      opacity: 0.25,
      borderDash: [],
    }));

    return { labels, datasets };
  }, [output.paths, output.percentiles]);

  const spaghettiOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        theme: 'dark',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => formatCurrency(context.raw),
        },
      },
    },
    scales: {
      y: {
        ticks: { color: tickColor, callback: (value: any) => formatCompact(value) },
        grid: { color: gridColor, drawBorder: false },
        border: { display: false },
      },
      x: {
        ticks: { color: tickColor, maxTicksLimit: 10 },
        grid: { display: false },
        border: { display: false },
      },
    },
    elements: {
      line: {
        borderColor: 'rgba(59, 130, 246, 0.3)', // increased opacity for dark mode
      },
    },
  };

  // 2. Percentile Cones Data (Line chart with fill)
  const percentileData = useMemo(() => {
    const labels = output.percentiles.map((p) => `Yr ${p.year}`);
    return {
      labels,
      datasets: [
        {
          label: '95th Percentile',
          data: output.percentiles.map((p) => p.p95),
          borderColor: '#818cf8',
          backgroundColor: 'rgba(199, 210, 254, 0.2)', // c7d2fe with opacity
          fill: 1, // Fill to the next dataset (50th)
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: 'Median (50th)',
          data: output.percentiles.map((p) => p.p50),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(129, 140, 248, 0.3)',
          fill: 2, // Fill to the next dataset (5th)
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: '5th Percentile',
          data: output.percentiles.map((p) => p.p5),
          borderColor: '#4338ca',
          fill: 'origin', // Fill to the bottom
          backgroundColor: 'rgba(79, 70, 229, 0.4)',
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    };
  }, [output.percentiles]);

  const percentileOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${formatCurrency(context.raw)}`,
        },
      },
      legend: {
        position: 'top' as const,
        labels: { color: tickColor, usePointStyle: true, pointStyle: 'circle' },
      },
    },
    scales: {
      y: {
        ticks: { color: tickColor, callback: (value: any) => formatCompact(value) },
        grid: { color: gridColor, drawBorder: false },
        border: { display: false },
      },
      x: {
        ticks: { color: tickColor, maxTicksLimit: 10 },
        grid: { display: false },
        border: { display: false },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  // 3. Histogram Data
  const histogramData = useMemo(() => {
    return {
      labels: output.histogram.map((b) => b.range),
      datasets: [
        {
          label: 'Simulations',
          data: output.histogram.map((b) => b.count),
          backgroundColor: '#2dd4bf', // Tailwind teal-400
          borderRadius: 4,
        },
      ],
    };
  }, [output.histogram]);

  const histogramOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          title: (context: any) => `Outcome Range: ${context[0].label}`,
          label: (context: any) => `Count: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        ticks: { color: tickColor },
        grid: { color: gridColor, drawBorder: false },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: tickColor, maxRotation: 45, minRotation: 45, font: { size: 10 } },
        border: { display: false },
      },
    },
  };

  // 4. Probability Pie Data (Doughnut)
  const pieData = useMemo(() => {
    return {
      labels: ['Success', 'Shortfall'],
      datasets: [
        {
          data: [output.probabilityOfSuccess * 100, (1 - output.probabilityOfSuccess) * 100],
          backgroundColor: ['#10b981', '#ef4444'], // green-500, red-500
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };
  }, [output.probabilityOfSuccess]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: tickColor, usePointStyle: true, pointStyle: 'circle' },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw.toFixed(1)}%`,
        },
      },
    },
  };

  const chartOptions = [
    { value: 'spaghetti', label: <span className="flex items-center gap-2"><LineChartOutlined /> Sample Paths</span> },
    { value: 'percentiles', label: <span className="flex items-center gap-2"><AreaChartOutlined /> Confidence Intervals</span> },
    { value: 'histogram', label: <span className="flex items-center gap-2"><BarChartOutlined /> Outcome Distribution</span> },
    { value: 'pie', label: <span className="flex items-center gap-2"><PieChartOutlined /> Success Probability</span> },
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'spaghetti':
        return (
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 h-[28rem] transform transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  Projected Sample Paths
                  <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">First 100 trials</span>
                </h3>
                <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5"><InfoCircleOutlined /> Each line represents one possible simulated future based on geometric brownian motion.</p>
              </div>
              <div className="text-right bg-slate-800/50 px-4 py-2 rounded-xl border border-blue-900/30">
                <div className="text-xs font-semibold uppercase text-blue-400 tracking-wider">Median Ending Value</div>
                <div className="text-xl font-bold text-blue-300">{formatCurrency(output.medianEndingValue)}</div>
              </div>
            </div>
            <div className="w-full flex-1 relative">
              <Line data={spaghettiData} options={spaghettiOptions} />
            </div>
          </div>
        );
      case 'percentiles':
        return (
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 h-[28rem] transform transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Confidence Intervals (5th, 50th, 95th)</h3>
                <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5"><InfoCircleOutlined /> The cone visualizes the increasingly wide range of possible outcomes over time.</p>
              </div>
              <div className="text-right bg-slate-800/50 px-4 py-2 rounded-xl border border-indigo-900/30">
                <div className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">Value at Risk (95% CI)</div>
                <div className="text-xl font-bold text-indigo-300">{formatCurrency(output.valueAtRisk)}</div>
              </div>
            </div>
            <div className="w-full flex-1 relative">
              <Line data={percentileData} options={percentileOptions} />
            </div>
          </div>
        );
      case 'histogram':
        const highestBin = [...output.histogram].sort((a, b) => b.count - a.count)[0];
        return (
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 h-[28rem] transform transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Distribution of Final Outcomes</h3>
                <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5"><InfoCircleOutlined /> Shows the frequency of geometric ending values across all 2000 simulated iterations.</p>
              </div>
              <div className="text-right bg-slate-800/50 px-4 py-2 rounded-xl border border-teal-900/30">
                <div className="text-xs font-semibold uppercase text-teal-400 tracking-wider">Most Common Range (Mode)</div>
                <div className="text-xl font-bold text-teal-300">{highestBin ? highestBin.range : 'N/A'}</div>
              </div>
            </div>
            <div className="w-full flex-1 relative">
              <Bar data={histogramData} options={histogramOptions} />
            </div>
          </div>
        );
      case 'pie':
        return (
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 h-[28rem] flex flex-col transform transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Probability of Reaching Target</h3>
                <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5"><InfoCircleOutlined /> Likelihood that the median ending path meets or exceeds your specified portfolio target.</p>
              </div>
            </div>
            <div className="w-full flex-1 flex items-center justify-center relative min-h-0">
              <div className="w-full h-full pb-8 max-w-sm mx-auto">
                <Doughnut data={pieData} options={pieOptions} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12">
                <span className={`text-5xl font-extrabold ${output.probabilityOfSuccess > 0.5 ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {(output.probabilityOfSuccess * 100).toFixed(0)}%
                </span>
                <span className="text-sm text-slate-400 font-medium tracking-wide mt-1 uppercase">Success</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-12 w-full mt-6">
      <div className="flex justify-between items-center px-2">
        {/* <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          Advanced Visualizations
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded uppercase font-semibold ml-2">Pro</span>
        </h2> */}

        {/* Wrap Select in ConfigProvider to apply dark theme to the dropdown */}
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
              }
            }
          }}
        >
          <Select
            value={activeChart}
            onChange={(value) => setActiveChart(value)}
            options={chartOptions}
            style={{ width: 280 }}
            size="large"
            className="shadow-sm rounded-lg"
            dropdownStyle={{ borderRadius: '0.5rem' }}
          />
        </ConfigProvider>
      </div>

      <div className="w-full animate-in fade-in duration-500">
        {renderChart()}
      </div>
    </div>
  );
}
