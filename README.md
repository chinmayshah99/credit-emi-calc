# Credit Card EMI Total Cost Calculator

A React app for estimating the true cost of Indian credit card EMI offers — including GST on interest, processing fees, and hidden charges in No-Cost EMI plans.

## Features

- Regular and No-Cost EMI calculations
- Cost breakdown with GST and processing fees
- Amortization schedule
- Comparison against paying upfront or using a personal loan
- Optional early-closure / foreclosure modeling

## Tech stack

- React 19
- Vite

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
  components/   UI components
  lib/          EMI calculation engine and formatting helpers
```
