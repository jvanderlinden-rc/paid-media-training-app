import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId || !process.env.DATABASE_URL) {
    return NextResponse.json({ completedModules: [], completedLevels: [] });
  }

  const progress = await prisma.progress.findMany({
    where: { userId, status: "COMPLETED" }
  });

  const completedModules = progress
    .filter((row) => row.moduleId)
    .map((row) => row.moduleId as string);
  const completedLevels = progress
    .filter((row) => row.sectionId)
    .map((row) => row.sectionId as string);

  return NextResponse.json({ completedModules, completedLevels });
}
