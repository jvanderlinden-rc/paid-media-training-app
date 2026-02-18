"use client";

import { useEffect } from "react";
import { clearModuleSession } from "@/lib/progressClient";

export default function LeaveModuleModal({
  open,
  onClose,
  targetHref,
  moduleId
}: {
  open: boolean;
  onClose: () => void;
  targetHref: string | null;
  moduleId: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Leave module?</h3>
        <p>You are leaving this module — progress will reset.</p>
        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>
            Stay
          </button>
          <a
            className="button"
            href={targetHref ?? "#"}
            onClick={() => {
              clearModuleSession(moduleId);
            }}
          >
            Leave module
          </a>
        </div>
      </div>
    </div>
  );
}
