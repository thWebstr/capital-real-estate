// Small helpers for AI assistant parsing & calculations
export function formatCurrency(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function parsePriceFromText(text) {
  if (!text) return null;
  const match = text.replace(/,/g, '').match(/\$?\s*(\d+(?:\.\d+)?)(k|m)?/i);
  if (!match) return null;
  let [, num, scale] = match;
  let value = parseFloat(num);
  if (scale) {
    if (/k/i.test(scale)) value *= 1000;
    if (/m/i.test(scale)) value *= 1000000;
  }
  return Math.round(value);
}

export function calculateMortgage(price, downPct = 20, annualRate = 6.5, years = 30) {
  const principal = price * (1 - downPct / 100);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const payment = (principal * r) / (1 - Math.pow(1 + r, -n));
  return {
    monthly: Math.round(payment),
    principal: Math.round(principal),
    downPayment: Math.round(price * downPct / 100),
    annualRate,
    years
  };
}

export function searchProperties(properties, { priceMax, city, bedrooms }) {
  let results = [...properties];
  if (priceMax) results = results.filter(p => p.price <= priceMax);
  if (city) results = results.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
  if (bedrooms) results = results.filter(p => p.bedrooms >= bedrooms);
  return results;
}
