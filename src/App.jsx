import { useMemo, useState } from 'react';
import { calculateAll, DEFAULT_INPUTS } from './lib/emiEngine';
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
