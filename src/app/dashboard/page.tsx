"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import type { Profile, Progress, User } from "@/lib/db";

type PlanItem = {
  id: string;
  title: string;
  summary?: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/plan").then((r) => r.json()),
    ]).then(([me, planData]) => {
      setUser(me.user);
      setProfile(me.profile);
      setPlan(planData.plan || []);
      setProgress(planData.progress || null);
    });
  }, []);

  const currentLesson = plan[Math.min(progress?.currentSectionIndex || 0, Math.max(plan.length - 1, 0))];
  const nextLesson = plan[Math.min((progress?.currentSectionIndex || 0) + 1, Math.max(plan.length - 1, 0))];

  return (
    <div className="container">
      <Nav />

      <div className="section card dashboard-hero">
        <div>
          <span className="badge">Dashboard</span>
          <h2>{user?.email || "Learner"}</h2>
          <p className="muted">
            {profile?.learningGoal || "Your learning path adapts around what you already know and what still needs work."}
          </p>
        </div>
        <div className="hero-actions">
          <Link className="btn primary" href="/learn">Continue learning</Link>
          <Link className="btn" href="/progress">View progress</Link>
        </div>
      </div>

      <div className="section grid two">
        <div className="card">
          <span className="badge">Now</span>
          <h3>{currentLesson?.title || "Finish onboarding to unlock a lesson"}</h3>
          <p className="muted">{currentLesson?.summary || "Your first lesson will show up here after placement."}</p>
        </div>

        <div className="card">
          <span className="badge">Next</span>
          <h3>{nextLesson?.title || "Final checkpoint is coming up"}</h3>
          <p className="muted">{nextLesson?.summary || "Keep moving and the next milestone will appear here."}</p>
        </div>
      </div>

      <div className="section roadmap-grid">
        {plan.slice(0, 4).map((item, index) => (
          <div key={item.id} className="card">
            <span className="hero-label">Path step {index + 1}</span>
            <h4>{item.title}</h4>
            <p className="muted">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
