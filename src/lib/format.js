const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

export function formatINR(value) {
  if (value == null || Number.isNaN(value)) return inrFormatter.format(0);
  return inrFormatter.format(value);
}

export function formatPercent(value, digits = 2) {
  if (value == null || Number.isNaN(value)) return '0%';
  return `${value.toFixed(digits)}%`;
}
