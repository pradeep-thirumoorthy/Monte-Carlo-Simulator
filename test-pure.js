let currentValue = 100000;
let annualContribution = 10000;
let return_t = Math.exp(0.07); // 1.072508
console.log("Return factor:", return_t);
for(let y=1; y<=30; y++) {
  currentValue = (currentValue + annualContribution) * return_t;
  console.log("Year " + y + ": " + currentValue);
}
