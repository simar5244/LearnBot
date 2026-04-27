import { LanguageContent, Profile, Progress } from "@/lib/db";

export function buildAdaptivePlan(language: LanguageContent | undefined, profile: Profile | undefined, progress: Progress | undefined) {
  if (!language) return [];

  const recommendedMinutes = profile?.weeklyHours === "6+" ? 55 : profile?.weeklyHours === "3-5" ? 40 : 28;
  const confidenceMode = profile?.confidenceLevel === "low" ? "extra-coaching" : profile?.confidenceLevel === "high" ? "fast-feedback" : "steady";

  return language.sections.map((section, index) => {
    const status = index < (progress?.currentSectionIndex || 0)
      ? "completed"
      : index === (progress?.currentSectionIndex || 0)
        ? "current"
        : "up-next";

    const outline = [...section.outline];
    if (profile?.preferExamples && section.phase !== "project") {
      outline.unshift("You will start from a worked example before you modify it yourself.");
    }
    if (profile?.knowsLoops && section.id === "loop-patterns") {
      outline.unshift("Your path skips loop basics and starts at deeper repetition patterns.");
    }
    if (profile?.knowsFunctions && section.id === "function-design") {
      outline.unshift("Your path assumes function syntax is familiar and goes straight into design choices.");
    }
    if (profile?.learningGoal) {
      outline.push(`Why this matters for your goal: ${profile.learningGoal}`);
    }

    return {
      ...section,
      order: index + 1,
      adaptiveOutline: outline,
      status,
      adaptiveMeta: {
        recommendedMinutes,
        confidenceMode,
        isProject: section.phase === "project",
      },
    };
  });
}

