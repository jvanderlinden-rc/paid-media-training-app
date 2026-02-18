"use client";

const safeStorage = {
  getItem(key: string) {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  }
};

const moduleKey = (moduleId: string) => `module:${moduleId}:completed`;
const levelKey = (levelId: string) => `level:${levelId}:completed`;
const stepKey = (moduleId: string, step: string) => `module:${moduleId}:step:${step}`;
const userKey = "demo:userId";

function getOrCreateUserId() {
  const existing = safeStorage.getItem(userKey);
  if (existing) return existing;
  const id = `demo-${crypto.randomUUID()}`;
  safeStorage.setItem(userKey, id);
  return id;
}

export function getDemoUserId() {
  return getOrCreateUserId();
}

export function isModuleCompleted(moduleId: string) {
  return safeStorage.getItem(moduleKey(moduleId)) === "true";
}

export async function setModuleCompleted(moduleId: string, sectionId: string) {
  safeStorage.setItem(moduleKey(moduleId), "true");
  const userId = getOrCreateUserId();
  await fetch("/api/progress/complete-module", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, moduleId, sectionId })
  });
}

export function isLevelCompleted(levelId: string) {
  return safeStorage.getItem(levelKey(levelId)) === "true";
}

export async function setLevelCompleted(levelId: string) {
  safeStorage.setItem(levelKey(levelId), "true");
  const userId = getOrCreateUserId();
  await fetch("/api/progress/complete-level", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, levelId })
  });
}

export function isStepCompleted(moduleId: string, step: "lesson" | "practice") {
  return safeStorage.getItem(stepKey(moduleId, step)) === "true";
}

export function setStepCompleted(moduleId: string, step: "lesson" | "practice") {
  safeStorage.setItem(stepKey(moduleId, step), "true");
}

export function clearModuleSession(moduleId: string) {
  safeStorage.setItem(stepKey(moduleId, "lesson"), "false");
  safeStorage.setItem(stepKey(moduleId, "practice"), "false");
}

export async function fetchProgressState() {
  const userId = getOrCreateUserId();
  const response = await fetch(`/api/progress/state?userId=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    return { completedModules: new Set<string>(), completedLevels: new Set<string>() };
  }
  const data = await response.json();
  return {
    completedModules: new Set<string>(data.completedModules ?? []),
    completedLevels: new Set<string>(data.completedLevels ?? [])
  };
}
