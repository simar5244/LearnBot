import { NextResponse } from "next/server";
import { loadDB, saveDB } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || "";
  const db = await loadDB();
  db.sessions = db.sessions.filter((s) => (s.id === sessionId ? false : true));
  await saveDB(db);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("session_id", "", { path: "/" });
  return res;
}
