import { formatINR } from './format';

export const DEFAULT_INPUTS = {
  purchasePrice: 60000,
  emiMode: 'regular',
  tenure: 6,
  customTenure: '',
  statedRate: 16,
  processingFeeValue: 299,
  processingFeeType: 'flat',
  gstRate: 18,
  directDiscount: 0,
  cashDiscount: 0,
  modelEarlyClosure: false,
  foreclosureFee: 3,
  closeAfterMonth: 3,
};

export function getEffectiveTenure(inputs) {
  if (inputs.customTenure !== '' && inputs.customTenure != null) {
    const custom = parseInt(inputs.customTenure, 10);
    if (!Number.isNaN(custom) && custom >= 1 && custom <= 60) return custom;
  }
  return inputs.tenure;
}

export function calcEMI(principal, annualRate, months) {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate === 0) return principal / months;

  const r = annualRate / 12 / 100;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

export function buildSchedule(principal, annualRate, months, gstRate) {
  if (principal <= 0 || months <= 0) return [];

  const emi = calcEMI(principal, annualRate, months);
  const r = annualRate / 12 / 100;
  const gstMultiplier = gstRate / 100;
  const rows = [];
  let balance = principal;

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * r;
    const principalComponent = emi - interest;
    const gstOnInterest = interest * gstMultiplier;
    const totalOutflow = emi + gstOnInterest;
    balance = Math.max(0, balance - principalComponent);

    rows.push({
      month,
      baseEmi: emi,
      principal: principalComponent,
      interest,
      gstOnInterest,
      totalOutflow,
      remainingBalance: balance,
    });
  }

  return rows;
}

export function solveNoCostPrincipal(purchasePrice, annualRate, months) {
  if (purchasePrice <= 0 || months <= 0) return purchasePrice;

  let low = 0;
  let high = purchasePrice;
  const tolerance = 0.01;

  for (let i = 0; i < 100; i += 1) {
    const mid = (low + high) / 2;
    const emi = calcEMI(mid, annualRate, months);
    const totalPayments = emi * months;

    if (Math.abs(totalPayments - purchasePrice) < tolerance) return mid;
    if (totalPayments > purchasePrice) high = mid;
    else low = mid;
  }

  return (low + high) / 2;
}

export function calcProcessingFee(principal, feeType, feeValue) {
  if (feeType === 'flat') return feeValue;
  return principal * (feeValue / 100);
}

export function solveTrueAPR(cashFlows) {
  const { inflow, outflows } = cashFlows;
  if (inflow <= 0 || outflows.length === 0) return 0;

  function npv(rate) {
    let total = inflow;
    for (let t = 0; t < outflows.length; t += 1) {
      total -= outflows[t] / Math.pow(1 + rate, t);
    }
    return total;
  }

  let low = 0;
  let high = 0.05;

  if (npv(high) <= 0) {
    while (npv(high) <= 0 && high < 1) {
      high *= 2;
    }
  }

  if (npv(low) >= 0) return 0;

  for (let i = 0; i < 100; i += 1) {
    const mid = (low + high) / 2;
    const value = npv(mid);
    if (Math.abs(value) < 1e-8) return mid * 12 * 100;
    if (value < 0) low = mid;
    else high = mid;
  }

  return ((low + high) / 2) * 12 * 100;
}

