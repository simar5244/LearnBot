"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Nav() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="nav">
      <div className="brand">LearnBot</div>
      <div className="nav-links">
        <Link className="btn" href="/dashboard">Dashboard</Link>
        <Link className="btn" href="/my-tutor-lab">My Tutor Lab</Link>
        <Link className="btn" href="/progress">Progress</Link>
        <Link className="btn" href="/profile">Profile</Link>
        <button className="btn" onClick={logout}>Log out</button>
      </div>
    </div>
  );
}
