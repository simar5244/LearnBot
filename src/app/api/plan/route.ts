import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadDB } from "@/lib/db";
import { buildLanguageTrack } from "@/lib/curriculum";
import { buildAdaptivePlan } from "@/lib/personalization";

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
  return NextResponse.json({
    plan: buildAdaptivePlan(language, profile, progress),
    progress,
    profile,
  });
}
