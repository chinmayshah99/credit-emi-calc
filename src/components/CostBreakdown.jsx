import { formatApr, formatINR } from '../lib/format';

export default function CostBreakdown({ breakdown, emiMode }) {
  if (!breakdown) return null;

  const {
    purchasePrice,
    cartDiscount,
    emiBasePrice,
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
    trueApr,
    baseEmi,
  } = breakdown;

  return (
    <section className="card">
      <h2>Cost Breakdown</h2>
      <dl className="breakdown-list">
        <div className="breakdown-row">
          <dt>Base Item Price</dt>
          <dd>{formatINR(purchasePrice)}</dd>
        </div>
        {cartDiscount > 0 && (
          <div className="breakdown-row deduction">
            <dt>Less: Instant Cart / Exchange Discount</dt>
            <dd>−{formatINR(cartDiscount)}</dd>
          </div>
        )}
        <div className="breakdown-row highlight">
          <dt>EMI Base Price</dt>
          <dd>{formatINR(emiBasePrice)}</dd>
        </div>
        {emiMode === 'no-cost' && merchantDiscount > 0 && (
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
          <dt>Net Extra Cost Over Upfront Payment</dt>
          <dd>
            {formatINR(extraCost)}{' '}
            <span className="muted">({extraCostPercent.toFixed(2)}% premium)</span>
          </dd>
        </div>
        <div className="breakdown-row highlight">
          <dt>True Effective Annual Rate (APR)</dt>
          <dd>{formatApr(trueApr)}</dd>
        </div>
      </dl>
    </section>
  );
}
