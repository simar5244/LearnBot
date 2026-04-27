"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/dashboard");
      return;
    }
    const data = await res.json();
    setError(data.error || "Login failed");
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: "80px auto" }}>
        <h2>Log in</h2>
        <p className="muted">Welcome back</p>
        <form onSubmit={handleSubmit} className="section list">
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
          <button className="btn primary" type="submit">Log in</button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>
          Need an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
