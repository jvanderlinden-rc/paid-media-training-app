import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  return NextResponse.json({
    status: "received",
    note: "PDF parsing pipeline is stubbed in v1. Store file metadata and queue extraction here.",
    payload
  });
}
