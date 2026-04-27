import { NextResponse } from "next/server";
import { addDays, loadDB, newId, saveDB } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || "").toLowerCase().trim();
  const password = String(body.password || "");

  if (email.length === 0 || password.length === 0) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const db = await loadDB();
  const user = db.users.find((u) => u.email === email);
  const ok = user ? verifyPassword(password, user.passwordHash) : false;
  if (user === undefined || ok === false) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const sessionId = newId("sess");
  db.sessions.push({ id: sessionId, userId: user.id, expiresAt: addDays(7) });
  await saveDB(db);

  const res = NextResponse.json({ ok: true, userId: user.id });
  res.cookies.set("session_id", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
