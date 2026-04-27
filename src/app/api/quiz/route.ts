import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadDB, saveDB } from "@/lib/db";
import { buildLanguageTrack } from "@/lib/curriculum";
import { buildSectionQuestionBank } from "@/lib/dynamicQuiz";

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
  const sectionIndex = progress?.currentSectionIndex || 0;
  const section = language?.sections[sectionIndex] || null;
  if (!section || !language) {
    return NextResponse.json({ quiz: [], bankSize: 0, usedCount: 0 });
  }

  let bank = progress?.dynamicQuestionBankBySection?.[section.id] || [];
  if (bank.length < 40) {
    bank = await buildSectionQuestionBank({
      section,
      language: language.id,
      profile,
    });
  }

  const seen = progress?.seenQuestionIdsBySection?.[section.id] || [];
  const unseen = bank.filter((q) => !seen.includes(q.id));
  const selected = unseen.length >= 10 ? unseen.slice(0, 10) : [...unseen, ...bank.filter((q) => seen.includes(q.id)).slice(0, 10 - unseen.length)];

  if (progress) {
    progress.dynamicQuestionBankBySection = progress.dynamicQuestionBankBySection || {};
    progress.dynamicQuestionBankBySection[section.id] = bank;
    progress.activeQuizQuestionIds = selected.map((q) => q.id);
    await saveDB(db);
  }
  return NextResponse.json({ quiz: selected, bankSize: bank.length, usedCount: seen.length });
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
  const sectionIndex = Math.min(progress?.currentSectionIndex || 0, Math.max(language.sections.length - 1, 0));
  const section = language?.sections[sectionIndex];

  const body = await req.json();
  const answers = body.answers || {};
  const reviewMode = Boolean(body.reviewMode);
  const requestedSectionId = String(body.sectionId || "");
  const requestedQuestionIds = Array.isArray(body.questionIds)
    ? body.questionIds.map((id: unknown) => String(id))
    : [];
  if (!section || !language) {
    return NextResponse.json({ score: 0, passed: false, mistakes: {}, feedback: [] });
  }
  const targetSection = reviewMode && requestedSectionId
    ? language.sections.find((item) => item.id === requestedSectionId) || section
    : section;
  const sectionBank = progress?.dynamicQuestionBankBySection?.[targetSection.id] || targetSection.quiz;
  const activeIds = progress?.activeQuizQuestionIds || [];
  let quiz = reviewMode
    ? sectionBank.slice(0, 10)
    : sectionBank.filter((q) => activeIds.length === 0 || activeIds.includes(q.id));

  if (requestedQuestionIds.length > 0) {
    const byId = new Set(requestedQuestionIds);
    const fromBank = sectionBank.filter((q) => byId.has(q.id));
    const existingIds = new Set(fromBank.map((q) => q.id));
    const fromSection = targetSection.quiz.filter((q) => byId.has(q.id) && !existingIds.has(q.id));
    const merged = [...fromBank, ...fromSection];
    if (merged.length > 0) {
      quiz = merged;
    }
  }

  let correct = 0;
  const mistakes: Record<string, number> = {};
  const feedback: Array<{ id: string; correct: boolean; expected: string; userAnswer: string; prompt: string }> = [];

  for (const q of quiz) {
    const userAnswer = String(answers[q.id] || "").trim();
    const expected = String(q.answer || "").trim();
    if (userAnswer.toLowerCase() === expected.toLowerCase()) {
      correct += 1;
      feedback.push({ id: q.id, correct: true, expected, userAnswer, prompt: q.prompt });
    } else {
      const topic = String(q.topic || "general");
      mistakes[topic] = (mistakes[topic] || 0) + 1;
      feedback.push({ id: q.id, correct: false, expected, userAnswer, prompt: q.prompt });
    }
  }

  const score = Math.round((correct / Math.max(quiz.length, 1)) * 100);
  const passed = score >= 70;
  if (progress && reviewMode === false) {
    progress.mistakesByTopic = progress.mistakesByTopic || {};
    progress.quizScores = [...(progress.quizScores || []), score];
    for (const [topic, count] of Object.entries(mistakes)) {
      progress.mistakesByTopic[topic] = (progress.mistakesByTopic[topic] || 0) + count;
    }
    progress.wrongTagCounts = progress.wrongTagCounts || {};
    for (const fb of feedback.filter((f) => !f.correct)) {
      const question = quiz.find((q) => q.id === fb.id);
      const tags = question?.tags && question.tags.length > 0 ? question.tags : [question?.topic || "general"];
      for (const tag of tags) {
        progress.wrongTagCounts[tag] = (progress.wrongTagCounts[tag] || 0) + 1;
      }
    }

    if (passed) {
      if (targetSection) {
        const alreadyComplete = progress.completedSections.includes(targetSection.id);
        if (alreadyComplete === false) {
          progress.completedSections.push(targetSection.id);
        }
      }
      progress.currentSectionIndex = progress.currentSectionIndex + 1;
      progress.currentVideoIndex = 0;
      progress.failedAttemptsInSection = 0;
    } else {
      const maxVideoIndex = targetSection ? Math.max(targetSection.videos.length - 1, 0) : 0;
      const failedAttempts = progress.failedAttemptsInSection || 0;
      if (maxVideoIndex > 0) {
        const nextVideo = (progress.currentVideoIndex + 1 + failedAttempts) % (maxVideoIndex + 1);
        progress.currentVideoIndex = nextVideo;
      } else {
        progress.currentVideoIndex = 0;
      }
      progress.failedAttemptsInSection = failedAttempts + 1;
    }

    const seenBySection = progress.seenQuestionIdsBySection || {};
    const prior = seenBySection[targetSection.id] || [];
    const merged = [...prior, ...quiz.map((q) => q.id)];
    seenBySection[targetSection.id] = Array.from(new Set(merged)).slice(-50);
    progress.seenQuestionIdsBySection = seenBySection;
    await saveDB(db);
  }

  return NextResponse.json({ score, passed, mistakes, feedback, reviewMode, sectionId: targetSection.id });
}
