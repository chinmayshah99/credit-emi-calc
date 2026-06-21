import { formatApr, formatINR } from '../lib/format';

export default function ComparisonMatrix({ comparison }) {
  if (!comparison) return null;

  const {
    purchasePrice,
    cartDiscount,
    emiBasePrice,
    cashDiscount,
    upfrontTotalOutflow,
    upfrontEffectiveCost,
    emiTotalOutflow,
    trueApr,
    recommendation,
    recommendationText,
  } = comparison;

  return (
    <section className="card">
      <h2>Upfront vs. EMI Reality Check</h2>
      {cartDiscount > 0 && (
        <p className="section-desc comparison-context">
          Cart discount of {formatINR(cartDiscount)} applied to both paths. EMI and upfront
          comparisons use an EMI base price of {formatINR(emiBasePrice)} (MRP{' '}
          {formatINR(purchasePrice)} − {formatINR(cartDiscount)}).
        </p>
      )}
      <div className="comparison-grid">
        <div className="comparison-col">
          <h3>Pay Upfront</h3>
          <dl>
            {cartDiscount > 0 && (
              <div className="comparison-row">
                <dt>After Cart Discount</dt>
                <dd>{formatINR(emiBasePrice)}</dd>
              </div>
            )}
            {cashDiscount > 0 && (
              <div className="comparison-row">
                <dt>Less: Upfront-Only Discount</dt>
                <dd>−{formatINR(cashDiscount)}</dd>
              </div>
            )}
            <div className="comparison-row">
              <dt>Total Outflow</dt>
              <dd>{formatINR(upfrontTotalOutflow)}</dd>
            </div>
            <div className="comparison-row">
              <dt>Effective Cost</dt>
              <dd>{formatINR(upfrontEffectiveCost)}</dd>
            </div>
          </dl>
        </div>
        <div className="comparison-col">
          <h3>Chosen EMI Strategy</h3>
          <dl>
            {cartDiscount > 0 && (
              <div className="comparison-row">
                <dt>Amount Financed</dt>
                <dd>{formatINR(emiBasePrice)}</dd>
              </div>
            )}
            <div className="comparison-row">
              <dt>Total Dynamic Outflow</dt>
              <dd>{formatINR(emiTotalOutflow)}</dd>
            </div>
            <div className="comparison-row">
              <dt>True APR</dt>
              <dd>{formatApr(trueApr)}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className={`recommendation recommendation-${recommendation}`}>
        <p className="recommendation-label">Recommendation</p>
        <p className="recommendation-text">{recommendationText}</p>
      </div>
    </section>
  );
}
