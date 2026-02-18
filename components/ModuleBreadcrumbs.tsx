"use client";

import Link from "next/link";
import { useState } from "react";
import LeaveModuleModal from "@/components/LeaveModuleModal";
import type { Crumb } from "@/components/Breadcrumbs";

export default function ModuleBreadcrumbs({
  items,
  moduleId
}: {
  items: Crumb[];
  moduleId: string;
}) {
  const [open, setOpen] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);

  return (
    <>
      <nav className="breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          if (!item.href || isLast) {
            return (
              <span key={`${item.label}-${index}`} className="breadcrumb-item">
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={`${item.label}-${index}`}
              className="breadcrumb-item"
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                setTargetHref(item.href ?? null);
                setOpen(true);
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <LeaveModuleModal
        open={open}
        onClose={() => setOpen(false)}
        targetHref={targetHref}
        moduleId={moduleId}
      />
    </>
  );
}
