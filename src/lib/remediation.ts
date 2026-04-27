import type { Profile, Progress, QuizQuestion } from "@/lib/db";
import { buildLanguageTrack } from "@/lib/curriculum";

type TopicPack = {
  topic: string;
  guidance: string;
  lessonText: string[];
  video: { title: string; embedUrl: string };
  quiz: QuizQuestion[];
};

const TOPIC_VIDEO_BY_KEY: Record<string, string> = {
  syntax: "kqtD5dpn9C8",
  variables: "ohCDWZgNIU0",
  conditions: "Zp5MuPOtsSY",
  loops: "6iF8Xb7Z3wQ",
  control: "6iF8Xb7Z3wQ",
  collections: "CBTBLS6L8E8",
  functions: "9Os0o3wzS_I",
  return: "9Os0o3wzS_I",
  scope: "9Os0o3wzS_I",
  debugging: "W8KRzm-HUcc",
  input: "RqvCNb7fKsg",
  arrays: "ohCDWZgNIU0",
  strings: "ohCDWZgNIU0",
  objects: "9Os0o3wzS_I",
  recursion: "6iF8Xb7Z3wQ",
  classes: "9Os0o3wzS_I",
  oop: "9Os0o3wzS_I",
  exceptions: "W8KRzm-HUcc",
  maps: "ohCDWZgNIU0",
  sets: "ohCDWZgNIU0",
};

const VIDEO_POOL = [
  "kqtD5dpn9C8",
  "ohCDWZgNIU0",
  "Zp5MuPOtsSY",
  "6iF8Xb7Z3wQ",
  "9Os0o3wzS_I",
  "W8KRzm-HUcc",
  "RqvCNb7fKsg",
  "eIrMbAQSU34",
  "xk4_1vDrzzo",
  "vr5dCRHAgb0",
  "1OpAgZvYXLQ",
  "HVjjoMvutj4",
  "4XTsAAHW_Tc",
  "wAEPokhj5Q4",
  "GoXwIVyNvX0",
  "A74TOX803D0",
  "UmnCZ7-9yDY",
  "2dZiMBwX_5Q",
  "NBIUbTddde4",
  "om59cwR7psI",
];
const videoActiveCache = new Map<string, boolean>();

function normalizeTopicKey(topic: string): string {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ")[0] || "syntax";
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function decodeDuckRedirect(url: string): string {
  try {
    const parsed = new URL(url, "https://duckduckgo.com");
    if (parsed.pathname === "/l/" && parsed.searchParams.get("uddg")) {
      return decodeURIComponent(parsed.searchParams.get("uddg") || "");
    }
    return url;
  } catch {
    return url;
  }
}

function youtubeIdFromUrl(url: string): string | null {
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch?.[1]) return watch[1];
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short?.[1]) return short[1];
  return null;
}

async function searchYouTubeId(topic: string, language: string): Promise<string | null> {
  try {
    const query = `${language} ${topic} tutorial site:youtube.com/watch`;
    const res = await fetch(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const html = await res.text();
    const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => decodeDuckRedirect(m[1]));
    const hit = links.find((url) => url.includes("youtube.com/watch") || url.includes("youtu.be/"));
    return hit ? youtubeIdFromUrl(hit) : null;
  } catch {
    return null;
  }
}

async function isYouTubeVideoActive(id: string): Promise<boolean> {
  if (!id || id.length !== 11) return false;
  const cached = videoActiveCache.get(id);
  if (cached !== undefined) return cached;
  try {
    const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
    const res = await fetch(oembed, { cache: "no-store" });
    const ok = res.ok;
    videoActiveCache.set(id, ok);
    return ok;
  } catch {
    videoActiveCache.set(id, false);
    return false;
  }
}

async function pickDistinctVideo(topic: string, language: string, usedIds: Set<string>): Promise<{ id: string; embedUrl: string; title: string }> {
  const searched = await searchYouTubeId(topic, language);
  if (searched && !usedIds.has(searched) && await isYouTubeVideoActive(searched)) {
    usedIds.add(searched);
    return {
      id: searched,
      embedUrl: `https://www.youtube.com/embed/${searched}`,
      title: `${language} ${topic} deep dive`,
    };
  }

  const key = normalizeTopicKey(topic);
  const mapped = TOPIC_VIDEO_BY_KEY[key];
  if (mapped && !usedIds.has(mapped) && await isYouTubeVideoActive(mapped)) {
    usedIds.add(mapped);
    return {
      id: mapped,
      embedUrl: `https://www.youtube.com/embed/${mapped}`,
      title: `${language} ${topic} targeted walkthrough`,
    };
  }

  const start = hashString(`${language}:${topic}`) % VIDEO_POOL.length;
  for (let i = 0; i < VIDEO_POOL.length; i += 1) {
    const candidate = VIDEO_POOL[(start + i) % VIDEO_POOL.length];
    if (!usedIds.has(candidate) && await isYouTubeVideoActive(candidate)) {
      usedIds.add(candidate);
      return {
        id: candidate,
        embedUrl: `https://www.youtube.com/embed/${candidate}`,
        title: `${language} ${topic} focused lesson`,
      };
    }
  }

  const fallback = VIDEO_POOL.find((id) => !usedIds.has(id)) || VIDEO_POOL[start];
  return {
    id: fallback,
    embedUrl: `https://www.youtube.com/embed/${fallback}`,
    title: `${language} ${topic} focused lesson`,
  };
}

