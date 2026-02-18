import { getSections } from "@/lib/data";
import LevelGrid from "@/components/LevelGrid";

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
      <LevelGrid levels={sections} />

      <div className="footer">Questions? Reach out to the paid media lead.</div>
    </main>
  );
}
