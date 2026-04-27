"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import type { Profile, User } from "@/lib/db";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user);
        setProfile(d.profile);
      });
  }, []);

  const knownTopics = [
    profile?.knowsSyntax ? "syntax" : null,
    profile?.knowsConditionals ? "conditionals" : null,
    profile?.knowsLoops ? "loops" : null,
    profile?.knowsFunctions ? "functions" : null,
  ].filter(Boolean);

  return (
    <div className="container">
      <Nav />
      <div className="section grid two">
        <div className="card">
          <span className="badge">Learner profile</span>
          <h3>{user?.email || "No user"}</h3>
          <div className="section list">
            <div className="sidebar-card">Language: <strong>{profile?.preferredLanguage || "not set"}</strong></div>
            <div className="sidebar-card">Weekly pace: <strong>{profile?.weeklyHours || "not set"}</strong></div>
            <div className="sidebar-card">Confidence mode: <strong>{profile?.confidenceLevel || "not set"}</strong></div>
            <div className="sidebar-card">Examples first: <strong>{profile?.preferExamples ? "Yes" : "No"}</strong></div>
          </div>
        </div>

        <div className="card">
          <span className="badge">Placement memory</span>
          <h3>What you told the platform</h3>
          <div className="section list">
            <div className="sidebar-card">
              <strong>Starting mode</strong>
              <p className="muted">{profile?.startFromScratch ? "Start from scratch" : "Skip the basics I already know"}</p>
            </div>
            <div className="sidebar-card">
              <strong>Known topics</strong>
              <p className="muted">{knownTopics.length > 0 ? knownTopics.join(", ") : "No prior topics selected"}</p>
            </div>
            <div className="sidebar-card">
              <strong>Learning goal</strong>
              <p className="muted">{safeText(profile?.learningGoal) || "No goal set yet"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function safeText(value?: string) {
  return String(value || "").replace(/[^\w\s.,!?'-]/g, " ").replace(/\s+/g, " ").trim();
}
