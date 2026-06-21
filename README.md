# Credit Card EMI Total Cost Calculator

A React app for estimating the true cost of Indian credit card EMI offers — including GST on interest, processing fees, stacked checkout discounts, and hidden charges in No-Cost EMI plans.

## What's implemented

### EMI modes

- **Regular EMI** — reducing-balance EMI on the EMI base price (after cart/exchange discount)
- **Low-Cost EMI** — EMI at a subsidized effective rate shown at checkout (e.g. 9% p.a.)
- **No-Cost EMI** — reverse-engineers the merchant discount and net loan principal so monthly payments match the EMI base price

### Inputs

- Purchase price / item cost (MRP)
- Instant cart / exchange discount (reduces amount financed before EMI)
- Tenure: 3, 6, 9, 12, 18, 24 months, or custom (1–60)
- Stated interest rate (% p.a.) for regular and no-cost modes
- Effective interest rate (% p.a.) for low-cost mode
- Processing / conversion fee (flat ₹ or % of principal)
- GST rate (default 18%)
- Direct bank discount / cashback (reduces EMI total)
- Cash / upfront discount (extra savings when paying upfront, not on EMI)
- Optional early closure: foreclosure fee (%) and close-after month

### Results

- **Summary bar** — total cost, true APR, extra cost over upfront payment
- **Cost breakdown** — MRP, cart discount, EMI base price, net loan principal, interest, GST on interest, processing fee + GST, discounts, absolute total, extra cost %, true APR
- **Upfront vs EMI comparison** — side-by-side outflow with cart discount context and a recommendation (pay upfront, EMI, or tie)
- **Amortization & tax schedule** — month-by-month principal, interest, GST, outflow, and remaining balance
- **Early closure analysis** — Path A (full term) vs Path B (foreclose early), with savings estimate when applicable

### Calculation engine (`src/lib/emiEngine.js`)

- Standard EMI formula with zero-rate handling
- Cart discount applied before principal / no-cost solving
- Binary search for No-Cost EMI principal
- Low-cost mode uses effective rate on EMI base price
- NPV-based true APR from cash flows (upfront charges + monthly outflows)
- Foreclosure modeling with penalty and GST on penalty

## Tech stack

- React 19
- Vite 8

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
  App.jsx                 Main layout and state
  components/
    InputPanel.jsx        All user inputs
    CostBreakdown.jsx     Line-item cost summary
    ComparisonMatrix.jsx  Upfront vs EMI comparison
    AmortTable.jsx        Month-by-month schedule
    ForeclosureCallout.jsx Early closure analysis
    Footer.jsx            Disclaimer
  lib/
    emiEngine.js          EMI, GST, APR, and foreclosure logic
    format.js             INR formatting helpers
```

## Disclaimer

Calculations follow standard Indian banking conventions (reducing balance, 18% GST under SAC 9971). Issuer-specific terms may differ — verify with your bank's MITC before deciding.
