import Link from "next/link";

export default function AdminPage() {
  return (
    <main>
      <div className="section-title">
        <span className="pill">Admin</span>
        <h1>Content & Reporting</h1>
      </div>
      <div className="grid grid-2">
        <div className="card">
          <h3>Content Library</h3>
          <p>Upload internal docs to generate draft modules and publish lessons.</p>
          <button className="button">Upload Docs</button>
        </div>
        <div className="card">
          <h3>Reporting</h3>
          <p>Review completion and performance by level, module, and user.</p>
          <Link className="button" href="/admin/reports">
            View Reports
          </Link>
        </div>
      </div>
    </main>
  );
}
