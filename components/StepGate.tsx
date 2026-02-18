"use client";

import { ReactNode } from "react";
import { isStepCompleted } from "@/lib/progressClient";

export default function StepGate({
  moduleId,
  requiredStep,
  children,
  message
}: {
  moduleId: string;
  requiredStep: "lesson" | "practice";
  message: string;
  children: ReactNode;
}) {
  const allowed = isStepCompleted(moduleId, requiredStep);
  if (!allowed) {
    return <div className="callout">{message}</div>;
  }
  return <>{children}</>;
}
