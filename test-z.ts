import { runSimulation } from './src/lib/simulator.js';

const input = {
  initialInvestment: 100000,
  annualContribution: 10000,
  years: 30,
  meanReturn: 0.07,
  volatility: 0.0,
  targetGoal: 1000000
};

const result = runSimulation(input, 100);
console.log(`Median with Vol=0: ${result.medianEndingValue}`);
