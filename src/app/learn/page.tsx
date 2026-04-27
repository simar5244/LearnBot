"use client";

import Link from "next/link";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import type { Progress, Section } from "@/lib/db";

type QuizQuestion = {
  id: string;
  type: "mcq" | "short";
  prompt: string;
  options?: string[];
};

type PlanItem = {
  id: string;
  title: string;
  summary?: string;
  goal?: string;
  phase?: string;
  adaptiveOutline?: string[];
  adaptiveMeta?: {
    recommendedMinutes?: number;
  };
  videos: Array<{ title: string; embedUrl: string }>;
  quiz: QuizQuestion[];
};

type Feedback = {
  id: string;
  prompt: string;
  correct: boolean;
  expected: string;
  userAnswer: string;
};

type QuizResult = {
  score: number;
  passed: boolean;
  mistakes?: Record<string, number>;
  feedback?: Feedback[];
  reviewMode?: boolean;
};

export default function LearnPage() {
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [exam, setExam] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [examResult, setExamResult] = useState<QuizResult | null>(null);
  const [weakSelfReport, setWeakSelfReport] = useState("");
  const [pathCollapsed, setPathCollapsed] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  const resetModuleStage = useCallback(() => {
    setAnswers({});
    setResult(null);
    setQuizStarted(false);
    setTimeLeft(0);
    setSubmittingQuiz(false);
  }, []);

  const loadAll = useCallback(async (resetFeedback = false, resetStage = true) => {
    const [planRes, learnRes, examRes] = await Promise.all([
      fetch("/api/plan").then((r) => r.json()),
      fetch("/api/learn").then((r) => r.json()),
      fetch("/api/exam").then((r) => r.json()),
    ]);

    const loadedPlan = (planRes.plan || []) as PlanItem[];
    const loadedProgress = (planRes.progress || null) as Progress | null;
    const currentIndex = Math.min(loadedProgress?.currentSectionIndex || 0, Math.max(loadedPlan.length - 1, 0));

    setPlan(loadedPlan);
    setProgress(loadedProgress);
    setSection(learnRes.section || null);
    setExam(examRes.exam || []);
    setActiveSectionIndex(currentIndex);
    if (resetStage) {
      resetModuleStage();
    }
    if (resetFeedback) {
      setResult(null);
      setExamResult(null);
    }
  }, [resetModuleStage]);

  useEffect(() => {
    const initTimer = window.setTimeout(() => {
      void loadAll(true);
    }, 0);

    return () => window.clearTimeout(initTimer);
  }, [loadAll]);

  const currentIndex = Math.min(progress?.currentSectionIndex || 0, Math.max(plan.length - 1, 0));
  const totalSections = plan.length || 1;
  const completed = Math.min((progress?.completedSections || []).length, totalSections);
  const percent = Math.round((completed / totalSections) * 100);
  const inExamMode = progress ? progress.currentSectionIndex >= totalSections : false;
  const canOpenSection = (idx: number) => idx <= currentIndex;
  const selectedPlanItem = inExamMode ? null : plan[activeSectionIndex] || section;
  const selectedQuiz = useMemo(() => selectedPlanItem?.quiz ?? [], [selectedPlanItem]);
  const selectedVideo = useMemo(() => selectedPlanItem?.videos?.[0] ?? null, [selectedPlanItem]);
  const reviewMode = activeSectionIndex !== currentIndex;
  const nextItems = plan.filter((_, index) => index > activeSectionIndex).slice(0, 2);
  const weakTopics = useMemo(() => Object.keys(result?.mistakes || {}), [result]);

  function startQuiz() {
    const duration = Math.max(selectedQuiz.length * 30, 120);
    setQuizStarted(true);
    setTimeLeft(duration);
  }

  const submitQuiz = useCallback(async () => {
    if (submittingQuiz) return;
    setSubmittingQuiz(true);
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers,
        reviewMode,
        sectionId: selectedPlanItem?.id || section?.id || "",
        questionIds: selectedQuiz.map((q) => q.id),
      }),
    });
    const data = await res.json();
    setResult(data);
    setQuizStarted(false);
    setTimeLeft(0);
    setSubmittingQuiz(false);
    if (!reviewMode) {
      await loadAll(false, false);
    }
  }, [answers, loadAll, reviewMode, section?.id, selectedPlanItem?.id, selectedQuiz, submittingQuiz]);

  useEffect(() => {
    if (!quizStarted || result || inExamMode || selectedQuiz.length === 0) return;
    if (timeLeft <= 0) {
      const autoTimer = window.setTimeout(() => {
        void submitQuiz();
      }, 0);
      return () => window.clearTimeout(autoTimer);
    }

    const timer = window.setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [quizStarted, result, inExamMode, selectedQuiz.length, submitQuiz, timeLeft]);

  async function submitExam() {
    const res = await fetch("/api/exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    setExamResult(data);
    setResult(null);
  }

  async function submitWeak() {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weakSelfReport }),
    });
  }

  function formatTimer(seconds: number) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }

  return (
    <div className="container">
      <Nav />
      <div className={`learn-layout ${pathCollapsed ? "collapsed" : ""}`}>
        <aside className={`card sticky-card guided-path ${pathCollapsed ? "collapsed" : ""}`}>
          <div className="guided-path-head">
            <div>
              <h3>Guided Path</h3>
              {!pathCollapsed && <p className="muted">Tap any completed section to revisit it.</p>}
            </div>
            <button className="btn btn-path-toggle" type="button" onClick={() => setPathCollapsed((value) => !value)}>
              {pathCollapsed ? "Open" : "Collapse"}
            </button>
          </div>

          {!pathCollapsed && (
            <>
              <div className="section">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${percent}%` }} />
                </div>
                <div className="muted" style={{ marginTop: 6 }}>{percent}% of your guided path completed</div>
              </div>

              <div className="section list">
                {plan.map((item, idx) => {
                  const state = idx < currentIndex ? "completed" : idx === currentIndex ? "current" : "locked";
                  const selected = idx === activeSectionIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`sidebar-card path-item ${state} ${selected ? "selected" : ""}`}
                      onClick={() => {
                        if (!canOpenSection(idx)) return;
                        resetModuleStage();
                        setActiveSectionIndex(idx);
                      }}
                      disabled={!canOpenSection(idx)}
                    >
                      <div className="path-item-head">
                        <span className="path-order">{String(idx + 1).padStart(2, "0")}</span>
                        <span className={state === "completed" ? "state-ok" : state === "current" ? "badge" : "muted"}>
                          {state === "completed" ? "Revisit" : state === "current" ? "Now" : "Locked"}
                        </span>
                      </div>
                      <strong>{item.title}</strong>
                      <p className="muted">{item.summary || item.adaptiveOutline?.[0]}</p>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </aside>

        <main className="card learn-main">
          {inExamMode ? (
            <>
              <span className="badge">Final checkpoint</span>
              <h3>Finish your path with one last exam</h3>
              <p className="muted">You cleared every module. Final exam feedback always shows correct and incorrect responses.</p>
              <div className="section list">
                {exam.map((q) => (
                  <QuestionCard key={q.id} q={q} answers={answers} setAnswers={setAnswers} />
                ))}
              </div>
              <button className="btn primary" style={{ marginTop: 14 }} onClick={submitExam}>Submit final checkpoint</button>
              {examResult && (
                <div className="section sidebar-card">
                  <div className="badge">Score: {examResult.score}%</div>
                  <p className={examResult.passed ? "state-ok" : "state-bad"} style={{ marginTop: 8 }}>
                    {examResult.passed ? "Passed." : "Not passed yet."}
                  </p>
                  <FeedbackList feedback={examResult.feedback || []} />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="lesson-hero-simple">
                <div>
                  <span className="badge">{selectedPlanItem?.phase || "module"}</span>
                  <h2>{selectedPlanItem?.title || "Current lesson"}</h2>
                  <p className="muted">{selectedPlanItem?.summary || selectedPlanItem?.goal || "Your next lesson is ready."}</p>
                </div>
              </div>

              <div className="section grid two-tight">
                <div className="sidebar-card">
                  <span className="hero-label">You are learning now</span>
                  <strong>{selectedPlanItem?.title || "Current lesson"}</strong>
                  <p className="muted">{selectedPlanItem?.adaptiveOutline?.[0] || selectedPlanItem?.summary || "Focused module in progress."}</p>
                </div>
                <div className="sidebar-card">
                  <span className="hero-label">Coming up next</span>
                  {nextItems.length > 0 ? (
                    <div className="list">
                      {nextItems.map((item) => (
                        <div key={item.id}>
                          <strong>{item.title}</strong>
                          <p className="muted">{item.summary}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="muted">Final checkpoint unlocks after this module.</p>
                  )}
                </div>
              </div>

              {!quizStarted && !result && selectedVideo && (
                <div className="section video-wrap">
                  <iframe
                    className="video-frame"
                    src={selectedVideo.embedUrl}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="video-meta">
                    <div>
                      <strong>{selectedVideo.title}</strong>
                      <p className="muted">Step 1: complete video. Step 2: timed quiz unlocks.</p>
                    </div>
                    <button className="btn primary" type="button" onClick={startQuiz}>
                      Mark video complete and start quiz
                    </button>
                  </div>
                </div>
              )}

              {quizStarted && (
                <div className="section quiz-stage">
                  <div className="quiz-stage-head">
                    <div>
                      <h4>Timed checkpoint quiz</h4>
                      <p className="muted">Video stage is done. Quiz only mode is active.</p>
                    </div>
                    <div className="timer-pill">{formatTimer(timeLeft)}</div>
                  </div>
                  <div className="list" style={{ marginTop: 12 }}>
                    {selectedQuiz.map((q) => (
                      <QuestionCard key={q.id} q={q} answers={answers} setAnswers={setAnswers} />
                    ))}
                  </div>
                  <button className="btn primary" style={{ marginTop: 12 }} onClick={() => void submitQuiz()} disabled={submittingQuiz}>
                    {submittingQuiz ? "Submitting..." : "Submit checkpoint"}
                  </button>
                </div>
              )}

              {result && (
                <div className="section sidebar-card">
                  <div className="badge">Score: {result.score}%</div>
                  <p className={result.passed ? "state-ok" : "state-bad"} style={{ marginTop: 8 }}>
                    {result.passed ? "Passed. Move to the next module." : "Not passed. Review feedback, then retry this module."}
                  </p>
                  {weakTopics.length > 0 && <p className="muted" style={{ marginTop: 6 }}>Weak areas: {weakTopics.join(", ")}</p>}
                  <FeedbackList feedback={result.feedback || []} />
                  {!reviewMode && !result.passed && (
                    <>
                      <textarea
                        className="textarea"
                        style={{ marginTop: 10 }}
                        placeholder="What still feels shaky? This feeds your progress profile."
                        value={weakSelfReport}
                        onChange={(e) => setWeakSelfReport(e.target.value)}
                        onBlur={submitWeak}
                      />
                      <Link className="btn" href="/chat" style={{ marginTop: 8 }}>Open tutor chat</Link>
                    </>
                  )}
                  {!reviewMode && result.passed && (
                    <button className="btn primary" style={{ marginTop: 10 }} onClick={() => void loadAll(true, true)}>
                      Go to next module
                    </button>
                  )}
                  {!reviewMode && !result.passed && (
                    <button
                      className="btn"
                      style={{ marginTop: 10 }}
                      onClick={() => {
                        setResult(null);
                        setAnswers({});
                        setQuizStarted(false);
                        setTimeLeft(0);
                      }}
                    >
                      Retry this module
                    </button>
                  )}
                  {reviewMode && <p className="muted" style={{ marginTop: 10 }}>Review mode does not change progression. It is for practice only.</p>}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function QuestionCard({
  q,
  answers,
  setAnswers,
}: {
  q: QuizQuestion;
  answers: Record<string, string>;
  setAnswers: Dispatch<SetStateAction<Record<string, string>>>;
}) {
  return (
    <div className="sidebar-card quiz-card">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{q.prompt}</div>
      {q.type === "mcq" && q.options && (
        <div className="list">
          {q.options.map((opt, idx) => (
            <label 
              key={`${q.id}-${idx}`} 
              className="choice"
              onClick={(e) => {
                e.preventDefault();
                setAnswers((prev) => ({ ...prev, [q.id]: opt }));
              }}
            >
              <input
                type="radio"
                name={q.id}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                onClick={(e) => e.stopPropagation()}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
      {q.type === "short" && (
        <input
          className="input"
          placeholder="Write your answer"
          value={answers[q.id] || ""}
          onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
        />
      )}
    </div>
  );
}

function FeedbackList({ feedback }: { feedback: Feedback[] }) {
  if (feedback.length === 0) return null;

  return (
    <div className="section list">
      {feedback.map((item) => (
        <div key={item.id} className={`sidebar-card ${item.correct ? "feedback-correct" : "feedback-card"}`}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <strong>{item.prompt}</strong>
            <span className={item.correct ? "state-ok" : "state-bad"}>{item.correct ? "Correct" : "Incorrect"}</span>
          </div>
          <div className="muted" style={{ marginTop: 6 }}>Your answer: {item.userAnswer ?? "No answer"}</div>
          <div style={{ marginTop: 6 }}>Expected: {item.expected}</div>
        </div>
      ))}
    </div>
  );
}
