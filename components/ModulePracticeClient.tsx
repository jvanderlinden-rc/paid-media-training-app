"use client";

import { useRouter } from "next/navigation";
import { isStepCompleted, setStepCompleted } from "@/lib/progressClient";

export default function ModulePracticeClient({ moduleId }: { moduleId: string }) {
  const router = useRouter();
  const lessonComplete = isStepCompleted(moduleId, "lesson");

  if (!lessonComplete) {
    return (
      <div className="callout">
        Complete the lesson first to unlock practice.
      </div>
    );
  }

  return (
    <button
      className="button"
      onClick={() => {
        setStepCompleted(moduleId, "practice");
        router.push(`/modules/${moduleId}/test`);
      }}
    >
      Continue to Test
    </button>
  );
}
