import { formatINR } from '../lib/format';

export default function CostBreakdown({ breakdown, isNoCost }) {
  if (!breakdown) return null;

  const {
    purchasePrice,
    merchantDiscount,
    netLoanPrincipal,
    totalInterest,
    totalInterestGst,
    processingFee,
    gstOnProcessing,
    directDiscount,
    absoluteTotalCost,
    extraCost,
    extraCostPercent,
    costFloored,
    trueApr,
    baseEmi,
  } = breakdown;

  return (
    <section className="card">
      <h2>Cost Breakdown</h2>
      {costFloored && (
        <div className="warning-badge">
          Heavy discounts applied — extra cost floored at net loan principal.
        </div>
      )}
      <dl className="breakdown-list">
        <div className="breakdown-row">
          <dt>Base Item Price</dt>
          <dd>{formatINR(purchasePrice)}</dd>
        </div>
        {isNoCost && merchantDiscount > 0 && (
          <div className="breakdown-row deduction">
            <dt>Less: Upfront Merchant/No-Cost Discount</dt>
            <dd>−{formatINR(merchantDiscount)}</dd>
          </div>
        )}
        <div className="breakdown-row highlight">
          <dt>Net Loan Principal</dt>
          <dd>{formatINR(netLoanPrincipal)}</dd>
        </div>
        <div className="breakdown-row">
          <dt>Monthly Base EMI</dt>
          <dd>{formatINR(baseEmi)}</dd>
        </div>
        <div className="breakdown-row">
          <dt>Total Stated Interest</dt>
          <dd>{formatINR(totalInterest)}</dd>
        </div>
        <div className="breakdown-row">
          <dt>Total GST on Interest</dt>
          <dd>{formatINR(totalInterestGst)}</dd>
        </div>
        <div className="breakdown-row">
          <dt>Processing Fee (Pre-Tax)</dt>
          <dd>{formatINR(processingFee)}</dd>
        </div>
        <div className="breakdown-row">
          <dt>GST on Processing Fee</dt>
          <dd>{formatINR(gstOnProcessing)}</dd>
        </div>
        {directDiscount > 0 && (
          <div className="breakdown-row deduction">
            <dt>Less: Direct Bank Discount / Cashback</dt>
            <dd>−{formatINR(directDiscount)}</dd>
          </div>
        )}
        <div className="breakdown-row total">
          <dt>Absolute Total Cost of EMI</dt>
          <dd>{formatINR(absoluteTotalCost)}</dd>
        </div>
        <div className="breakdown-row total">
          <dt>Net Extra Cost Over Cash Price</dt>
          <dd>
            {formatINR(extraCost)}{' '}
            <span className="muted">({extraCostPercent.toFixed(2)}% premium)</span>
          </dd>
        </div>
        <div className="breakdown-row highlight">
          <dt>True Effective Annual Rate (APR)</dt>
          <dd>{trueApr.toFixed(2)}% p.a.</dd>
        </div>
      </dl>
    </section>
  );
}
