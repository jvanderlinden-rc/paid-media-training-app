"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Section } from "@/lib/types";
import { fetchProgressState } from "@/lib/progressClient";

export default function LevelGrid({ levels }: { levels: Section[] }) {
  const [completedLevels, setCompletedLevels] = useState<Set<string>>(new Set());
  useEffect(() => {
    fetchProgressState().then((state) => setCompletedLevels(state.completedLevels));
  }, []);
  const sorted = useMemo(
    () => [...levels].sort((a, b) => a.order - b.order),
    [levels]
  );

  return (
    <div className="grid grid-2" style={{ marginTop: 24 }}>
      {sorted.map((level, index) => {
        const unlocked = index === 0 || completedLevels.has(sorted[index - 1].id);
        return (
          <div key={level.id} className="card">
            <div className="pill">{level.level}</div>
            <h3>{level.title}</h3>
            <p>{level.description}</p>
            {unlocked ? (
              <Link className="button" href={`/levels/${level.id}`}>
                View Modules
              </Link>
            ) : (
              <button className="button secondary" disabled>
                Locked until prior level completed
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
