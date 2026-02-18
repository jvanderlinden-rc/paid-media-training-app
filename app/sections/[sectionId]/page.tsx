import Link from "next/link";
import { getModulesBySection, getSections } from "@/lib/data";

export default async function SectionPage({ params }: { params: { sectionId: string } }) {
  const [sections, modules] = await Promise.all([
    getSections(),
    getModulesBySection(params.sectionId)
  ]);
  const section = sections.find((item) => item.id === params.sectionId);

  if (!section) {
    return (
      <main>
        <h1>Section not found</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="section-title">
        <span className="pill">{section.level}</span>
        <h1>{section.title}</h1>
      </div>
      <p>{section.description}</p>

      <div className="grid grid-2" style={{ marginTop: 24 }}>
        {modules.map((module) => (
          <div key={module.id} className="card">
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            <div className="notice">Passing score: {module.passingScore}%</div>
            <Link className="button" href={`/modules/${module.id}`}>
              Start Module
            </Link>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 32 }}>
        <h3>Section Exam</h3>
        <p>Complete all modules to unlock the final exam for this level.</p>
        <button className="button secondary" disabled>
          Locked until completion
        </button>
      </div>
    </main>
  );
}
