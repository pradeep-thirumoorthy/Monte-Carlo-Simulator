export interface SimulationInput {
  initialInvestment: number;
  annualContribution: number;
  years: number;
  meanReturn: number; // e.g., 0.07
  volatility: number; // e.g., 0.12
  targetGoal: number;
}

export interface PercentileData {
  year: number;
  p5: number;
  p50: number;
  p95: number;
}

export interface HistogramBin {
  range: string;
  min: number;
  max: number;
  count: number;
}

export interface SimulationOutput {
  paths: number[][]; // Only the first 100 paths
  percentiles: PercentileData[];
  histogram: HistogramBin[];
  medianEndingValue: number;
  probabilityOfSuccess: number;
  valueAtRisk: number; // 95% VaR (Median - 5th Percentile)
}

// Box-Muller transform for standard normal variable
function randn_bm() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function runSimulation(input: SimulationInput, numSimulations = 2000): SimulationOutput {
  const { initialInvestment, annualContribution, years, meanReturn, volatility, targetGoal } = input;
  
  const allPaths: number[][] = [];
  const finalValues: number[] = [];
  let successCount = 0;

  for (let i = 0; i < numSimulations; i++) {
    const path: number[] = [initialInvestment];
    let currentValue = initialInvestment;

    for (let y = 1; y <= years; y++) {
      const z = randn_bm();
      // dt = 1 year
      const return_t = Math.exp((meanReturn - 0.5 * volatility * volatility) + volatility * z);
      currentValue = (currentValue + annualContribution) * return_t;
      if (isNaN(currentValue)) throw new Error("currentValue became NaN");
      path.push(currentValue);
    }

    allPaths.push(path);
    finalValues.push(currentValue);
    if (currentValue >= targetGoal) {
      successCount++;
    }
  }

  // Calculate percentiles per year
  const percentiles: PercentileData[] = [];
  for (let y = 0; y <= years; y++) {
    const yearValues = allPaths.map(p => p[y]).sort((a, b) => a - b);
    percentiles.push({
      year: y,
      p5: yearValues[Math.floor(numSimulations * 0.05)],
      p50: yearValues[Math.floor(numSimulations * 0.50)],
      p95: yearValues[Math.floor(numSimulations * 0.95)]
    });
  }

  // Final Outcome stats
  finalValues.sort((a, b) => a - b);
  const medianEndingValue = percentiles[years].p50;
  const p5EndingValue = percentiles[years].p5;
  const valueAtRisk = medianEndingValue - p5EndingValue;
  const probabilityOfSuccess = successCount / numSimulations;

  // Histogram calculation
  const minFinal = finalValues[0];
  const maxFinal = finalValues[numSimulations - 1];
  const binCount = 30; // 30 bins
  let binWidth = (maxFinal - minFinal) / binCount;
  if(binWidth === 0) binWidth = 1;

  const histogram: HistogramBin[] = Array.from({ length: binCount }).map((_, i) => ({
    min: minFinal + i * binWidth,
    max: minFinal + (i + 1) * binWidth,
    count: 0,
    range: `${Math.round(minFinal + i * binWidth)} - ${Math.round(minFinal + (i + 1) * binWidth)}`
  }));

  finalValues.forEach(val => {
    let binIdx = Math.floor((val - minFinal) / binWidth);
    if (binIdx >= binCount) binIdx = binCount - 1; // edge case for max element
    if (binIdx < 0) binIdx = 0;
    histogram[binIdx].count++;
  });

  // Extract exactly 100 paths for Spaghetti chart
  const paths = allPaths.slice(0, 100);

  return {
    paths,
    percentiles,
    histogram,
    medianEndingValue,
    probabilityOfSuccess,
    valueAtRisk
  };
}

const input = {
  initialInvestment: 100000,
  annualContribution: 10000,
  years: 30,
  meanReturn: 0.07,
  volatility: 0.0,
  targetGoal: 1000000
};

try {
  const result = runSimulation(input, 100);
  console.log(`Median with Vol=0: ${result.medianEndingValue}`);
} catch (e) {
  console.error(e);
}
