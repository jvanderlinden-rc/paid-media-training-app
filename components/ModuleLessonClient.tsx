"use client";

import { useRouter } from "next/navigation";
import { setStepCompleted } from "@/lib/progressClient";

export default function ModuleLessonClient({ moduleId }: { moduleId: string }) {
  const router = useRouter();
  return (
    <button
      className="button"
      onClick={() => {
        setStepCompleted(moduleId, "lesson");
        router.push(`/modules/${moduleId}/practice`);
      }}
    >
      Continue to Practice
    </button>
  );
}
