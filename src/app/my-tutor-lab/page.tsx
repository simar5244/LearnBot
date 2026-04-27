"use client";

import { useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";

type QuizQuestion = {
  id: string;
  type: "mcq" | "short";
  prompt: string;
  options?: string[];
  answer: string;
  topic: string;
};

type Pack = {
  topic: string;
  guidance: string;
  lessonText?: string[];
  video: { title: string; embedUrl: string };
  quiz: QuizQuestion[];
};

export default function MyTutorLabPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loadError, setLoadError] = useState<string>("");
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});

  async function refresh() {
    try {
      const res = await fetch("/api/remediation", { cache: "no-store" });
      const raw = await res.text();
      const parsed = raw ? JSON.parse(raw) : {};
      setPacks(Array.isArray(parsed.packs) ? parsed.packs : []);
      setLoadError(typeof parsed.error === "string" ? parsed.error : "");
    } catch {
      setPacks([]);
      setLoadError("Could not load tutor content. Please refresh again.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const hasContent = packs.length > 0;

  function gradePack(pack: Pack) {
    let correct = 0;
    for (const q of pack.quiz) {
      const user = String(answers[q.id] || "").trim().toLowerCase();
      const expected = String(q.answer || "").trim().toLowerCase();
      if (user.length > 0 && user === expected) correct += 1;
    }
    const score = Math.round((correct / Math.max(pack.quiz.length, 1)) * 100);
    setScores((prev) => ({ ...prev, [pack.topic]: score }));
  }

  const summary = useMemo(() => {
    const values = Object.values(scores);
    if (values.length === 0) return null;
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    return `${avg}% average across graded tutor topics`;
  }, [scores]);

  return (
    <div className="container">
      <Nav />
      <div className="section card">
        <span className="badge">My Tutor Lab</span>
        <h2>Adaptive mistake recovery</h2>
        <p className="muted">This page updates from your wrong concepts and gives targeted explanations, resources, videos, and quizzes.</p>
        <button className="btn" style={{ marginTop: 10 }} onClick={refresh}>Refresh from latest wrong answers</button>
        {loadError && <p className="state-bad" style={{ marginTop: 8 }}>{loadError}</p>}
        {summary && <p style={{ marginTop: 8 }}><strong>{summary}</strong></p>}
      </div>

      {!hasContent && (
        <div className="section card">
          <h3>No weak topics detected yet</h3>
          <p className="muted">Finish lesson quizzes first. Once mistakes are tracked, My Tutor Lab will auto-populate here.</p>
        </div>
      )}

      {packs.map((pack) => (
        <div key={pack.topic} className="section card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div>
              <h3 style={{ textTransform: "capitalize" }}>{pack.topic}</h3>
              <p className="muted">{pack.guidance}</p>
            </div>
            <button
              className="btn"
              type="button"
              onClick={() => setOpenTopics((prev) => ({ ...prev, [pack.topic]: !prev[pack.topic] }))}
            >
              {openTopics[pack.topic] ? "Collapse" : "Expand"}
            </button>
          </div>

          {openTopics[pack.topic] && (
            <>
              {pack.lessonText && pack.lessonText.length > 0 && (
                <div className="section sidebar-card">
                  <strong>What to fix in this topic</strong>
                  <div className="list" style={{ marginTop: 8 }}>
                    {pack.lessonText.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="section video-wrap">
                <iframe
                  className="video-frame"
                  src={pack.video.embedUrl}
                  title={pack.video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <p className="muted" style={{ marginTop: 8 }}>{pack.video.title}</p>
              </div>

              {pack.quiz.length > 0 && (
                <div className="section">
                  <h4>Dynamic quiz on {pack.topic}</h4>
                  <div className="list" style={{ marginTop: 10 }}>
                    {pack.quiz.map((q) => (
                      <div key={q.id} className="sidebar-card">
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>{q.prompt}</div>
                        {q.type === "mcq" && q.options && (
                          <div className="list">
                            {q.options.map((opt) => (
                              <label key={opt} className="choice">
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={opt}
                                  checked={answers[q.id] === opt}
                                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
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
                    ))}
                  </div>
                  <button className="btn primary" style={{ marginTop: 12 }} onClick={() => gradePack(pack)}>
                    Grade {pack.topic} quiz
                  </button>
                  {scores[pack.topic] !== undefined && (
                    <div className="section sidebar-card">
                      <span className="badge">Score: {scores[pack.topic]}%</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {!openTopics[pack.topic] && (
            <div className="section sidebar-card">
              <p className="muted">This tag is collapsed. Expand to see lesson text, video, and quiz.</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
