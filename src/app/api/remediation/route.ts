import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadDB, saveDB } from "@/lib/db";
import { buildRemediationPack } from "@/lib/remediation";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value || "";
    const db = await loadDB();
    const session = db.sessions.find((s) => s.id === sessionId);
    if (!session) return NextResponse.json({ error: "Unauthorized", packs: [] }, { status: 401 });

    const progress = db.progress.find((p) => p.userId === session.userId);
    const profile = db.profiles.find((p) => p.userId === session.userId);
    const packs = await buildRemediationPack(profile, progress);
    await saveDB(db);
    return NextResponse.json({ packs, error: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load remediation packs.";
    return NextResponse.json({ packs: [], error: message }, { status: 500 });
  }
}
