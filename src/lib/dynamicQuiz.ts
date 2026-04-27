import type { Profile, QuizQuestion, Section } from "@/lib/db";

function sanitizeQuestion(q: QuizQuestion, idx: number, sectionId: string): QuizQuestion {
  return {
    id: `${sectionId}_dyn_${idx + 1}`,
    type: q.type === "short" ? "short" : "mcq",
    prompt: String(q.prompt || "").trim(),
    options: q.type === "mcq" ? (q.options || []).slice(0, 4).map((o) => String(o)) : undefined,
    answer: String(q.answer || "").trim(),
    topic: String(q.topic || sectionId),
    tags: Array.isArray(q.tags) && q.tags.length > 0 ? q.tags.map((t) => String(t)) : [String(q.topic || sectionId)],
  };
}

function fallbackQuestionBank(section: Section): QuizQuestion[] {
  const base = section.quiz;
  const out: QuizQuestion[] = [];
  for (let round = 0; round < 4; round += 1) {
    for (let i = 0; i < base.length; i += 1) {
      const q = base[i];
      if (q.type === "mcq") {
        const opts = q.options || [];
        const rotated = opts.length >= 4 ? opts.map((_, idx) => opts[(idx + round) % opts.length]) : opts;
        out.push(
          sanitizeQuestion(
            {
              ...q,
              prompt: `Module practice ${round + 1}.${i + 1}: ${q.prompt}`,
              options: rotated,
              tags: q.tags || [q.topic],
            },
            out.length,
            section.id,
          ),
        );
      } else {
        out.push(
          sanitizeQuestion(
            {
              ...q,
              prompt: `Module practice ${round + 1}.${i + 1}: ${q.prompt}`,
              tags: q.tags || [q.topic],
            },
            out.length,
            section.id,
          ),
        );
      }
      if (out.length >= 40) break;
    }
    if (out.length >= 40) break;
  }
  return out.slice(0, 40);
}

export async function buildSectionQuestionBank({
  section,
  language,
  profile,
}: {
  section: Section;
  language: string;
  profile?: Profile;
}): Promise<QuizQuestion[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!apiKey) return fallbackQuestionBank(section);

  const prompt = `Create 40 DISTINCT quiz questions for a coding module.
Language: ${language}
Section: ${section.title}
Section summary: ${section.summary || ""}
Outline: ${(section.outline || []).join(" | ")}
Learner profile:
- knowsSyntax=${Boolean(profile?.knowsSyntax)}
- knowsConditionals=${Boolean(profile?.knowsConditionals)}
- knowsLoops=${Boolean(profile?.knowsLoops)}
- knowsFunctions=${Boolean(profile?.knowsFunctions)}

Rules:
- Exactly 40 questions.
- Mix mcq and short.
- No repeated concept wording.
- Every question must include tags array (1-3 tags).
- mcq must have 4 options and one correct answer exactly matching one option.
- JSON only:
{"questions":[{"type":"mcq|short","prompt":"...","options":["..."],"answer":"...","topic":"...","tags":["..."]}]}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.35,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) return fallbackQuestionBank(section);
  const data = await res.json();
  const raw = String(data.choices?.[0]?.message?.content || "{}");

  try {
    const parsed = JSON.parse(raw);
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
    const sanitized = questions
      .slice(0, 40)
      .map((q: QuizQuestion, idx: number) => sanitizeQuestion(q, idx, section.id))
      .filter((q: QuizQuestion) => q.prompt.length > 0 && q.answer.length > 0);
    if (sanitized.length >= 30) return sanitized.slice(0, 40);
    return fallbackQuestionBank(section);
  } catch {
    return fallbackQuestionBank(section);
  }
}
