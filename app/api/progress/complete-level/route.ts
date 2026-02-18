import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const payload = await request.json();
  const { userId, levelId } = payload;

  if (!userId || !levelId) {
    return NextResponse.json({ error: "userId and levelId required" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ status: "ok" });
  }

  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: `${userId}@local` }
  });

  await prisma.progress.upsert({
    where: { userId_sectionId: { userId, sectionId: levelId } },
    update: { status: "COMPLETED" },
    create: {
      userId,
      sectionId: levelId,
      status: "COMPLETED"
    }
  });

  return NextResponse.json({ status: "ok" });
}
