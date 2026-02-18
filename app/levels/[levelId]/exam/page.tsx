import { getModulesBySection, getSections } from "@/lib/data";
import LevelExamClient from "@/components/LevelExamClient";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function LevelExamPage({ params }: { params: { levelId: string } }) {
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
          { label: level.level, href: `/levels/${level.id}` },
          { label: "Exam" }
        ]}
      />
      <div className="section-title">
        <span className="pill">{level.level}</span>
        <h1>Level Exam</h1>
      </div>
      <p>Answer the final questions to complete this level.</p>

      <LevelExamClient levelId={level.id} moduleIds={modules.map((module) => module.id)} />
    </main>
  );
}