function buildDeepLessonText(topic: string, language: string): string[] {
  const text: string[] = [];
  const key = normalizeTopicKey(topic);
  const contexts = ["tiny script", "algorithm exercise", "API handler", "debug session", "pair-programming review"];
  const checks = ["state trace", "boundary test", "expected output table", "counter-example", "failure log"];
  const actions = ["read", "trace", "predict", "run", "compare", "fix", "retest", "explain"];
  const pitfalls = [
    "assuming defaults without checking runtime values",
    "changing multiple things at once and losing the cause",
    "skipping edge cases for empty and single-item inputs",
    "confusing data transformation with data mutation",
    "trusting intuition instead of verifying behavior line by line",
  ];

  for (let i = 1; i <= 84; i += 1) {
    const context = contexts[i % contexts.length];
    const check = checks[i % checks.length];
    const action = actions[i % actions.length];
    const pitfall = pitfalls[i % pitfalls.length];
    const lineNo = String(i).padStart(2, "0");

    if (i % 6 === 1) {
      text.push(`${lineNo}. In ${language}, ${topic} should feel controllable: start with a ${context}, isolate one rule, and define what correct behavior looks like before writing more code.`);
      continue;
    }
    if (i % 6 === 2) {
      text.push(`${lineNo}. Run a ${check} for ${key}: list the input, expected output, and one wrong output you often produce, then state why that wrong output happens.`);
      continue;
    }
    if (i % 6 === 3) {
      text.push(`${lineNo}. Use the ${action} cycle for ${topic}: read the prompt, trace values, predict output, execute, compare, and only then change one line.`);
      continue;
    }
    if (i % 6 === 4) {
      text.push(`${lineNo}. Main pitfall in ${topic}: ${pitfall}. Prevent this by writing a one-sentence intent comment before each major block and deleting it only after the code passes tests.`);
      continue;
    }
    if (i % 6 === 5) {
      text.push(`${lineNo}. Build fluency drill ${Math.ceil(i / 6)}: solve the same ${topic} task three ways, then explain tradeoffs in readability, correctness, and maintainability.`);
      continue;
    }
    text.push(`${lineNo}. Mastery check for ${topic}: if you can teach this concept out loud, predict failures before running code, and repair bugs quickly, this tag is moving from weak to stable.`);
  }

  return text;
}

function fallbackQuizForTopic(topic: string): QuizQuestion[] {
  const key = normalizeTopicKey(topic);
  const prompts = [
    {
      prompt: `What is the most reliable first step when solving a ${topic} bug?`,
      options: ["Reproduce with a tiny case", "Rewrite everything", "Guess the fix", "Skip to deployment"],
      answer: "Reproduce with a tiny case",
    },
    {
      prompt: `Which practice improves ${topic} accuracy fastest?`,
      options: ["Predict output before running", "Copy code without reading", "Ignore edge cases", "Avoid tests"],
      answer: "Predict output before running",
    },
    {
      prompt: `What should you change between retries on a ${topic} issue?`,
      options: ["One variable at a time", "Everything at once", "Nothing", "Only comments"],
      answer: "One variable at a time",
    },
    {
      prompt: `How do you confirm a ${topic} fix is real?`,
      options: ["Passes normal and edge inputs", "Looks cleaner", "Runs once", "Compiles only"],
      answer: "Passes normal and edge inputs",
    },
    {
      prompt: `What signals weak understanding in ${topic}?`,
      options: ["Cannot explain why output changed", "Writes short code", "Uses functions", "Uses print statements"],
      answer: "Cannot explain why output changed",
    },
    {
      prompt: `Which habit prevents repeated ${topic} mistakes?`,
      options: ["Keep a short failure log", "Delete old attempts", "Avoid review", "Change language weekly"],
      answer: "Keep a short failure log",
    },
    {
      prompt: `What should happen before optimizing ${topic} code?`,
      options: ["Guarantee correctness first", "Micro-optimize immediately", "Remove tests", "Inline everything"],
      answer: "Guarantee correctness first",
    },
    {
      prompt: `What is the safest way to debug ${topic} behavior?`,
      options: ["Trace state transitions", "Assume control flow", "Skip instrumentation", "Only read stack traces"],
      answer: "Trace state transitions",
    },
    {
      prompt: `Which question is best while reviewing ${topic} logic?`,
      options: ["What invariant must stay true?", "How short is this file?", "Can I rename everything?", "Can I avoid tests?"],
      answer: "What invariant must stay true?",
    },
    {
      prompt: `What marks mastery of ${topic}?`,
      options: ["Solve new problems without guessing", "Memorize one solution", "Avoid difficult prompts", "Never refactor"],
      answer: "Solve new problems without guessing",
    },
  ];

  return prompts.map((q, idx) => ({
    id: `fb_${key}_${idx + 1}`,
    type: "mcq",
    prompt: q.prompt,
    options: q.options,
    answer: q.answer,
    topic,
    tags: [topic],
  }));
}