export function calculateAll(rawInputs) {
  const purchasePrice = Number(rawInputs.purchasePrice) || 0;
  const annualRate = Number(rawInputs.statedRate) || 0;
  const gstRate = Number(rawInputs.gstRate) || 0;
  const directDiscount = Number(rawInputs.directDiscount) || 0;
  const cashDiscount = Number(rawInputs.cashDiscount) || 0;
  const foreclosureFeeRate = Number(rawInputs.foreclosureFee) || 0;
  const months = getEffectiveTenure(rawInputs);
  const isNoCost = rawInputs.emiMode === 'no-cost';

  if (purchasePrice <= 0 || months <= 0) {
    return { valid: false, error: 'Enter a valid purchase price and tenure.' };
  }

  let netLoanPrincipal = purchasePrice;
  let merchantDiscount = 0;

  if (isNoCost) {
    netLoanPrincipal = solveNoCostPrincipal(purchasePrice, annualRate, months);
    merchantDiscount = purchasePrice - netLoanPrincipal;
  }

  const schedule = buildSchedule(netLoanPrincipal, annualRate, months, gstRate);
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
  const totalInterestGst = schedule.reduce((sum, row) => sum + row.gstOnInterest, 0);
  const totalBaseEmi = schedule.reduce((sum, row) => sum + row.baseEmi, 0);

  const processingFee = calcProcessingFee(
    netLoanPrincipal,
    rawInputs.processingFeeType,
    Number(rawInputs.processingFeeValue) || 0,
  );
  const gstOnProcessing = processingFee * (gstRate / 100);

  const absoluteTotalCost =
    netLoanPrincipal +
    totalInterest +
    totalInterestGst +
    processingFee +
    gstOnProcessing -
    directDiscount;

  const upfrontEffectiveCost = Math.max(0, purchasePrice - cashDiscount);
  const upfrontTotalOutflow = upfrontEffectiveCost;
  const extraCost = absoluteTotalCost - upfrontEffectiveCost;
  const extraCostPercent =
    upfrontEffectiveCost > 0 ? (extraCost / upfrontEffectiveCost) * 100 : 0;

  const upfrontOutflow = processingFee + gstOnProcessing - directDiscount;
  const monthlyOutflows = schedule.map((row) => row.totalOutflow);
  const trueApr = solveTrueAPR({
    inflow: purchasePrice,
    outflows: [upfrontOutflow, ...monthlyOutflows],
  });

  const emiTotalOutflow = absoluteTotalCost;

  let recommendation = 'pay-upfront';
  let recommendationText = 'Paying upfront costs less after discounts.';

  if (emiTotalOutflow < upfrontEffectiveCost) {
    recommendation = 'emi';
    recommendationText =
      'The chosen EMI strategy costs less than paying upfront after discounts.';
  } else if (Math.abs(emiTotalOutflow - upfrontEffectiveCost) < 1) {
    recommendation = 'tie';
    recommendationText = 'Both options have roughly the same effective cost.';
  }

  let foreclosure = null;
  if (rawInputs.modelEarlyClosure) {
    const closeMonth = Number(rawInputs.closeAfterMonth) || 0;
    if (closeMonth > 0 && closeMonth < months) {
      const paidThrough = schedule
        .slice(0, closeMonth)
        .reduce((sum, row) => sum + row.totalOutflow, 0);
      const outstanding = schedule[closeMonth - 1].remainingBalance;
      const foreclosureFee = outstanding * (foreclosureFeeRate / 100);
      const gstOnForeclosure = foreclosureFee * (gstRate / 100);
      const pathA = emiTotalOutflow;
      const pathB =
        upfrontOutflow +
        paidThrough +
        outstanding +
        foreclosureFee +
        gstOnForeclosure;
      const savings = pathA - pathB;

      foreclosure = {
        closeMonth,
        pathA,
        pathB,
        savings,
        outstanding,
        foreclosureFee,
        gstOnForeclosure,
        savesMoney: savings > 0,
        message:
          savings > 0
            ? `Foreclosing at Month ${closeMonth} will save you ${formatINR(savings)} in future interest and tax obligations.`
            : `Foreclosing early at this juncture is more expensive due to penalty levies.`,
      };
    }
  }

  return {
    valid: true,
    inputs: {
      purchasePrice,
      months,
      isNoCost,
      annualRate,
      gstRate,
      directDiscount,
    },
    breakdown: {
      purchasePrice,
      merchantDiscount,
      netLoanPrincipal,
      totalInterest,
      totalInterestGst,
      totalBaseEmi,
      processingFee,
      gstOnProcessing,
      directDiscount,
      cashDiscount,
      absoluteTotalCost,
      extraCost,
      extraCostPercent,
      trueApr,
      baseEmi: schedule[0]?.baseEmi ?? 0,
    },
    schedule,
    comparison: {
      purchasePrice,
      cashDiscount,
      upfrontTotalOutflow,
      upfrontEffectiveCost,
      emiTotalOutflow,
      trueApr,
      recommendation,
      recommendationText,
    },
    foreclosure,
  };
}
