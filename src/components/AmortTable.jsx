import { formatINR } from '../lib/format';

export default function AmortTable({ schedule }) {
  if (!schedule || schedule.length === 0) return null;

  return (
    <section className="card">
      <h2>Amortization &amp; Tax Schedule</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Month #</th>
              <th>Base EMI</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>GST on Interest</th>
              <th>Total Monthly Outflow</th>
              <th>Remaining Balance</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td>{formatINR(row.baseEmi)}</td>
                <td>{formatINR(row.principal)}</td>
                <td>{formatINR(row.interest)}</td>
                <td>{formatINR(row.gstOnInterest)}</td>
                <td>{formatINR(row.totalOutflow)}</td>
                <td>{formatINR(row.remainingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
