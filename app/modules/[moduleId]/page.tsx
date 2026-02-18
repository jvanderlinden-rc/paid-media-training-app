import ContentBlocks from "@/components/ContentBlocks";
import Exercises from "@/components/Exercises";
import { getModuleById } from "@/lib/data";

export default async function ModulePage({ params }: { params: { moduleId: string } }) {
  const module = await getModuleById(params.moduleId);

  if (!module) {
    return (
      <main>
        <h1>Module not found</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="section-title">
        <span className="pill">Module</span>
        <h1>{module.title}</h1>
      </div>
      <p>{module.description}</p>

      <div className="module-layout">
        <div className="stack">
          <div className="card">
            <h3>Concept</h3>
            <ContentBlocks blocks={module.content} />
          </div>

          <div className="card">
            <Exercises title="Practice Exercises" items={module.practice} />
          </div>

          <div className="card">
            <Exercises title="Module Test" items={module.test} />
            <button className="button" style={{ marginTop: 16 }}>
              Submit Module Test
            </button>
          </div>
        </div>

        <aside className="stack">
          <div className="progress">
            <strong>Your Progress</strong>
            <div>Lessons: In progress</div>
            <div>Practice: Started</div>
            <div>Test: Not submitted</div>
            <div className="notice">Passing score: {module.passingScore}%</div>
            <button className="button secondary">Save for later</button>
          </div>

          <div className="card">
            <h3>Next Steps</h3>
            <p>Complete the module test to unlock the next module.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
