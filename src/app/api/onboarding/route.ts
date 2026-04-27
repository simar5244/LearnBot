import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadDB, saveDB } from "@/lib/db";
import { buildLanguageTrack } from "@/lib/curriculum";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || "";
  const db = await loadDB();
  const session = db.sessions.find((s) => s.id === sessionId);
  if (session === undefined) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const preferredLanguage = String(body.preferredLanguage || "python");
  const startFromScratch = Boolean(body.startFromScratch);
  const knowsSyntax = Boolean(body.knowsSyntax);
  const knowsLoops = Boolean(body.knowsLoops);
  const knowsConditionals = Boolean(body.knowsConditionals);
  const knowsFunctions = Boolean(body.knowsFunctions);
  const confidenceLevel = String(body.confidenceLevel || "low") as "low" | "medium" | "high";
  const weeklyHours = String(body.weeklyHours || "1-2") as "1-2" | "3-5" | "6+";
  const learningGoal = String(body.learningGoal || "")
    .replace(/[^\w\s.,!?'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
  const preferExamples = Boolean(body.preferExamples);

  db.profiles = db.profiles.filter((p) => (p.userId === session.userId ? false : true));
  db.profiles.push({
    userId: session.userId,
    preferredLanguage,
    startFromScratch,
    knowsSyntax,
    knowsLoops,
    confidenceLevel,
    weeklyHours,
    learningGoal,
    preferExamples,
    knowsConditionals,
    knowsFunctions,
  });

  const profile = db.profiles.find((p) => p.userId === session.userId);
  const language = buildLanguageTrack(preferredLanguage, profile);

  db.progress = db.progress.filter((p) => (p.userId === session.userId ? false : true));
  db.progress.push({
    userId: session.userId,
    language: preferredLanguage,
    currentSectionIndex: 0,
    currentVideoIndex: 0,
    completedSections: [],
    mistakesByTopic: {},
    quizScores: [],
    weakSelfReport: "",
    failedAttemptsInSection: 0,
    examAttempts: 0,
    examPassed: false,
    examScores: [],
    seenQuestionIdsBySection: {},
    activeQuizQuestionIds: [],
  });

  await saveDB(db);
  return NextResponse.json({ ok: true, planLength: language.sections.length });
}
