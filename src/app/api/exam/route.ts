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

  const progress = db.progress.find((p) => p.userId === session.userId);
  const profile = db.profiles.find((p) => p.userId === session.userId);
  const language = buildLanguageTrack(profile?.preferredLanguage || "python", profile);

  return NextResponse.json({ exam: language?.exam || [], progress });
}

export async function POST(req: Request) {
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

  const body = await req.json();
  const answers = body.answers || {};
  const exam = language?.exam || [];

  let correct = 0;
  const feedback: Array<{ id: string; correct: boolean; expected: string; userAnswer: string; prompt: string }> = [];

  for (const q of exam) {
    const userAnswer = String(answers[q.id] || "").trim();
    const expected = String(q.answer || "").trim();
    const ok = userAnswer.toLowerCase() === expected.toLowerCase();
    if (ok) {
      correct += 1;
    }
    feedback.push({ id: q.id, correct: ok, expected, userAnswer, prompt: q.prompt });
  }

  const score = Math.round((correct / Math.max(exam.length, 1)) * 100);
  const passed = score >= 75;

  if (progress) {
    progress.examAttempts = (progress.examAttempts || 0) + 1;
    progress.examScores = [...(progress.examScores || []), score];
    if (passed) {
      progress.examPassed = true;
    }
    await saveDB(db);
  }

  return NextResponse.json({ score, passed, feedback });
}
