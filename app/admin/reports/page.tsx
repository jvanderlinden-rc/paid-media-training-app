import { getAttemptHistory, getReports } from "@/lib/data";

export default async function ReportsPage() {
  const [rows, attempts] = await Promise.all([getReports(), getAttemptHistory()]);

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

      <div className="section-title" style={{ marginTop: 32 }}>
        <span className="pill">Attempts</span>
        <h2>Recent Test History</h2>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Module/Level</th>
            <th>Type</th>
            <th>Score</th>
            <th>Passed</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((attempt) => (
            <tr key={attempt.id}>
              <td>{attempt.userLabel}</td>
              <td>{attempt.targetLabel}</td>
              <td>{attempt.kind}</td>
              <td>
                {attempt.score}/{attempt.maxScore}
              </td>
              <td>{attempt.passed ? "Yes" : "No"}</td>
              <td>{new Date(attempt.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">Export CSV and user drilldowns are available in the API.</div>
    </main>
  );
}
