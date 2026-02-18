import { NextResponse } from "next/server";
import { getSections } from "@/lib/data";

export async function GET() {
  const sections = await getSections();
  return NextResponse.json({ sections });
}
