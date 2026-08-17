const r = Math.exp(0.07 - 0.5 * 0.15 * 0.15);
console.log("Expected Return median factor:", r);
let val = 100000;
for(let i=0; i<30; i++) val = (val + 10000) * r;
console.log("Expected median without vol noise = ", val);
