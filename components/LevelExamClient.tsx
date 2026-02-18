"use client";

import { useRouter } from "next/navigation";
import { getDemoUserId, isLevelCompleted, isModuleCompleted, setLevelCompleted } from "@/lib/progressClient";

export default function LevelExamClient({
  levelId,
  moduleIds
}: {
  levelId: string;
  moduleIds: string[];
}) {
  const router = useRouter();
  const alreadyComplete = isLevelCompleted(levelId);
  const unlocked = moduleIds.length > 0 && moduleIds.every((id) => isModuleCompleted(id));

  return (
    <div className="card">
      <h3>Exam Preview</h3>
      <p>This is a placeholder exam screen. We’ll connect real questions next.</p>
      {!unlocked && (
        <div className="callout">Complete all modules before taking the level exam.</div>
      )}
      <button
        className="button"
        onClick={async () => {
          await fetch("/api/attempts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: getDemoUserId(),
              sectionId: levelId,
              kind: "SECTION_EXAM",
              score: 100,
              maxScore: 100,
              passed: true,
              answers: []
            })
          });
          await setLevelCompleted(levelId);
          router.push("/");
        }}
        disabled={alreadyComplete || !unlocked}
      >
        {alreadyComplete ? "Level Completed" : "Mark Level Complete"}
      </button>
    </div>
  );
}
