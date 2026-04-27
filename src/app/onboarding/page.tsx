"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";

type Language = {
  id: string;
  name: string;
  level: "beginner" | "advanced";
};

type PlanItem = {
  id: string;
  title: string;
  summary?: string;
  adaptiveOutline?: string[];
};

export default function OnboardingPage() {
  const router = useRouter();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [preferredLanguage, setPreferredLanguage] = useState("python");
  const [startFromScratch, setStartFromScratch] = useState(true);
  const [knowsSyntax, setKnowsSyntax] = useState(false);
  const [knowsConditionals, setKnowsConditionals] = useState(false);
  const [knowsLoops, setKnowsLoops] = useState(false);
  const [knowsFunctions, setKnowsFunctions] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState("medium");
  const [weeklyHours, setWeeklyHours] = useState("3-5");
  const [preferExamples, setPreferExamples] = useState(true);
  const [learningGoal, setLearningGoal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<PlanItem[]>([]);
  const [previewStep, setPreviewStep] = useState(0);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => setLanguages(d.languages || []));
  }, []);

  useEffect(() => {
    if (generatedPlan.length === 0) return;

    const stepTimers = [
      window.setTimeout(() => setPreviewStep(1), 900),
      window.setTimeout(() => setPreviewStep(2), 1900),
      window.setTimeout(() => router.push("/learn"), 3600),
    ];

    return () => {
      stepTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [generatedPlan, router]);

  const upcoming = useMemo(() => generatedPlan.slice(0, 3), [generatedPlan]);
  const beginners = languages.filter((l) => l.level === "beginner");
  const advanced = languages.filter((l) => l.level === "advanced");

  function syncScratch(nextValue: boolean) {
    setStartFromScratch(nextValue);
    if (nextValue) {
      setKnowsSyntax(false);
      setKnowsConditionals(false);
      setKnowsLoops(false);
      setKnowsFunctions(false);
    }
  }

  function toggleKnowledge(setter: (value: boolean) => void, nextValue: boolean) {
    setter(nextValue);
    if (nextValue) {
      setStartFromScratch(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferredLanguage,
        startFromScratch,
        knowsSyntax,
        knowsConditionals,
        knowsLoops,
        knowsFunctions,
        confidenceLevel,
        weeklyHours,
        learningGoal,
        preferExamples,
      }),
    });

    if (!res.ok) {
      setLoading(false);
      const data = await res.json();
      setError(data.error || "Onboarding failed");
      return;
    }

    const planRes = await fetch("/api/plan").then((r) => r.json());
    setGeneratedPlan(planRes.plan || []);
    setPreviewStep(0);
    setLoading(false);
  }

  if (generatedPlan.length > 0) {
    return (
      <div className="container">
        <Nav />
        <div className="card launch-card fade-up">
          <span className="badge">Path locked in</span>
          <h2>Your roadmap is being built around what you already know.</h2>
          <p className="muted">
            You are not getting a generic beginner track. We are starting you where your answers say you should start.
          </p>

          <div className="launch-steps">
            <div className={`launch-step ${previewStep >= 0 ? "active" : ""}`}>
              <strong>Step 1</strong>
              <span>We picked your starting point.</span>
            </div>
            <div className={`launch-step ${previewStep >= 1 ? "active" : ""}`}>
              <strong>Step 2</strong>
              <span>We mapped what you learn next.</span>
            </div>
            <div className={`launch-step ${previewStep >= 2 ? "active" : ""}`}>
              <strong>Step 3</strong>
              <span>We are opening your learning workspace.</span>
            </div>
          </div>

          <div className="section grid three">
            {upcoming.map((item, index) => (
              <div key={item.id} className="sidebar-card roadmap-preview">
                <span className="muted">Up next {index + 1}</span>
                <strong>{item.title}</strong>
                <p className="muted">{item.summary || item.adaptiveOutline?.[0]}</p>
              </div>
            ))}
          </div>

          <div className="section hero-actions">
            <button className="btn primary" type="button" onClick={() => router.push("/learn")}>
              Open learning workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Nav />
      <div className="card fade-up">
        <span className="badge">Personalized placement</span>
        <h2>Tell us what you can already do so we stop wasting your time.</h2>
        <p className="muted">
          This is how the platform decides whether you need foundations, bridge lessons, or straight-up advanced practice.
        </p>

        <form onSubmit={handleSubmit} className="section list onboarding-list">
          <div className="section-block">
            <h4>Language</h4>
            <div className="grid two-tight">
              {beginners.map((lang) => (
                <label key={lang.id} className="sidebar-card selectable">
                  <input
                    type="radio"
                    name="language"
                    value={lang.id}
                    checked={preferredLanguage === lang.id}
                    onChange={() => setPreferredLanguage(lang.id)}
                  />
                  <div>
                    <div style={{ fontWeight: 700 }}>{lang.name}</div>
                    <div className="muted">10-step guided track available now</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="muted" style={{ marginTop: 12, marginBottom: 8 }}>Locked next tracks</div>
            <div className="grid three">
              {advanced.map((lang) => (
                <div key={lang.id} className="sidebar-card card-muted">
                  <div style={{ fontWeight: 700 }}>{lang.name}</div>
                  <div className="muted">Unlocks after you finish a core path</div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-block">
            <h4>Placement</h4>
            <div className="grid two-tight">
              <label className="sidebar-card selectable">
                <input type="checkbox" checked={startFromScratch} onChange={(e) => syncScratch(e.target.checked)} />
                <span>Start from scratch</span>
              </label>
              <label className="sidebar-card selectable">
                <input type="checkbox" checked={knowsSyntax} onChange={(e) => toggleKnowledge(setKnowsSyntax, e.target.checked)} />
                <span>I can read basic syntax already</span>
              </label>
              <label className="sidebar-card selectable">
                <input type="checkbox" checked={knowsConditionals} onChange={(e) => toggleKnowledge(setKnowsConditionals, e.target.checked)} />
                <span>I can write conditionals</span>
              </label>
              <label className="sidebar-card selectable">
                <input type="checkbox" checked={knowsLoops} onChange={(e) => toggleKnowledge(setKnowsLoops, e.target.checked)} />
                <span>I can work with loops</span>
              </label>
              <label className="sidebar-card selectable">
                <input type="checkbox" checked={knowsFunctions} onChange={(e) => toggleKnowledge(setKnowsFunctions, e.target.checked)} />
                <span>I understand functions or methods</span>
              </label>
              <label className="sidebar-card selectable">
                <input type="checkbox" checked={preferExamples} onChange={(e) => setPreferExamples(e.target.checked)} />
                <span>Show examples before abstract explanations</span>
              </label>
            </div>
          </div>

          <div className="section-block grid two-tight">
            <div>
              <label className="muted">Confidence right now</label>
              <select className="select" value={confidenceLevel} onChange={(e) => setConfidenceLevel(e.target.value)}>
                <option value="low">Need steady wins</option>
                <option value="medium">Comfortable pace</option>
                <option value="high">Push me harder</option>
              </select>
            </div>
            <div>
              <label className="muted">Hours you can give this each week</label>
              <select className="select" value={weeklyHours} onChange={(e) => setWeeklyHours(e.target.value)}>
                <option value="1-2">1 to 2 hours</option>
                <option value="3-5">3 to 5 hours</option>
                <option value="6+">6 plus hours</option>
              </select>
            </div>
          </div>

          <div className="section-block">
            <label className="muted">What are you trying to reach?</label>
            <textarea
              className="textarea"
              placeholder="Example: I want to build small apps without freezing when I hit loops, functions, or debugging."
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
            />
          </div>

          {error && <div className="state-bad">{error}</div>}
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Building your path..." : "Generate My Guided Plan"}
          </button>
        </form>
      </div>
    </div>
  );
}
