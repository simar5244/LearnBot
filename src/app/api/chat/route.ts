import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadDB } from "@/lib/db";

async function answerFallback() {
  return "Thanks for your question. Try breaking the problem into small steps and test each part.";
}

async function answerAI(message: string, language: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey === undefined || apiKey.length === 0) return answerFallback();

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const prompt =
    "You are a friendly tutor. Answer in short steps. Language: " +
    language +
    ". Question: " +
    message;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    }),
  });

  if (res.ok === false) return answerFallback();
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "";
  return content || answerFallback();
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || "";
  const db = await loadDB();
  const session = db.sessions.find((s) => s.id === sessionId);
  if (session === undefined) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const message = String(body.message || "");
  const profile = db.profiles.find((p) => p.userId === session.userId);
  const language = profile?.preferredLanguage || "python";

  const reply = await answerAI(message, language);
  return NextResponse.json({ reply });
}
