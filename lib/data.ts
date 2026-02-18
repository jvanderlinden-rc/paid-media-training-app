import { prisma } from "./prisma";
import { modules as mockModules, reportRows, sections as mockSections } from "./mockData";
import { Module, Section, ReportRow } from "./types";

const dbAvailable = Boolean(process.env.DATABASE_URL);

export async function getSections(): Promise<Section[]> {
  if (!dbAvailable) return mockSections;
  try {
    const rows = await prisma.section.findMany({
      orderBy: { order: "asc" }
    });
    return rows.map((row) => ({
      id: row.id,
      level: row.level,
      title: row.title,
      description: row.description,
      order: row.order,
      finalExam: []
    }));
  } catch {
    return mockSections;
  }
}

export async function getModulesBySection(sectionId: string): Promise<Module[]> {
  if (!dbAvailable) return mockModules.filter((m) => m.sectionId === sectionId);
  try {
    const rows = await prisma.module.findMany({
      where: { sectionId },
      orderBy: { order: "asc" },
      include: { blocks: true, exercises: true, questions: true }
    });
    return rows.map((row) => ({
      id: row.id,
      sectionId: row.sectionId,
      title: row.title,
      description: row.description,
      order: row.order,
      passingScore: row.passingScore,
      content: row.blocks.map((block) => ({
        id: block.id,
        type: block.type as Module["content"][number]["type"],
        data: block.data as Module["content"][number]["data"]
      })),
      practice: row.exercises.map((exercise) => ({
        id: exercise.id,
        kind: exercise.kind as Module["practice"][number]["kind"],
        prompt: exercise.prompt,
        ...(exercise.data as Record<string, unknown>)
      })) as Module["practice"],
      test: row.questions.map((question) => ({
        id: question.id,
        kind: question.kind as Module["test"][number]["kind"],
        prompt: question.prompt,
        ...(question.data as Record<string, unknown>),
        points: question.points
      })) as Module["test"]
    }));
  } catch {
    return mockModules.filter((m) => m.sectionId === sectionId);
  }
}

export async function getModuleById(moduleId: string): Promise<Module | null> {
  if (!dbAvailable) return mockModules.find((m) => m.id === moduleId) ?? null;
  try {
    const row = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { blocks: true, exercises: true, questions: true }
    });
    if (!row) return null;
    return {
      id: row.id,
      sectionId: row.sectionId,
      title: row.title,
      description: row.description,
      order: row.order,
      passingScore: row.passingScore,
      content: row.blocks.map((block) => ({
        id: block.id,
        type: block.type as Module["content"][number]["type"],
        data: block.data as Module["content"][number]["data"]
      })),
      practice: row.exercises.map((exercise) => ({
        id: exercise.id,
        kind: exercise.kind as Module["practice"][number]["kind"],
        prompt: exercise.prompt,
        ...(exercise.data as Record<string, unknown>)
      })) as Module["practice"],
      test: row.questions.map((question) => ({
        id: question.id,
        kind: question.kind as Module["test"][number]["kind"],
        prompt: question.prompt,
        ...(question.data as Record<string, unknown>),
        points: question.points
      })) as Module["test"]
    };
  } catch {
    return mockModules.find((m) => m.id === moduleId) ?? null;
  }
}

export async function getReports(): Promise<ReportRow[]> {
  if (!dbAvailable) return reportRows;
  try {
    const attempts = await prisma.attempt.findMany({
      include: { module: true, section: true }
    });

    const grouped = new Map<string, { scores: number[]; passes: number; fails: number }>();

    attempts.forEach((attempt) => {
      const label = attempt.module?.title ?? attempt.section?.title ?? "Unknown";
      const entry = grouped.get(label) ?? { scores: [], passes: 0, fails: 0 };
      entry.scores.push(attempt.score);
      if (attempt.passed) entry.passes += 1;
      else entry.fails += 1;
      grouped.set(label, entry);
    });

    return Array.from(grouped.entries()).map(([label, data]) => ({
      label,
      completionRate: data.passes / Math.max(1, data.passes + data.fails),
      averageScore: data.scores.reduce((sum, s) => sum + s, 0) / Math.max(1, data.scores.length),
      passCount: data.passes,
      failCount: data.fails
    }));
  } catch {
    return reportRows;
  }
}
