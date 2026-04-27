"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/onboarding");
      return;
    }
    const data = await res.json();
    setError(data.error || "Signup failed");
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: "80px auto" }}>
        <h2>Sign up</h2>
        <p className="muted">Start learning in minutes</p>
        <form onSubmit={handleSubmit} className="section list">
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
          <button className="btn primary" type="submit">Create account</button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
