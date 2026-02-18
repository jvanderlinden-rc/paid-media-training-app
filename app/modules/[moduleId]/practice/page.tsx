import Exercises from "@/components/Exercises";
import ModuleStepNav from "@/components/ModuleStepNav";
import ModulePracticeClient from "@/components/ModulePracticeClient";
import StepGate from "@/components/StepGate";
import { getModuleById, getSections } from "@/lib/data";
import ModuleBreadcrumbs from "@/components/ModuleBreadcrumbs";

export default async function ModulePracticePage({
  params
}: {
  params: { moduleId: string };
}) {
  const [module, levels] = await Promise.all([
    getModuleById(params.moduleId),
    getSections()
  ]);
  const level = levels.find((item) => item.id === module?.sectionId);

  if (!module) {
    return (
      <main>
        <h1>Module not found</h1>
      </main>
    );
  }

  return (
    <main>
      <ModuleBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: level?.level ?? "Level", href: `/levels/${module.sectionId}` },
          { label: module.title },
          { label: "Practice" }
        ]}
        moduleId={module.id}
      />
      <div className="section-title">
        <span className="pill">Practice</span>
        <h1>{module.title}</h1>
      </div>
      <p>Practice exercises for this module.</p>

      <div className="module-layout">
        <div className="stack">
          <StepGate
            moduleId={module.id}
            requiredStep="lesson"
            message="Complete the lesson first to unlock practice."
          >
            <div className="card">
              <Exercises title="Practice Exercises" items={module.practice} />
            </div>
            <ModulePracticeClient moduleId={module.id} />
          </StepGate>
        </div>

        <aside className="stack">
          <ModuleStepNav moduleId={module.id} active="practice" />
          <div className="card">
            <h3>Rules</h3>
            <p>Practice must be completed before the test unlocks.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
