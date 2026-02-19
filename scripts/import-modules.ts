import fs from "fs";
import path from "path";
import matter from "gray-matter";
import YAML from "yaml";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const CONTENT_DIR = path.join(process.cwd(), "content", "modules");
const MEDIA_BASE = "/media/";

type ParseResult = {
  moduleId: string;
  levelId: string;
  levelLabel: string;
  levelOrder: number;
  title: string;
  description: string;
  passingScore: number;
  status: "PUBLISHED" | "DRAFT";
  blocks: { type: string; data: any; order: number }[];
  exercises: { kind: string; prompt: string; data: any; order: number }[];
  questions: { kind: string; prompt: string; data: any; points: number; order: number }[];
  warnings: string[];
};

function readFiles() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(CONTENT_DIR, file));
}

const TOP_LEVEL_HEADINGS = ["Lesson", "Practice Exercises", "Module Test"];

function extractSection(source: string, heading: string) {
  const regex = new RegExp(`^\\s*(?:##\\s*)?${heading}\\s*$`, "im");
  const match = regex.exec(source);
  if (!match) return "";
  const start = match.index + match[0].length;
  const rest = source.slice(start);
  const nextRegex = new RegExp(
    `^\\s*(?:##\\s*)?(?:${TOP_LEVEL_HEADINGS.join("|")})\\s*$`,
    "im"
  );
  const next = rest.search(nextRegex);
  return next === -1 ? rest.trim() : rest.slice(0, next).trim();
}

function splitSubsections(source: string) {
  const sections: Record<string, string> = {};
  const regex = new RegExp(
    String.raw`^\s*(?:###\s*)?(Written Explanation|Visual \(Mermaid\)|Audio/Video)\s*$`,
    "gim"
  );
  const matches = Array.from(source.matchAll(regex));
  for (let i = 0; i < matches.length; i += 1) {
    const title = matches[i][1].trim();
    const start = (matches[i].index ?? 0) + matches[i][0].length;
    const end = i + 1 < matches.length ? (matches[i + 1].index ?? source.length) : source.length;
    sections[title] = source.slice(start, end).trim();
  }
  return sections;
}

function parseMermaid(source: string) {
  const match = source.match(/```mermaid\s*([\s\S]*?)```/i);
  if (match) return match[1].trim();
  return source.trim();
}

function parseYamlBlock(block: string) {
  try {
    return YAML.parse(block);
  } catch (error) {
    return null;
  }
}

