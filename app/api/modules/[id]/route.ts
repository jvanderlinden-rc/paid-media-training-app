import { NextResponse } from "next/server";
import { getModuleById } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const module = await getModuleById(params.id);
  if (!module) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ module });
}
