import { getReports } from "@/lib/data";

export default async function ReportsPage() {
  const rows = await getReports();

  return (
    <main>
      <div className="section-title">
        <span className="pill">Reporting</span>
        <h1>Performance Summary</h1>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Area</th>
            <th>Completion Rate</th>
            <th>Average Score</th>
            <th>Pass</th>
            <th>Fail</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{Math.round(row.completionRate * 100)}%</td>
              <td>{Math.round(row.averageScore)}%</td>
              <td>{row.passCount}</td>
              <td>{row.failCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">Export CSV and user drilldowns are available in the API.</div>
    </main>
  );
}