function parseQuestions(source: string) {
  const questionBlocks: {
    kind: string;
    data: any;
  }[] = [];
  const regex = /^\s*(?:###\s*)?(MCQ|Short Text|Drag & Drop)\s*$/gim;
  const matches = Array.from(source.matchAll(regex));
  for (let i = 0; i < matches.length; i += 1) {
    const kind = matches[i][1].trim();
    const start = (matches[i].index ?? 0) + matches[i][0].length;
    const end = i + 1 < matches.length ? (matches[i + 1].index ?? source.length) : source.length;
    const block = source.slice(start, end).trim();
    if (!block) continue;
    const parsed = parseYamlBlock(block);
    if (!parsed) continue;
    questionBlocks.push({ kind, data: parsed });
  }
  return questionBlocks;
}

function normalizeQuestions(questions: ReturnType<typeof parseQuestions>, target: "exercise" | "question") {
  const result: any[] = [];
  let order = 0;
  for (const entry of questions) {
    const kindLabel = entry.kind.toLowerCase();
    const data = entry.data ?? {};
    const kind =
      kindLabel.includes("mcq") ? "mcq" : kindLabel.includes("short") ? "short_text" : "drag_drop";

    const base = {
      kind,
      prompt: data.prompt ?? "",
      order
    } as any;

    if (!base.prompt) continue;

    if (kind === "mcq") {
      base.data = {
        options: data.options ?? [],
        multi: data.multi ?? false,
        correct: data.correct ?? []
      };
    }

    if (kind === "short_text") {
      base.data = {
        placeholder: data.placeholder ?? "Type your answer...",
        acceptable: data.acceptable_keywords ?? data.acceptable ?? []
      };
    }

    if (kind === "drag_drop") {
      base.data = {
        buckets: data.buckets ?? [],
        items: data.items ?? [],
        correctBuckets: data.correct_buckets ?? data.correctBuckets ?? {}
      };
    }

    if (target === "question") {
      base.points = data.points ?? 10;
    }

    result.push(base);
    order += 1;
  }
  return result;
}

function parseModule(raw: string, fileName: string): ParseResult | null {
  const { data, content } = matter(raw);
  const warnings: string[] = [];

  const moduleId = data.module_id as string | undefined;
  const levelLabel = data.level as string | undefined;
  const title = data.title as string | undefined;
  const description = data.description as string | undefined;
  const passingScore = Number(data.passing_score ?? 80);

  if (!moduleId || !levelLabel || !title || !description) {
    warnings.push(`Missing required front-matter fields in ${fileName}`);
    return null;
  }

  const levelMatch = levelLabel.match(/(\d+)/);
  const levelOrder = levelMatch ? Number(levelMatch[1]) : 0;
  const levelId = `level-${levelOrder || levelLabel.toLowerCase().replace(/\s+/g, "-")}`;

  const lesson = extractSection(content, "Lesson");
  const lessonSections = splitSubsections(lesson);

  const written = lessonSections["Written Explanation"] ?? "";
  const visual = lessonSections["Visual (Mermaid)"] ?? "";
  const audio = lessonSections["Audio/Video"] ?? "";

  const blocks: ParseResult["blocks"] = [];
  let blockOrder = 0;

  if (written.trim()) {
    blocks.push({ type: "text", data: { text: written.trim() }, order: blockOrder++ });
  } else {
    warnings.push(`Missing written explanation in ${fileName}`);
  }

  if (visual.trim()) {
    blocks.push({ type: "diagram", data: { mermaid: parseMermaid(visual) }, order: blockOrder++ });
  } else {
    warnings.push(`Missing visual in ${fileName}`);
  }

  if (audio.trim()) {
    const audioData = parseYamlBlock(audio) ?? {};
    if (audioData.filename) {
      blocks.push({
        type: "media",
        data: {
          kind: audioData.type ?? "video",
          url: `${MEDIA_BASE}${String(audioData.filename).replace(/^\/+/, "")}`,
          caption: audioData.script ?? ""
        },
        order: blockOrder++
      });
    } else {
      warnings.push(`Missing audio/video filename in ${fileName}`);
    }
  } else {
    warnings.push(`Missing audio/video section in ${fileName}`);
  }

  const practice = extractSection(content, "Practice Exercises");
  const practiceQuestions = normalizeQuestions(parseQuestions(practice), "exercise");
  if (practiceQuestions.length === 0) {
    warnings.push(`Missing practice exercises in ${fileName}`);
  }

  const test = extractSection(content, "Module Test");
  const testQuestions = normalizeQuestions(parseQuestions(test), "question");
  if (testQuestions.length === 0) {
    warnings.push(`Missing module test questions in ${fileName}`);
  }

  const isComplete = warnings.length === 0;

  return {
    moduleId,
    levelId,
    levelLabel,
    levelOrder,
    title,
    description,
    passingScore,
    status: isComplete ? "PUBLISHED" : "DRAFT",
    blocks,
    exercises: practiceQuestions,
    questions: testQuestions,
    warnings
  };
}

async function upsertModule(parsed: ParseResult) {
  const levelTitle = parsed.levelLabel;
  await prisma.section.upsert({
    where: { id: parsed.levelId },
    update: {
      level: parsed.levelLabel,
      title: levelTitle,
      description: `Imported ${parsed.levelLabel} modules`,
      order: parsed.levelOrder
    },
    create: {
      id: parsed.levelId,
      level: parsed.levelLabel,
      title: levelTitle,
      description: `Imported ${parsed.levelLabel} modules`,
      order: parsed.levelOrder
    }
  });

  const moduleOrderMatch = parsed.moduleId.match(/(\d+)/);
  const moduleOrder = moduleOrderMatch ? Number(moduleOrderMatch[1]) : 0;

  await prisma.module.upsert({
    where: { id: parsed.moduleId },
    update: {
      sectionId: parsed.levelId,
      title: parsed.title,
      description: parsed.description,
      order: moduleOrder,
      passingScore: parsed.passingScore,
      status: parsed.status
    },
    create: {
      id: parsed.moduleId,
      sectionId: parsed.levelId,
      title: parsed.title,
      description: parsed.description,
      order: moduleOrder,
      passingScore: parsed.passingScore,
      status: parsed.status
    }
  });

  await prisma.contentBlock.deleteMany({ where: { moduleId: parsed.moduleId } });
  await prisma.exercise.deleteMany({ where: { moduleId: parsed.moduleId } });
  await prisma.question.deleteMany({ where: { moduleId: parsed.moduleId } });

  for (const block of parsed.blocks) {
    await prisma.contentBlock.create({
      data: {
        moduleId: parsed.moduleId,
        type: block.type,
        data: block.data,
        order: block.order
      }
    });
  }

  for (const exercise of parsed.exercises) {
    await prisma.exercise.create({
      data: {
        moduleId: parsed.moduleId,
        kind: exercise.kind,
        prompt: exercise.prompt,
        data: exercise.data,
        order: exercise.order
      }
    });
  }

  for (const question of parsed.questions) {
    await prisma.question.create({
      data: {
        moduleId: parsed.moduleId,
        kind: question.kind,
        prompt: question.prompt,
        data: question.data,
        points: question.points
      }
    });
  }
}

async function run() {
  const files = readFiles();
  const report: { file: string; status: string; warnings: string[] }[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const parsed = parseModule(raw, path.basename(file));
    if (!parsed) {
      report.push({ file: path.basename(file), status: "SKIPPED", warnings: [] });
      continue;
    }

    await upsertModule(parsed);
    report.push({
      file: path.basename(file),
      status: parsed.status,
      warnings: parsed.warnings
    });
  }

  console.log("\nImport summary:");
  for (const entry of report) {
    console.log(`- ${entry.file}: ${entry.status}`);
    entry.warnings.forEach((warning) => console.log(`  - ${warning}`));
  }

  await prisma.$disconnect();
}

run().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
