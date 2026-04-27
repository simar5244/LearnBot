import { Progress, QuizQuestion } from "@/lib/db";

function mcq(id: string, prompt: string, options: string[], answer: string, topic: string): QuizQuestion {
  return { id, type: "mcq", prompt, options, answer, topic };
}

function repeatWithTransforms(prefix: string, topic: string, seeds: Array<{ stem: string; a: string; b: string; c: string; d: string; ans: string }>): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < seeds.length; i += 1) {
    const seed = seeds[i];
    out.push(mcq(`${prefix}_${i * 4 + 1}`, `${seed.stem} (concept check)`, [seed.a, seed.b, seed.c, seed.d], seed.ans, topic));
    out.push(mcq(`${prefix}_${i * 4 + 2}`, `${seed.stem} (quick quiz)`, [seed.d, seed.b, seed.a, seed.c], seed.ans, topic));
    out.push(mcq(`${prefix}_${i * 4 + 3}`, `${seed.stem} (practice)`, [seed.b, seed.c, seed.d, seed.a], seed.ans, topic));
    out.push(mcq(`${prefix}_${i * 4 + 4}`, `${seed.stem} (review)`, [seed.c, seed.a, seed.b, seed.d], seed.ans, topic));
  }
  return out;
}

function pythonSectionBank(sectionId: string): QuizQuestion[] {
  if (sectionId === "syntax") {
    const seeds = [
      { stem: "How do you print text in Python", a: "print(\"Hi\")", b: "System.out.println(\"Hi\");", c: "console.log(\"Hi\")", d: "echo \"Hi\"", ans: "print(\"Hi\")" },
      { stem: "Which symbol is used for equality check", a: "==", b: "=", c: ":=", d: "=>", ans: "==" },
      { stem: "What defines block structure in Python", a: "indentation", b: "semicolons", c: "braces", d: "tabs only", ans: "indentation" },
      { stem: "input() returns which type by default", a: "str", b: "int", c: "float", d: "bool", ans: "str" },
      { stem: "Which line declares variable x with value 7", a: "x = 7", b: "int x = 7", c: "x := 7", d: "let x = 7", ans: "x = 7" },
      { stem: "Which keyword starts condition", a: "if", b: "for", c: "def", d: "class", ans: "if" },
      { stem: "Which type is 3.14", a: "float", b: "int", c: "str", d: "bool", ans: "float" },
      { stem: "Which conversion turns text into number", a: "int(\"12\")", b: "str(12)", c: "bool(12)", d: "float(\"x\")", ans: "int(\"12\")" },
      { stem: "Which branch keyword is used when if is false", a: "else", b: "elif", c: "while", d: "case", ans: "else" },
      { stem: "Which literal is boolean", a: "True", b: "\"True\"", c: "1", d: "truth", ans: "True" },
    ];
    return repeatWithTransforms("py_syn", "syntax", seeds);
  }

  if (sectionId === "loops") {
    const seeds = [
      { stem: "Which keyword starts counted loops", a: "for", b: "loop", c: "iterate", d: "repeat", ans: "for" },
      { stem: "range(3) produces", a: "0,1,2", b: "1,2,3", c: "0,1,2,3", d: "3,2,1", ans: "0,1,2" },
      { stem: "Condition controlled loop keyword", a: "while", b: "for", c: "if", d: "def", ans: "while" },
      { stem: "Keyword to stop loop immediately", a: "break", b: "continue", c: "pass", d: "next", ans: "break" },
      { stem: "Keyword to skip to next iteration", a: "continue", b: "break", c: "pass", d: "skip", ans: "continue" },
      { stem: "Common infinite loop cause", a: "not updating variable", b: "using range", c: "using print", d: "using int", ans: "not updating variable" },
      { stem: "for i in range(1,4) runs how many times", a: "3", b: "2", c: "4", d: "1", ans: "3" },
      { stem: "Do nothing statement", a: "pass", b: "skip", c: "none", d: "continue", ans: "pass" },
      { stem: "Best way to trace loop bugs", a: "print counter each iteration", b: "remove condition", c: "delete loop", d: "skip tests", ans: "print counter each iteration" },
      { stem: "Nested loop means", a: "loop inside another loop", b: "two conditions", c: "if inside function", d: "loop without range", ans: "loop inside another loop" },
    ];
    return repeatWithTransforms("py_loop", "loops", seeds);
  }

  const seeds = [
    { stem: "Keyword to define function", a: "def", b: "func", c: "method", d: "lambda", ans: "def" },
    { stem: "Purpose of return", a: "send value to caller", b: "print result", c: "start loop", d: "stop Python", ans: "send value to caller" },
    { stem: "Valid header example", a: "def add(a, b):", b: "function add(a,b)", c: "int add(a,b)", d: "add def(a,b):", ans: "def add(a, b):" },
    { stem: "Parameters are", a: "inputs of a function", b: "outputs only", c: "comments", d: "file names", ans: "inputs of a function" },
    { stem: "Scope means", a: "where variable can be used", b: "loop speed", c: "function name", d: "output formatting", ans: "where variable can be used" },
    { stem: "No return defaults to", a: "None", b: "0", c: "False", d: "error", ans: "None" },
    { stem: "Good reason for functions", a: "reuse logic", b: "avoid variables", c: "avoid conditions", d: "replace loops", ans: "reuse logic" },
    { stem: "Function call example", a: "add(2, 3)", b: "add = (2,3)", c: "call add(2,3)", d: "add[2,3]", ans: "add(2, 3)" },
    { stem: "Local variable lives", a: "inside function scope", b: "everywhere", c: "in database", d: "across files", ans: "inside function scope" },
    { stem: "Docstring is used to", a: "describe function", b: "run function", c: "declare loop", d: "return value", ans: "describe function" },
  ];
  return repeatWithTransforms("py_fun", "functions", seeds);
}

