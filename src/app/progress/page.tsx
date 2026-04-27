"use client";

import { useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import type { Profile, Progress, QuizQuestion, Section } from "@/lib/db";

type ProgressPayload = {
  progress: Progress | null;
  profile: Profile | null;
  plan: Section[];
  currentSection: Section | null;
  nextSection: Section | null;
  exam: QuizQuestion[];
};

export default function ProgressPage() {
  const [data, setData] = useState<ProgressPayload | null>(null);

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then((payload) => setData(payload));
  }, []);

  const progress = data?.progress;
  const plan = data?.plan || [];
  const completedCount = progress?.completedSections?.length || 0;
  const averageQuiz = useMemo(() => {
    const scores = progress?.quizScores || [];
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum: number, score: number) => sum + score, 0);
    return Math.round(total / scores.length);
  }, [progress]);
  const strongestGaps = useMemo(() => {
    const entries = Object.entries(progress?.mistakesByTopic || {}) as Array<[string, number]>;
    return entries.sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [progress]);
  const completionPercent = plan.length === 0 ? 0 : Math.round((completedCount / plan.length) * 100);

  return (
    <div className="container">
      <Nav />
      <div className="section grid two progress-layout">
        <div className="card">
          <span className="badge">Progress overview</span>
          <h3>Where you are right now</h3>
          <p className="muted">This page now reads from your actual roadmap and progress state instead of a half-empty snapshot.</p>

          <div className="section progress-hero">
            <div>
              <span className="hero-label">Path completion</span>
              <strong>{completionPercent}%</strong>
            </div>
            <div>
              <span className="hero-label">Average checkpoint</span>
              <strong>{averageQuiz}%</strong>
            </div>
            <div>
              <span className="hero-label">Current lesson</span>
              <strong>{data?.currentSection?.title || "No lesson active yet"}</strong>
            </div>
          </div>

          <div className="section list">
            <div className="sidebar-card">Completed lessons: <strong>{completedCount}/{plan.length}</strong></div>
            <div className="sidebar-card">Failed attempts in current lesson: <strong>{progress?.failedAttemptsInSection ?? 0}</strong></div>
            <div className="sidebar-card">Exam attempts: <strong>{progress?.examAttempts ?? 0}</strong></div>
            <div className="sidebar-card">Exam status: <strong>{progress?.examPassed ? "Passed" : "In progress"}</strong></div>
          </div>
        </div>

        <div className="card">
          <span className="badge">What to focus on</span>
          <h3>Weak spots and next lesson</h3>
          <div className="section list">
            {strongestGaps.length > 0 ? (
              strongestGaps.map(([topic, count]) => (
                <div key={topic} className="sidebar-card">
                  <strong>{topic}</strong>
                  <p className="muted">{count} missed answers tracked so far</p>
                </div>
              ))
            ) : (
              <div className="sidebar-card">
                <strong>No major weak spots yet</strong>
                <p className="muted">You have not built enough mistake history for a ranked gap list.</p>
              </div>
            )}
          </div>

          <div className="section sidebar-card card-soft">
            <span className="hero-label">Next up</span>
            <strong>{data?.nextSection?.title || data?.currentSection?.title || "Finish onboarding to unlock a path"}</strong>
            <p className="muted">{data?.nextSection?.summary || data?.currentSection?.summary || "Your next step will appear here once the path is ready."}</p>
          </div>

          <div className="section">
            <h4>Self report</h4>
            <p className="muted" style={{ marginTop: 6 }}>{progress?.weakSelfReport || "No note saved yet."}</p>
          </div>
        </div>
      </div>

      <div className="section card">
        <span className="badge">Roadmap</span>
        <h3>Your full guided path</h3>
        <div className="section roadmap-grid">
          {plan.map((item, index) => {
            const status = index < (progress?.currentSectionIndex || 0) ? "completed" : index === (progress?.currentSectionIndex || 0) ? "current" : "up-next";
            return (
              <div key={item.id} className={`sidebar-card roadmap-card ${status}`}>
                <span className="hero-label">Step {index + 1}</span>
                <strong>{item.title}</strong>
                <p className="muted">{item.summary || item.goal || "This step is already part of your personalized path."}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
