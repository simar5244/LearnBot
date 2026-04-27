import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadDB } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || "";
  const db = await loadDB();
  const session = db.sessions.find((s) => s.id === sessionId);
  if (session === undefined) {
    return NextResponse.json({ user: null });
  }
  const user = db.users.find((u) => u.id === session.userId) || null;
  const profile = db.profiles.find((p) => p.userId === session.userId) || null;
  return NextResponse.json({ user, profile });
}
