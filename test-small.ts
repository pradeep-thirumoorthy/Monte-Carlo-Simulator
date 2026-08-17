export function runSim() {
  const initialInvestment = 100000;
  const annualContribution = 10000;
  const years = 30;
  const meanReturn = 0.07;
  const volatility = 0.0;
  
  let currentValue = initialInvestment;
  for (let y = 1; y <= years; y++) {
    const return_t = Math.exp((meanReturn - 0.5 * volatility * volatility) + volatility * 0);
    currentValue = (currentValue + annualContribution) * return_t;
    console.log(`Year ${y}: ${currentValue}`);
  }
}
runSim();