async function generateQuizAndGuide(topic: string, language: string): Promise<{ guidance: string; quiz: QuizQuestion[] }> {
  const groqApiKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  
  // Prefer Groq if available, fallback to OpenAI
  const apiKey = groqApiKey || openaiKey;
  const model = process.env.GROQ_MODEL || process.env.OPENAI_MODEL || "llama-3.3-70b-versatile";
  const apiUrl = groqApiKey ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
  
  if (!apiKey) {
    return {
      guidance: `Focus on ${topic} in ${language}: run short drills, verify state transitions, and explain every correction in your own words.`,
      quiz: fallbackQuizForTopic(topic),
    };
  }

  const prompt = `You are a strict coding tutor. Topic tag: ${topic}. Language: ${language}.
Return JSON with:
{
  "guidance": "short targeted explanation for this weak topic",
  "quiz": [
    {"id":"q1","type":"mcq","prompt":"...", "options":["...","...","...","..."], "answer":"...", "topic":"${topic}", "tags":["${topic}"]},
    {"id":"q2","type":"mcq","prompt":"...", "options":["...","...","...","..."], "answer":"...", "topic":"${topic}", "tags":["${topic}"]},
    {"id":"q3","type":"short","prompt":"...", "answer":"...", "topic":"${topic}", "tags":["${topic}"]}
  ]
}
Give 10 distinct questions. No markdown.`;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.45,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) return { guidance: `Reinforce ${topic} with focused reps and explanation-first review.`, quiz: fallbackQuizForTopic(topic) };
    const data = await res.json();
    const raw = String(data.choices?.[0]?.message?.content || "{}");
    const parsed = JSON.parse(raw);
    const quiz = Array.isArray(parsed.quiz) ? parsed.quiz.slice(0, 10) : [];
    if (quiz.length < 8) {
      return { guidance: String(parsed.guidance || ""), quiz: fallbackQuizForTopic(topic) };
    }
    return { guidance: String(parsed.guidance || ""), quiz };
  } catch {
    return { guidance: `Reinforce ${topic} with focused reps and explanation-first review.`, quiz: fallbackQuizForTopic(topic) };
  }
}

export async function buildRemediationPack(profile: Profile | undefined, progress: Progress | undefined): Promise<TopicPack[]> {
  if (!progress) return [];
  const tagEntries = Object.entries(progress.wrongTagCounts || {}).sort((a, b) => b[1] - a[1]);
  const selectedTopics = (tagEntries.length > 0 ? tagEntries : Object.entries(progress.mistakesByTopic || {}))
    .slice(0, 8)
    .map(([topic]) => topic);
  const language = profile?.preferredLanguage || progress.language || "python";

  if (selectedTopics.length === 0) {
    const track = buildLanguageTrack(language, profile);
    const sectionIndex = Math.min(progress.currentSectionIndex || 0, Math.max(track.sections.length - 1, 0));
    const section = track.sections[sectionIndex];
    const topicFallback = Array.from(
      new Set((section?.quiz || []).map((q) => String(q.topic || "").trim().toLowerCase()).filter(Boolean)),
    ).slice(0, 4);
    if (topicFallback.length > 0) {
      selectedTopics.push(...topicFallback);
    } else {
      selectedTopics.push("syntax", "loops", "functions", "debugging");
    }
  }

  const usedVideoIds = new Set<string>();
  const packs: TopicPack[] = [];

  for (const topic of selectedTopics) {
    try {
      const [ai, video] = await Promise.all([
        generateQuizAndGuide(topic, language),
        pickDistinctVideo(topic, language, usedVideoIds),
      ]);
      const lessonText = buildDeepLessonText(topic, language);

      progress.remediationVideoIdsByTopic = progress.remediationVideoIdsByTopic || {};
      progress.remediationVideoIdsByTopic[topic] = video.id;

      packs.push({
        topic,
        guidance: ai.guidance,
        lessonText,
        video: { title: video.title, embedUrl: video.embedUrl },
        quiz: ai.quiz.map((q: QuizQuestion, idx: number) => ({
          ...q,
          id: `rem_${topic}_${idx + 1}`,
          topic,
        })),
      });
    } catch {
      const fallbackVideo = await pickDistinctVideo(topic, language, usedVideoIds);
      packs.push({
        topic,
        guidance: `Focus on ${topic} with short reps and targeted corrections.`,
        lessonText: buildDeepLessonText(topic, language),
        video: { title: fallbackVideo.title, embedUrl: fallbackVideo.embedUrl },
        quiz: fallbackQuizForTopic(topic).map((q, idx) => ({
          ...q,
          id: `rem_${topic}_${idx + 1}`,
          topic,
        })),
      });
    }
  }

  return packs;
}
