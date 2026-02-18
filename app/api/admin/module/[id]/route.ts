import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const payload = await request.json();

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ status: "ok", moduleId: params.id, payload });
  }

  const module = await prisma.module.update({
    where: { id: params.id },
    data: {
      title: payload.title,
      description: payload.description,
      passingScore: payload.passingScore
    }
  });

  return NextResponse.json({ status: "ok", module });
}
