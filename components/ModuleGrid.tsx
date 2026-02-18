"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Module } from "@/lib/types";
import { fetchProgressState } from "@/lib/progressClient";

export default function ModuleGrid({ modules }: { modules: Module[] }) {
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  useEffect(() => {
    fetchProgressState().then((state) => setCompletedModules(state.completedModules));
  }, []);
  const sorted = useMemo(
    () => [...modules].sort((a, b) => a.order - b.order),
    [modules]
  );

  return (
    <div className="grid grid-2" style={{ marginTop: 24 }}>
      {sorted.map((module, index) => {
        const unlocked = index === 0 || completedModules.has(sorted[index - 1].id);
        return (
          <div key={module.id} className="card">
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            <div className="notice">Passing score: {module.passingScore}%</div>
            {unlocked ? (
              <Link className="button" href={`/modules/${module.id}/lesson`}>
                Start Module
              </Link>
            ) : (
              <button className="button secondary" disabled>
                Locked until prior module completed
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
