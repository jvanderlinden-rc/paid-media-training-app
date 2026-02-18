import ContentBlocks from "@/components/ContentBlocks";
import ModuleStepNav from "@/components/ModuleStepNav";
import ModuleLessonClient from "@/components/ModuleLessonClient";
import { getModuleById, getSections } from "@/lib/data";
import ModuleBreadcrumbs from "@/components/ModuleBreadcrumbs";

export default async function ModuleLessonPage({
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
          { label: "Lesson" }
        ]}
        moduleId={module.id}
      />
      <div className="section-title">
        <span className="pill">Lesson</span>
        <h1>{module.title}</h1>
      </div>
      <p>{module.description}</p>

      <div className="module-layout">
        <div className="stack">
          <div className="card">
            <h3>Concept</h3>
            <ContentBlocks blocks={module.content} />
          </div>

          <ModuleLessonClient moduleId={module.id} />
        </div>

        <aside className="stack">
          <ModuleStepNav moduleId={module.id} active="lesson" />
          <div className="card">
            <h3>Rules</h3>
            <p>Finish the lesson before practice unlocks.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