function javaSectionBank(sectionId: string): QuizQuestion[] {
  const bank = pythonSectionBank(sectionId).map((q) => {
    const prompt = q.prompt
      .replaceAll("Python", "Java")
      .replaceAll("def", "method")
      .replaceAll("print(\"Hi\")", "System.out.println(\"Hi\");")
      .replaceAll("input()", "Scanner.nextLine()")
      .replaceAll("None", "null");
    return { ...q, id: q.id.replace("py_", "ja_"), prompt };
  });

  return bank.map((q) => {
    if (sectionId === "syntax" && q.prompt.includes("print text")) {
      return { ...q, answer: "System.out.println(\"Hi\");", options: ["System.out.println(\"Hi\");", "print(\"Hi\")", "console.log(\"Hi\")", "echo \"Hi\""] };
    }
    if (sectionId === "functions" && q.prompt.includes("Keyword to define")) {
      return { ...q, answer: "method", options: ["method", "def", "function", "lambda"] };
    }
    if (sectionId === "functions" && q.prompt.includes("No return defaults to")) {
      return { ...q, answer: "null", options: ["null", "0", "False", "error"] };
    }
    return q;
  });
}

function getSectionBank(languageId: string, sectionId: string): QuizQuestion[] {
  if (languageId === "java") return javaSectionBank(sectionId);
  return pythonSectionBank(sectionId);
}

export function buildSectionQuiz({
  languageId,
  sectionId,
  progress,
}: {
  languageId: string;
  sectionId: string;
  progress?: Progress | null;
}): { selected: QuizQuestion[]; bankSize: number; usedCount: number } {
  const bank = getSectionBank(languageId, sectionId);
  const seen = progress?.seenQuestionIdsBySection?.[sectionId] || [];
  const unseen = bank.filter((q) => !seen.includes(q.id));

  let selected: QuizQuestion[];
  if (unseen.length >= 10) {
    selected = unseen.slice(0, 10);
  } else {
    const topUp = bank.filter((q) => seen.includes(q.id)).slice(0, 10 - unseen.length);
    selected = [...unseen, ...topUp];
  }

  return { selected, bankSize: bank.length, usedCount: seen.length };
}
