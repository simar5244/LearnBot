import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadDB } from "@/lib/db";
import { buildLanguageTrack } from "@/lib/curriculum";

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
  const language = buildLanguageTrack(profile?.preferredLanguage || "python", profile);

  const sectionIndex = Math.min(progress?.currentSectionIndex || 0, Math.max(language.sections.length - 1, 0));
  const section = language?.sections[sectionIndex] || null;
  const maxVideoIndex = section ? section.videos.length - 1 : 0;
  const videoIndex = progress ? Math.min(progress.currentVideoIndex, Math.max(maxVideoIndex, 0)) : 0;
  const video = section?.videos[videoIndex] || null;

  return NextResponse.json({
    section,
    video,
    progress,
    language,
    canTakeExam: Boolean(language && progress && progress.currentSectionIndex >= language.sections.length),
  });
}
