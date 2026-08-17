import { runSimulation } from './src/lib/simulator.js';

const input = {
  initialInvestment: 100000,
  annualContribution: 10000,
  years: 30,
  meanReturn: 0.07,
  volatility: 0.15,
  targetGoal: 1000000
};

console.log(typeof input.initialInvestment, typeof input.annualContribution);

const r = runSimulation(input, 1);
console.log(r.medianEndingValue);
