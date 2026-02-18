import type { ReactNode } from "react";
import ModuleSessionGuard from "@/components/ModuleSessionGuard";

export default function ModuleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { moduleId: string };
}) {
  return <ModuleSessionGuard moduleId={params.moduleId}>{children}</ModuleSessionGuard>;
}
