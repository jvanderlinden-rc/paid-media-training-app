import Link from "next/link";
import { getSections } from "@/lib/data";

export default async function HomePage() {
  const sections = await getSections();

  return (
    <main>
      <div className="section-title">
        <span className="pill">Overview</span>
        <h1>Paid Media Learning Path</h1>
      </div>
      <p>
        Progress through levels of increasing complexity. Each module teaches a concept,
        provides practice, and ends with a graded test. Complete each level to unlock the final exam.
      </p>

      <div className="grid grid-2" style={{ marginTop: 24 }}>
        {sections.map((section) => (
          <div key={section.id} className="card">
            <div className="pill">{section.level}</div>
            <h3>{section.title}</h3>
            <p>{section.description}</p>
            <Link className="button" href={`/sections/${section.id}`}>
              View Modules
            </Link>
          </div>
        ))}
      </div>

      <div className="footer">Questions? Reach out to the paid media lead.</div>
    </main>
  );
}
