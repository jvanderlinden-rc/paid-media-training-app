"use client";

import { ReactNode, useEffect } from "react";
import { clearModuleSession } from "@/lib/progressClient";

export default function ModuleSessionGuard({
  moduleId,
  children
}: {
  moduleId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    return () => {
      clearModuleSession(moduleId);
    };
  }, [moduleId]);

  return <>{children}</>;
}
