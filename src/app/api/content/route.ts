import { NextResponse } from "next/server";
import { loadDB } from "@/lib/db";

export async function GET() {
  const db = await loadDB();
  return NextResponse.json({ languages: db.content.languages });
}
