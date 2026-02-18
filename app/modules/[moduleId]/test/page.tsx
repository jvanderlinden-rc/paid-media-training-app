import ModuleStepNav from "@/components/ModuleStepNav";
import ModuleTestClient from "@/components/ModuleTestClient";
import StepGate from "@/components/StepGate";
import { getModuleById, getSections } from "@/lib/data";
import ModuleBreadcrumbs from "@/components/ModuleBreadcrumbs";

export default async function ModuleTestPage({
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
          { label: "Test" }
        ]}
        moduleId={module.id}
      />
      <div className="section-title">
        <span className="pill">Test</span>
        <h1>{module.title}</h1>
      </div>
      <p>Submit the test to complete the module.</p>

      <div className="module-layout">
        <div className="stack">
          <StepGate
            moduleId={module.id}
            requiredStep="practice"
            message="Complete practice first to unlock the test."
          >
            <div className="card">
              <ModuleTestClient
                moduleId={module.id}
                levelId={module.sectionId}
                questions={module.test}
                passingScore={module.passingScore}
              />
            </div>
          </StepGate>
        </div>

        <aside className="stack">
          <ModuleStepNav moduleId={module.id} active="test" />
          <div className="card">
            <h3>Rules</h3>
            <p>You must pass the test to complete this module.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
