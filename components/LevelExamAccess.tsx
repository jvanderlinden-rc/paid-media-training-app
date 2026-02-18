"use client";

import Link from "next/link";
import { fetchProgressState } from "@/lib/progressClient";
import { useEffect, useState } from "react";

export default function LevelExamAccess({
  levelId,
  moduleIds
}: {
  levelId: string;
  moduleIds: string[];
}) {
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  useEffect(() => {
    fetchProgressState().then((state) => setCompletedModules(state.completedModules));
  }, []);
  const unlocked = moduleIds.length > 0 && moduleIds.every((id) => completedModules.has(id));

  if (!unlocked) {
    return (
      <button className="button secondary" disabled>
        Locked until all modules are completed
      </button>
    );
  }

  return (
    <Link className="button" href={`/levels/${levelId}/exam`}>
      Start Level Exam
    </Link>
  );
}
