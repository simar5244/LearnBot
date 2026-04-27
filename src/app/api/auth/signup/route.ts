import { NextResponse } from "next/server";
import { addDays, loadDB, newId, nowISO, saveDB } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || "").toLowerCase().trim();
  const password = String(body.password || "");

  if (email.length === 0 || password.length === 0) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const db = await loadDB();
  const existing = db.users.find((u) => u.email === email);
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const userId = newId("user");
  db.users.push({
    id: userId,
    email,
    passwordHash: hashPassword(password),
    createdAt: nowISO(),
  });

  const sessionId = newId("sess");
  db.sessions.push({ id: sessionId, userId, expiresAt: addDays(7) });

  await saveDB(db);

  const res = NextResponse.json({ ok: true, userId });
  res.cookies.set("session_id", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
