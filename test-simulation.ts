import { runSimulation } from './src/lib/simulator.js';

// Convert TS logic to a script for execution
const input = {
  initialInvestment: 100000,
  annualContribution: 10000,
  years: 30,
  meanReturn: 0.07,
  volatility: 0.15,
  targetGoal: 1000000
};

const result = runSimulation(input, 2000);

console.log('--- Simulation Results ---');
console.log(`Median Ending Value: $${result.medianEndingValue.toFixed(2)}`);
console.log(`Probability of Success: ${(result.probabilityOfSuccess * 100).toFixed(2)}%`);
console.log(`Value At Risk (95% CI): $${result.valueAtRisk.toFixed(2)}`);
console.log(`Paths generated: ${result.paths.length}`);
console.log(`Percentile years: ${result.percentiles.length}`);
console.log(`Histogram bins: ${result.histogram.length}`);

// Example terminal output checking bounds
const isReasonable = result.medianEndingValue > 500000 && result.medianEndingValue < 3000000;
console.log(`Is median reasonable? ${isReasonable ? 'YES' : 'NO'}`);
