import { getModulesBySection, getSections } from "@/lib/data";
import ModuleGrid from "@/components/ModuleGrid";
import LevelExamAccess from "@/components/LevelExamAccess";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function LevelPage({ params }: { params: { levelId: string } }) {
  const [levels, modules] = await Promise.all([
    getSections(),
    getModulesBySection(params.levelId)
  ]);
  const level = levels.find((item) => item.id === params.levelId);

  if (!level) {
    return (
      <main>
        <h1>Level not found</h1>
      </main>
    );
  }

  return (
    <main>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: level.level }
        ]}
      />
      <div className="section-title">
        <span className="pill">{level.level}</span>
        <h1>{level.title}</h1>
      </div>
      <p>{level.description}</p>

      <ModuleGrid modules={modules} />

      <div className="card" style={{ marginTop: 32 }}>
        <h3>Level Exam</h3>
        <p>Complete all modules to unlock the level exam.</p>
        <LevelExamAccess
          levelId={level.id}
          moduleIds={modules.map((module) => module.id)}
        />
      </div>
    </main>
  );
}
