import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const payload = await request.json();
  const {
    userId,
    moduleId,
    sectionId,
    kind,
    score,
    maxScore,
    passed,
    answers
  } = payload;

  if (!userId || !kind) {
    return NextResponse.json({ error: "userId and kind are required" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ status: "ok", attemptId: "mock-attempt" });
  }

  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: `${userId}@local` }
  });

  const attempt = await prisma.attempt.create({
    data: {
      userId,
      moduleId,
      sectionId,
      kind,
      score,
      maxScore,
      passed,
      answers: {
        create: (answers ?? []).map((answer: any) => ({
          questionId: answer.questionId,
          response: answer.response,
          correct: answer.correct,
          score: answer.score
        }))
      }
    }
  });

  return NextResponse.json({ status: "ok", attemptId: attempt.id });
}
