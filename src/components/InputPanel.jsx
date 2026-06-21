const TENURE_OPTIONS = [3, 6, 9, 12, 18, 24];

export default function InputPanel({ inputs, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...inputs, [field]: value });
  };

  const handleTenureSelect = (value) => {
    onChange({ ...inputs, tenure: Number(value), customTenure: '' });
  };

  const effectiveTenure =
    inputs.customTenure !== '' && inputs.customTenure != null
      ? parseInt(inputs.customTenure, 10)
      : inputs.tenure;

  return (
    <aside className="inputs-panel card">
      <h2>EMI Offer Details</h2>

      <div className="field">
        <label htmlFor="purchasePrice">Purchase Price / Item Cost (₹)</label>
        <input
          id="purchasePrice"
          type="number"
          min="1"
          step="100"
          value={inputs.purchasePrice}
          onChange={(e) => handleChange('purchasePrice', e.target.value)}
          required
        />
      </div>

      <div className="field">
        <span className="label">EMI Mode</span>
        <div className="toggle-group">
          <button
            type="button"
            className={inputs.emiMode === 'regular' ? 'active' : ''}
            onClick={() => handleChange('emiMode', 'regular')}
          >
            Regular EMI
          </button>
          <button
            type="button"
            className={inputs.emiMode === 'no-cost' ? 'active' : ''}
            onClick={() => handleChange('emiMode', 'no-cost')}
          >
            No-Cost EMI
          </button>
        </div>
      </div>

      <div className="field">
        <label htmlFor="tenure">Tenure</label>
        <select
          id="tenure"
          value={inputs.customTenure !== '' ? 'custom' : inputs.tenure}
          onChange={(e) => {
            if (e.target.value === 'custom') {
              handleChange('customTenure', String(inputs.tenure));
            } else {
              handleTenureSelect(e.target.value);
            }
          }}
        >
          {TENURE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t} months
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </div>

      {(inputs.customTenure !== '') && (
        <div className="field">
          <label htmlFor="customTenure">Custom Tenure (1–60 months)</label>
          <input
            id="customTenure"
            type="number"
            min="1"
            max="60"
            value={inputs.customTenure}
            onChange={(e) => handleChange('customTenure', e.target.value)}
          />
        </div>
      )}

      <div className="field">
        <label htmlFor="statedRate">Stated Interest Rate (% p.a.)</label>
        <input
          id="statedRate"
          type="number"
          min="0"
          step="0.1"
          value={inputs.statedRate}
          onChange={(e) => handleChange('statedRate', e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="processingFeeValue">Processing / Conversion Fee</label>
        <div className="inline-fields">
          <input
            id="processingFeeValue"
            type="number"
            min="0"
            step="0.1"
            value={inputs.processingFeeValue}
            onChange={(e) => handleChange('processingFeeValue', e.target.value)}
          />
          <div className="toggle-group compact">
            <button
              type="button"
              className={inputs.processingFeeType === 'flat' ? 'active' : ''}
              onClick={() => handleChange('processingFeeType', 'flat')}
            >
              ₹ Flat
            </button>
            <button
              type="button"
              className={inputs.processingFeeType === 'percent' ? 'active' : ''}
              onClick={() => handleChange('processingFeeType', 'percent')}
            >
              % of Principal
            </button>
          </div>
        </div>
      </div>

      <div className="field">
        <label htmlFor="gstRate">GST Rate (%)</label>
        <input
          id="gstRate"
          type="number"
          min="0"
          step="0.1"
          value={inputs.gstRate}
          onChange={(e) => handleChange('gstRate', e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="directDiscount">Direct Bank Discount / Cashback (₹)</label>
        <input
          id="directDiscount"
          type="number"
          min="0"
          step="100"
          value={inputs.directDiscount}
          onChange={(e) => handleChange('directDiscount', e.target.value)}
        />
      </div>

      <div className="field checkbox-field">
        <label htmlFor="modelEarlyClosure">
          <input
            id="modelEarlyClosure"
            type="checkbox"
            checked={inputs.modelEarlyClosure}
            onChange={(e) => handleChange('modelEarlyClosure', e.target.checked)}
          />
          Model Early Closure?
        </label>
      </div>

      {inputs.modelEarlyClosure && (
        <>
          <div className="field">
            <label htmlFor="foreclosureFee">Foreclosure Fee (%)</label>
            <input
              id="foreclosureFee"
              type="number"
              min="0"
              step="0.1"
              value={inputs.foreclosureFee}
              onChange={(e) => handleChange('foreclosureFee', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="closeAfterMonth">
              Close After Month # <span className="muted">(must be &lt; {effectiveTenure})</span>
            </label>
            <input
              id="closeAfterMonth"
              type="number"
              min="1"
              max={Math.max(1, effectiveTenure - 1)}
              value={inputs.closeAfterMonth}
              onChange={(e) => handleChange('closeAfterMonth', e.target.value)}
            />
          </div>
        </>
      )}
    </aside>
  );
}
