import { Redis } from "@upstash/redis";
import { DEFAULT_LANGUAGES } from "@/lib/curriculum";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: string;
};

export type Profile = {
  userId: string;
  preferredLanguage: string;
  startFromScratch: boolean;
  knowsSyntax: boolean;
  knowsLoops: boolean;
  confidenceLevel: "low" | "medium" | "high";
  weeklyHours: "1-2" | "3-5" | "6+";
  learningGoal: string;
  preferExamples: boolean;
  knowsConditionals?: boolean;
  knowsFunctions?: boolean;
};

export type Progress = {
  userId: string;
  language: string;
  currentSectionIndex: number;
  currentVideoIndex: number;
  completedSections: string[];
  mistakesByTopic: Record<string, number>;
  quizScores: number[];
  weakSelfReport: string;
  failedAttemptsInSection: number;
  examAttempts: number;
  examPassed: boolean;
  examScores: number[];
  seenQuestionIdsBySection?: Record<string, string[]>;
  activeQuizQuestionIds?: string[];
  remediationVideoIdsByTopic?: Record<string, string>;
  dynamicQuestionBankBySection?: Record<string, QuizQuestion[]>;
  wrongTagCounts?: Record<string, number>;
};

export type Video = {
  title: string;
  embedUrl: string;
};

export type QuizQuestion = {
  id: string;
  type: "mcq" | "short";
  prompt: string;
  options?: string[];
  answer: string;
  topic: string;
  tags?: string[];
};

export type Section = {
  id: string;
  title: string;
  summary?: string;
  goal?: string;
  phase?: "foundation" | "build" | "accelerate" | "project";
  outline: string[];
  nextSteps?: string[];
  videos: Video[];
  quiz: QuizQuestion[];
};

export type LanguageContent = {
  id: string;
  name: string;
  level: "beginner" | "advanced";
  sections: Section[];
  exam: QuizQuestion[];
};

export type DB = {
  users: User[];
  sessions: Session[];
  profiles: Profile[];
  progress: Progress[];
  content: {
    languages: LanguageContent[];
  };
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function loadDB(): Promise<DB> {
  const usersJson = await redis.get("users");
  const sessionsJson = await redis.get("sessions");
  const profilesJson = await redis.get("profiles");
  const progressJson = await redis.get("progress");

  const db: DB = {
    users: (usersJson as User[]) || [],
    sessions: (sessionsJson as Session[]) || [],
    profiles: (profilesJson as Profile[]) || [],
    progress: (progressJson as Progress[]) || [],
    content: { languages: DEFAULT_LANGUAGES },
  };

  return db;
}

export async function saveDB(db: DB): Promise<void> {
  await redis.set("users", db.users);
  await redis.set("sessions", db.sessions);
  await redis.set("profiles", db.profiles);
  await redis.set("progress", db.progress);
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function newId(prefix: string): string {
  return prefix + "_" + Math.random().toString(36).slice(2, 10);
}
