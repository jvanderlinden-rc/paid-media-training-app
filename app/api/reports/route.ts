import { NextResponse } from "next/server";
import { getReports } from "@/lib/data";

export async function GET() {
  const rows = await getReports();
  return NextResponse.json({ rows });
}
