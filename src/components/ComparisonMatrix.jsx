import { formatINR } from '../lib/format';

export default function ComparisonMatrix({ comparison }) {
  if (!comparison) return null;

  const {
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
      <div className="comparison-grid">
        <div className="comparison-col">
          <h3>Pay Upfront</h3>
          <dl>
            <div className="comparison-row">
              <dt>Total Outflow</dt>
              <dd>{formatINR(upfrontTotalOutflow)}</dd>
            </div>
            <div className="comparison-row">
              <dt>Effective Cost</dt>
              <dd>{formatINR(upfrontEffectiveCost)}</dd>
            </div>
            <div className="comparison-row">
              <dt>Perk</dt>
              <dd>Full reward points retained</dd>
            </div>
          </dl>
        </div>
        <div className="comparison-col">
          <h3>Chosen EMI Strategy</h3>
          <dl>
            <div className="comparison-row">
              <dt>Total Dynamic Outflow</dt>
              <dd>{formatINR(emiTotalOutflow)}</dd>
            </div>
            <div className="comparison-row">
              <dt>True APR</dt>
              <dd>{trueApr.toFixed(2)}% p.a.</dd>
            </div>
            <div className="comparison-row">
              <dt>Impact</dt>
              <dd>Credit limit blocked by the remaining loan balance</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className={`recommendation recommendation-${recommendation}`}>
        <strong>Recommendation:</strong> {recommendationText}
      </p>
    </section>
  );
}
