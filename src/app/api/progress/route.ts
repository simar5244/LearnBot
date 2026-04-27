import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadDB, saveDB } from "@/lib/db";
import { buildLanguageTrack } from "@/lib/curriculum";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || "";
  const db = await loadDB();
  const session = db.sessions.find((s) => s.id === sessionId);
  if (session === undefined) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = db.progress.find((p) => p.userId === session.userId) || null;
  const profile = db.profiles.find((p) => p.userId === session.userId) || null;
  const language = buildLanguageTrack(profile?.preferredLanguage || "python", profile);
  const currentSection = progress ? language.sections[Math.min(progress.currentSectionIndex, Math.max(language.sections.length - 1, 0))] || null : null;
  const nextSection = progress ? language.sections[Math.min((progress.currentSectionIndex || 0) + 1, Math.max(language.sections.length - 1, 0))] || null : null;

  return NextResponse.json({
    progress,
    profile,
    plan: language.sections,
    currentSection,
    nextSection,
    exam: language.exam,
  });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || "";
  const db = await loadDB();
  const session = db.sessions.find((s) => s.id === sessionId);
  if (session === undefined) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const weakSelfReport = String(body.weakSelfReport || "");
  const progress = db.progress.find((p) => p.userId === session.userId);
  if (progress) {
    progress.weakSelfReport = weakSelfReport;
    await saveDB(db);
  }
  return NextResponse.json({ ok: true });
}
