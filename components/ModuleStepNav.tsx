"use client";

import { isStepCompleted } from "@/lib/progressClient";

const steps = [
  { key: "lesson", label: "Lesson" },
  { key: "practice", label: "Practice" },
  { key: "test", label: "Test" }
] as const;

export default function ModuleStepNav({
  moduleId,
  active
}: {
  moduleId: string;
  active: "lesson" | "practice" | "test";
}) {
  const lessonDone = isStepCompleted(moduleId, "lesson");
  const practiceDone = isStepCompleted(moduleId, "practice");
  return (
    <div className="progress">
      <strong>Module Steps</strong>
      {steps.map((step) => {
        let status = "Pending";
        if (step.key === "lesson") {
          status = lessonDone ? "Completed" : "Pending";
        }
        if (step.key === "practice") {
          status = practiceDone ? "Completed" : lessonDone ? "Pending" : "Locked";
        }
        if (step.key === "test") {
          status = practiceDone ? "Pending" : "Locked";
        }
        return (
          <div key={step.key}>
            {step.key === active ? (
              <span>{step.label}</span>
            ) : (
              <span className="notice">{status}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
