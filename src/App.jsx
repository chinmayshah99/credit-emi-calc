import { useMemo, useState } from 'react';
import { calculateAll, DEFAULT_INPUTS } from './lib/emiEngine';
import { formatINR } from './lib/format';
import InputPanel from './components/InputPanel';
import CostBreakdown from './components/CostBreakdown';
import AmortTable from './components/AmortTable';
import ComparisonMatrix from './components/ComparisonMatrix';
import ForeclosureCallout from './components/ForeclosureCallout';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);

  const results = useMemo(() => calculateAll(inputs), [inputs]);

  return (
    <div className="app">
      <header className="header">
        <h1>Credit Card EMI Total Cost Calculator</h1>
        <p className="subtitle">
          Discover the true cost of Indian credit card EMI offers — including GST, processing
          fees, and No-Cost EMI hidden charges.
        </p>
      </header>

      <main className="split-layout">
        <InputPanel inputs={inputs} onChange={setInputs} />

        {results.valid && (
          <div className="summary-bar" aria-label="Quick summary">
            <div className="summary-bar-item">
              <span className="summary-bar-label">Total cost</span>
              <span className="summary-bar-value">
                {formatINR(results.breakdown.absoluteTotalCost)}
              </span>
            </div>
            <div className="summary-bar-item">
              <span className="summary-bar-label">True APR</span>
              <span className="summary-bar-value accent">
                {results.breakdown.trueApr.toFixed(2)}% p.a.
              </span>
            </div>
            <div className="summary-bar-item">
              <span className="summary-bar-label">Extra over cash</span>
              <span className="summary-bar-value">
                {formatINR(results.breakdown.extraCost)}
              </span>
            </div>
          </div>
        )}

        <section className="results-panel">
          {!results.valid ? (
            <div className="card empty-state">{results.error}</div>
          ) : (
            <>
              <CostBreakdown
                breakdown={results.breakdown}
                isNoCost={results.inputs.isNoCost}
              />
              <ComparisonMatrix comparison={results.comparison} />
              {results.foreclosure && (
                <ForeclosureCallout foreclosure={results.foreclosure} />
              )}
              <AmortTable schedule={results.schedule} />
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
