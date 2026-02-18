import { NextResponse } from "next/server";
import { getModulesBySection } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sectionId = searchParams.get("sectionId");
  if (!sectionId) {
    return NextResponse.json({ error: "sectionId required" }, { status: 400 });
  }
  const modules = await getModulesBySection(sectionId);
  return NextResponse.json({ modules });
}
