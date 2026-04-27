import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadDB } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || "";
  const db = await loadDB();
  const session = db.sessions.find((s) => s.id === sessionId);
  if (session === undefined) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = db.progress.find((p) => p.userId === session.userId);
  const profile = db.profiles.find((p) => p.userId === session.userId);
  const language = db.content.languages.find((l) => l.id === (profile?.preferredLanguage || "python"));

  const section = language?.sections[progress?.currentSectionIndex || 0] || null;
  const video = section?.videos[progress?.currentVideoIndex || 0] || null;

  return NextResponse.json({
    plan: language?.sections || [],
    section,
    video,
  });
}
