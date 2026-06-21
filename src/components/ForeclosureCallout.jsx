import { formatINR } from '../lib/format';

export default function ForeclosureCallout({ foreclosure }) {
  if (!foreclosure) return null;

  const { closeMonth, pathA, pathB, savings, savesMoney, message } = foreclosure;

  return (
    <section className={`card foreclosure ${savesMoney ? 'saves' : 'costs'}`}>
      <h2>Early Closure Analysis</h2>
      <div className="foreclosure-paths">
        <div className="foreclosure-path">
          <h3>Path A: Full Term</h3>
          <p>{formatINR(pathA)}</p>
        </div>
        <div className="foreclosure-path">
          <h3>Path B: Close at Month {closeMonth}</h3>
          <p>{formatINR(pathB)}</p>
        </div>
      </div>
      <p className="foreclosure-message">
        <strong>{message}</strong>
      </p>
      {savesMoney && (
        <p className="muted">Estimated savings: {formatINR(savings)}</p>
      )}
    </section>
  );
}
