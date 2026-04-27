import { LanguageContent, Profile, QuizQuestion, Section, Video } from "@/lib/db";

type SupportedLanguage = "python" | "java";
type Level = "beginner" | "advanced";

type QuizSeed = {
  stem: string;
  options: [string, string, string, string];
  answer: string;
  topic: string;
};

type ModuleSeed = {
  id: string;
  title: string;
  summary: string;
  goal: string;
  phase: Section["phase"];
  outline: string[];
  nextSteps: string[];
  quizSeeds: QuizSeed[];
  shortChecks: Array<{ prompt: string; answer: string; topic: string }>;
};

const MODULE_VIDEO_URLS: Record<SupportedLanguage, Record<string, string>> = {
  python: {
    "syntax-basics": "https://www.youtube.com/embed/kqtD5dpn9C8",
    "syntax-bridge": "https://www.youtube.com/embed/ohCDWZgNIU0",
    "conditionals-basics": "https://www.youtube.com/embed/Zp5MuPOtsSY",
    "conditionals-logic": "https://www.youtube.com/embed/Zp5MuPOtsSY",
    "loops-basics": "https://www.youtube.com/embed/6iF8Xb7Z3wQ",
    "loop-patterns": "https://www.youtube.com/embed/W8KRzm-HUcc",
    "data-collections": "https://www.youtube.com/embed/ohCDWZgNIU0",
    "collections-advanced": "https://www.youtube.com/embed/ohCDWZgNIU0",
    "functions-basics": "https://www.youtube.com/embed/9Os0o3wzS_I",
    "function-design": "https://www.youtube.com/embed/9Os0o3wzS_I",
    "debugging-habits": "https://www.youtube.com/embed/W8KRzm-HUcc",
    "problem-decomposition": "https://www.youtube.com/embed/6iF8Xb7Z3wQ",
    "real-world-input": "https://www.youtube.com/embed/RqvCNb7fKsg",
    "state-and-data": "https://www.youtube.com/embed/kqtD5dpn9C8",
    "example-lab": "https://www.youtube.com/embed/kqtD5dpn9C8",
    "confidence-lab": "https://www.youtube.com/embed/ohCDWZgNIU0",
    "speed-lab": "https://www.youtube.com/embed/6iF8Xb7Z3wQ",
    "project-studio": "https://www.youtube.com/embed/9Os0o3wzS_I",
    "refactor-and-review": "https://www.youtube.com/embed/W8KRzm-HUcc",
    "capstone-sprint": "https://www.youtube.com/embed/kqtD5dpn9C8",
  },
  java: {
    "syntax-basics": "https://www.youtube.com/embed/eIrMbAQSU34",
    "syntax-bridge": "https://www.youtube.com/embed/xk4_1vDrzzo",
    "conditionals-basics": "https://www.youtube.com/embed/xk4_1vDrzzo",
    "conditionals-logic": "https://www.youtube.com/embed/xk4_1vDrzzo",
    "loops-basics": "https://www.youtube.com/embed/eIrMbAQSU34",
    "loop-patterns": "https://www.youtube.com/embed/vr5dCRHAgb0",
    "data-collections": "https://www.youtube.com/embed/eIrMbAQSU34",
    "collections-advanced": "https://www.youtube.com/embed/1OpAgZvYXLQ",
    "functions-basics": "https://www.youtube.com/embed/eIrMbAQSU34",
    "function-design": "https://www.youtube.com/embed/1OpAgZvYXLQ",
    "debugging-habits": "https://www.youtube.com/embed/HVjjoMvutj4",
    "problem-decomposition": "https://www.youtube.com/embed/4XTsAAHW_Tc",
    "real-world-input": "https://www.youtube.com/embed/wAEPokhj5Q4",
    "state-and-data": "https://www.youtube.com/embed/eIrMbAQSU34",
    "example-lab": "https://www.youtube.com/embed/GoXwIVyNvX0",
    "confidence-lab": "https://www.youtube.com/embed/A74TOX803D0",
    "speed-lab": "https://www.youtube.com/embed/UmnCZ7-9yDY",
    "project-studio": "https://www.youtube.com/embed/2dZiMBwX_5Q",
    "refactor-and-review": "https://www.youtube.com/embed/NBIUbTddde4",
    "capstone-sprint": "https://www.youtube.com/embed/om59cwR7psI",
  },
};

const PYTHON_MODULES: Record<string, ModuleSeed> = {
  "syntax-basics": {
    id: "syntax-basics",
    title: "Python Setup, Syntax, and First Wins",
    summary: "Start clean: read Python, print output, store values, and stop syntax errors before they snowball.",
    goal: "Leave this lesson able to read and write small Python statements without guessing.",
    phase: "foundation",
    outline: [
      "Read Python line by line and understand indentation",
      "Use variables, strings, numbers, and print output",
      "Run tiny experiments instead of memorizing rules",
      "Fix syntax mistakes using error messages and visual spacing",
    ],
    nextSteps: [
      "You will move into decision making next.",
      "You will start choosing between multiple paths with if and else.",
    ],
    quizSeeds: [
      { stem: "Which line prints text in Python", options: ["print(\"hello\")", "System.out.println(\"hello\");", "console.log(\"hello\")", "echo \"hello\""], answer: "print(\"hello\")", topic: "syntax" },
      { stem: "What defines a block in Python", options: ["indentation", "curly braces", "semicolons", "parentheses"], answer: "indentation", topic: "syntax" },
      { stem: "Which line stores the number seven in x", options: ["x = 7", "int x = 7", "let x = 7", "x := seven"], answer: "x = 7", topic: "variables" },
      { stem: "Which operator checks equality", options: ["==", "=", "!=", ":="], answer: "==", topic: "operators" },
    ],
    shortChecks: [
      { prompt: "Write the Python keyword used to start an alternative branch.", answer: "else", topic: "conditions" },
      { prompt: "Write the Python function used to display output.", answer: "print", topic: "syntax" },
    ],
  },
  "syntax-bridge": {
    id: "syntax-bridge",
    title: "Python Fast Track: Read Code Without Baby Steps",
    summary: "You already know enough to skip the intro. This is a quick diagnostic pass through Python syntax and debugging habits.",
    goal: "Confirm your Python fundamentals and move straight into logic work.",
    phase: "accelerate",
    outline: [
      "Scan existing code and explain what each line does",
      "Spot indentation, type conversion, and comparison mistakes fast",
      "Translate plain English instructions into compact Python",
      "Use syntax review as a warm-up, not the whole lesson",
    ],
    nextSteps: [
      "You will apply the same speed to branching logic next.",
      "The platform will stop reteaching basics you already covered.",
    ],
    quizSeeds: [
      { stem: "Which line compares score to ten without reassigning it", options: ["score == 10", "score = 10", "score := 10", "score => 10"], answer: "score == 10", topic: "operators" },
      { stem: "Which line safely converts input text to a number", options: ["int(input())", "str(input())", "bool(input())", "input(int)"], answer: "int(input())", topic: "types" },
      { stem: "Which statement is most likely a syntax error in Python", options: ["if score > 3", "if score > 3:", "name = \"Ada\"", "print(name)"], answer: "if score > 3", topic: "syntax" },
      { stem: "What is the best first move after a Python syntax error", options: ["read the line and indentation closely", "restart the computer", "delete the file", "skip that line"], answer: "read the line and indentation closely", topic: "debugging" },
    ],
    shortChecks: [
      { prompt: "Write the Python operator used for not equal.", answer: "!=", topic: "operators" },
      { prompt: "Write the Python keyword that starts a branch.", answer: "if", topic: "conditions" },
    ],
  },
  "conditionals-basics": {
    id: "conditionals-basics",
    title: "Branching Logic and Everyday Decisions",
    summary: "Teach the program how to choose: compare values, branch cleanly, and trace why a path ran.",
    goal: "Build confidence writing if, elif, and else without mixing up comparisons and assignments.",
    phase: "foundation",
    outline: [
      "Compare values with boolean expressions",
      "Use if, elif, and else to control flow",
      "Trace branch outcomes with test values",
      "Turn messy nested decisions into readable logic",
    ],
    nextSteps: [
      "You will use these decisions inside loops next.",
      "Control flow becomes more powerful once repetition enters the picture.",
    ],
    quizSeeds: [
      { stem: "Which keyword starts a branch in Python", options: ["if", "for", "def", "while"], answer: "if", topic: "conditions" },
      { stem: "Which branch runs when the first condition is false", options: ["else", "return", "continue", "break"], answer: "else", topic: "conditions" },
      { stem: "Which expression checks whether age is at least eighteen", options: ["age >= 18", "age = 18", "age => 18", "age <> 18"], answer: "age >= 18", topic: "operators" },
      { stem: "What is the best way to test a new branch", options: ["try values that hit every path", "only test one value", "skip the else branch", "remove comparisons"], answer: "try values that hit every path", topic: "debugging" },
    ],
    shortChecks: [
      { prompt: "Write the Python keyword used for an extra conditional branch between if and else.", answer: "elif", topic: "conditions" },
      { prompt: "Write one Python boolean literal with the correct capitalization.", answer: "True", topic: "types" },
    ],
  },
  "conditionals-logic": {
    id: "conditionals-logic",
    title: "Decision Trees, Not Beginner Branches",
    summary: "Use conditions as strategy tools: validate inputs, chain rules, and make your logic easy to reason about.",
    goal: "Move from simple if statements to deliberate decision making.",
    phase: "accelerate",
    outline: [
      "Refactor multiple conditions into clean readable flows",
      "Guard against impossible states before deeper logic runs",
      "Use boolean combinations without creating spaghetti code",
      "Test branches by predicting outputs before running them",
    ],
    nextSteps: [
      "You will combine this logic with repetition next.",
      "That is where programs start feeling useful instead of toy-sized.",
    ],
    quizSeeds: [
      { stem: "Which operator combines two true-or-false checks in Python", options: ["and", "for", "def", "in"], answer: "and", topic: "conditions" },
      { stem: "What is a good reason to use a guard clause", options: ["stop bad input early", "slow the code down", "avoid variables", "replace every loop"], answer: "stop bad input early", topic: "debugging" },
      { stem: "Which line checks that score is between zero and one hundred", options: ["0 <= score <= 100", "score = 0 and 100", "score in 0:100", "score == 0..100"], answer: "0 <= score <= 100", topic: "operators" },
      { stem: "What makes branching logic easier to debug", options: ["testing one path at a time", "adding random values", "removing print output", "nesting everything deeper"], answer: "testing one path at a time", topic: "debugging" },
    ],
    shortChecks: [
      { prompt: "Write the Python boolean operator used when both conditions must be true.", answer: "and", topic: "conditions" },
      { prompt: "Write the Python keyword that exits a function early with a value.", answer: "return", topic: "functions" },
    ],
  },
  "loops-basics": {
    id: "loops-basics",
    title: "Loops That Actually Make Sense",
    summary: "Repeat work without getting lost: count, stop, skip, and trace loop state safely.",
    goal: "Understand when to use for and while and avoid infinite-loop chaos.",
    phase: "build",
    outline: [
      "Use for loops for known repetition and while loops for changing conditions",
      "Update loop state on purpose instead of by accident",
      "Use break, continue, and range with intention",
      "Debug loop behavior by tracking what changes each iteration",
    ],
    nextSteps: [
      "You will turn repetition into better patterns next.",
      "That includes nested loops, counting strategies, and data traversal.",
    ],
    quizSeeds: [
      { stem: "Which keyword starts a counted loop in Python", options: ["for", "loop", "repeat", "iterate"], answer: "for", topic: "loops" },
      { stem: "Which loop keeps running while a condition stays true", options: ["while", "if", "def", "class"], answer: "while", topic: "loops" },
      { stem: "Which keyword exits a loop immediately", options: ["break", "continue", "pass", "stop"], answer: "break", topic: "control" },
      { stem: "What causes many infinite loops", options: ["forgetting to update loop state", "using print", "using numbers", "using range"], answer: "forgetting to update loop state", topic: "debugging" },
    ],
    shortChecks: [
      { prompt: "Write the Python function commonly used to generate numeric loop sequences.", answer: "range", topic: "loops" },
      { prompt: "Write the Python keyword that skips to the next iteration.", answer: "continue", topic: "control" },
    ],
  },
  "loop-patterns": {
    id: "loop-patterns",
    title: "Loop Patterns, Nested Iteration, and Smarter Traversal",
    summary: "You already know loops exist. Now use them to scan, filter, count, and build structure.",
    goal: "Treat loops like tools for solving problems, not just syntax exercises.",
    phase: "accelerate",
    outline: [
      "Use nested loops deliberately without losing track of state",
      "Separate scanning, counting, and transforming patterns",
      "Stop loops at the right time when a goal is already met",
      "Trace two changing variables at once with confidence",
    ],
    nextSteps: [
      "You will connect loops to lists and collections next.",
      "That is where the practice starts feeling like real code work.",
    ],
    quizSeeds: [
      { stem: "What is a nested loop", options: ["a loop inside another loop", "two if statements", "a function without return", "a list without values"], answer: "a loop inside another loop", topic: "loops" },
      { stem: "Which loop control is best when the answer is already found", options: ["break", "continue", "pass", "print"], answer: "break", topic: "control" },
      { stem: "What is the main debugging move for nested loops", options: ["track both loop variables", "remove the condition", "rename print", "skip the outer loop"], answer: "track both loop variables", topic: "debugging" },
      { stem: "Which pattern is best when you want to count matches", options: ["start a counter and update it in the loop", "return immediately", "never use a variable", "replace the loop with input"], answer: "start a counter and update it in the loop", topic: "loops" },
    ],
    shortChecks: [
      { prompt: "Write the Python keyword used to do nothing intentionally in a block.", answer: "pass", topic: "control" },
      { prompt: "Write the Python keyword used for a condition-controlled loop.", answer: "while", topic: "loops" },
    ],
  },
  "data-collections": {
    id: "data-collections",
    title: "Lists, Sequence Thinking, and Data Flow",
    summary: "Use collections as the thing your loops and conditions operate on instead of writing one-off code.",
    goal: "Read, update, and inspect grouped data without getting overwhelmed.",
    phase: "build",
    outline: [
      "Store multiple values in one structure",
      "Access items by position and loop through them cleanly",
      "Build tiny programs around grouped data instead of single values",
      "Watch data change over time with print-based tracing",
    ],
    nextSteps: [
      "You will turn repeated logic into reusable functions next.",
      "That is the jump from scripts to organized code.",
    ],
    quizSeeds: [
      { stem: "Which structure is commonly used to store several ordered values in Python", options: ["list", "branch", "loop", "class"], answer: "list", topic: "collections" },
      { stem: "How do you get the first item of names", options: ["names[0]", "names(0)", "names.first", "first(names)"], answer: "names[0]", topic: "collections" },
      { stem: "What is a common reason to loop through a list", options: ["process every item", "define a function", "create a password", "fix indentation"], answer: "process every item", topic: "collections" },
      { stem: "What helps debug list logic", options: ["print the list before and after changes", "avoid checking values", "delete the loop", "use random indexes"], answer: "print the list before and after changes", topic: "debugging" },
    ],
    shortChecks: [
      { prompt: "Write the Python word for the ordered collection type shown here: [1, 2, 3].", answer: "list", topic: "collections" },
      { prompt: "Write the index of the first item in a Python list.", answer: "0", topic: "collections" },
    ],
  },
  "collections-advanced": {
    id: "collections-advanced",
    title: "Collections Under Pressure",
    summary: "Move beyond simple lists: choose the right traversal pattern, collect results, and keep data mutations predictable.",
    goal: "Handle list-like data as part of real logic, not just as a beginner example.",
    phase: "accelerate",
    outline: [
      "Separate reading from mutating to avoid confusing bugs",
      "Filter, aggregate, and transform data step by step",
      "Choose counters, accumulators, or result lists on purpose",
      "Trace collection state through each pass of a loop",
    ],
    nextSteps: [
      "You will wrap this logic into reusable functions next.",
      "That is where your code starts becoming maintainable.",
    ],
    quizSeeds: [
      { stem: "What is an accumulator used for", options: ["building a running result", "printing only once", "stopping every loop", "naming a file"], answer: "building a running result", topic: "collections" },
      { stem: "What is a safe habit when changing a collection", options: ["inspect before and after the change", "assume the index is correct", "avoid testing", "remove every loop"], answer: "inspect before and after the change", topic: "debugging" },
      { stem: "Which pattern is best for keeping only matching items", options: ["create a result list and append matches", "overwrite the original blindly", "skip every condition", "use break on the first item"], answer: "create a result list and append matches", topic: "collections" },
      { stem: "What should stay clear in collection code", options: ["where data comes from and where it goes", "only the variable names", "only the first item", "the editor theme"], answer: "where data comes from and where it goes", topic: "debugging" },
    ],
    shortChecks: [
      { prompt: "Write the Python method used to add one item to the end of a list.", answer: "append", topic: "collections" },
      { prompt: "Write the Python keyword commonly used to loop through a collection.", answer: "for", topic: "loops" },
    ],
  },
  "functions-basics": {
    id: "functions-basics",
    title: "Functions and Reuse Without Confusion",
    summary: "Package logic into named pieces so your code stops sprawling across one long file.",
    goal: "Write, call, and debug small functions with parameters and returns.",
    phase: "build",
    outline: [
      "Define functions with clear names and single jobs",
      "Pass inputs in and send values back out",
      "Separate data setup from work performed inside the function",
      "Test functions with tiny known examples before larger use",
    ],
    nextSteps: [
      "You will sharpen debugging and problem breakdown next.",
      "That is how you stop getting stuck on medium-sized tasks.",
    ],
    quizSeeds: [
      { stem: "Which keyword defines a function in Python", options: ["def", "func", "method", "loop"], answer: "def", topic: "functions" },
      { stem: "What does return do", options: ["send a value back to the caller", "print automatically", "repeat the function", "create a loop"], answer: "send a value back to the caller", topic: "return" },
      { stem: "What are parameters", options: ["inputs of a function", "outputs only", "error messages", "file paths"], answer: "inputs of a function", topic: "functions" },
      { stem: "What is a good reason to use functions", options: ["reuse logic and improve clarity", "avoid variables forever", "replace every loop", "skip testing"], answer: "reuse logic and improve clarity", topic: "functions" },
    ],
    shortChecks: [
      { prompt: "Write the Python keyword that sends a value out of a function.", answer: "return", topic: "return" },
      { prompt: "Write the function name in this call: greet(\"Sam\")", answer: "greet", topic: "functions" },
    ],
  },
  "function-design": {
    id: "function-design",
    title: "Function Design, Not Just Function Syntax",
    summary: "You know the basics. Now focus on function boundaries, naming, and building small systems from smaller parts.",
    goal: "Write functions that stay readable when the problem gets bigger.",
    phase: "accelerate",
    outline: [
      "Split one messy task into a few purposeful functions",
      "Choose names that explain intent instead of implementation",
      "Keep parameter lists small and meaningful",
      "Use return values to build pipelines of work",
    ],
    nextSteps: [
      "You will debug whole flows next, not isolated lines.",
      "That is the difference between coding and actually shipping something.",
    ],
    quizSeeds: [
      { stem: "What is a strong sign a function is doing too much", options: ["it has multiple unrelated jobs", "it has a name", "it returns a value", "it takes one input"], answer: "it has multiple unrelated jobs", topic: "functions" },
      { stem: "Why return values matter in design", options: ["they let one function feed another", "they remove every variable", "they stop all bugs", "they replace loops"], answer: "they let one function feed another", topic: "return" },
      { stem: "What makes a function name useful", options: ["it clearly states the job", "it is as short as possible", "it avoids verbs", "it matches the file name"], answer: "it clearly states the job", topic: "functions" },
      { stem: "What is the best test for a small function", options: ["call it with known inputs and check the result", "rewrite it from scratch", "only read it silently", "skip edge cases"], answer: "call it with known inputs and check the result", topic: "debugging" },
    ],
    shortChecks: [
      { prompt: "Write the Python keyword used to define a function.", answer: "def", topic: "functions" },
      { prompt: "Write the Python keyword that sends control back to the caller.", answer: "return", topic: "return" },
    ],
  },
  "debugging-habits": {
    id: "debugging-habits",
    title: "Debugging Like a Builder",
    summary: "Get unstuck faster by isolating the failure, making one change at a time, and proving what the code is actually doing.",
    goal: "Replace guessing with a repeatable debugging routine.",
    phase: "build",
    outline: [
      "Turn bugs into small reproducible cases",
      "Use prints, checkpoints, and expected outputs to compare reality against your mental model",
      "Separate syntax problems from logic problems",
      "Track down state changes instead of blaming the whole file",
    ],
    nextSteps: [
      "You will apply these habits to larger multi-step problems next.",
      "That is where most learners usually stall out.",
    ],
    quizSeeds: [
      { stem: "What is the first strong debugging move", options: ["make the problem small enough to reproduce", "rewrite everything", "change five things at once", "guess the answer"], answer: "make the problem small enough to reproduce", topic: "debugging" },
      { stem: "Why compare expected output to actual output", options: ["it shows exactly where your model breaks", "it makes loops faster", "it avoids using variables", "it removes syntax rules"], answer: "it shows exactly where your model breaks", topic: "debugging" },
      { stem: "What should you change while debugging", options: ["one meaningful thing at a time", "everything that looks odd", "only the variable names", "nothing at all"], answer: "one meaningful thing at a time", topic: "debugging" },
      { stem: "What helps most with logic bugs", options: ["tracking the values as they change", "memorizing more syntax", "adding more files", "using longer names only"], answer: "tracking the values as they change", topic: "debugging" },
    ],
    shortChecks: [
      { prompt: "Write one word for a bug you can reproduce on purpose again and again.", answer: "reproducible", topic: "debugging" },
      { prompt: "Write the Python function commonly used for quick value tracing.", answer: "print", topic: "debugging" },
    ],
  },
  "problem-decomposition": {
    id: "problem-decomposition",
    title: "Break Big Problems Into Shippable Chunks",
    summary: "Learn how to stop staring at a blank screen: define the inputs, outputs, states, and tiny solvable steps.",
    goal: "Turn medium tasks into ordered subproblems you can actually finish.",
    phase: "build",
    outline: [
      "Define the result before writing the implementation",
      "List the steps and assign one function or loop to each",
      "Choose what data must persist between steps",
      "Work from a tiny happy path before edge cases",
    ],
    nextSteps: [
      "You will apply this on multi-part exercises next.",
      "From here on out, the platform should feel more like real project work.",
    ],
    quizSeeds: [
      { stem: "What is a good first step on a larger coding task", options: ["define the input and output", "write random code", "avoid planning", "start with edge cases only"], answer: "define the input and output", topic: "planning" },
      { stem: "Why split a problem into parts", options: ["each part becomes testable and manageable", "it removes all bugs", "it avoids loops forever", "it makes names unnecessary"], answer: "each part becomes testable and manageable", topic: "planning" },
      { stem: "What should you build first", options: ["a tiny path that works end to end", "every edge case at once", "the longest function possible", "the final polish"], answer: "a tiny path that works end to end", topic: "planning" },
      { stem: "What helps you not lose state across steps", options: ["choosing clear variables for shared data", "renaming everything constantly", "avoiding return values", "removing input handling"], answer: "choosing clear variables for shared data", topic: "planning" },
    ],
    shortChecks: [
      { prompt: "Write the programming term for the information a function receives.", answer: "input", topic: "planning" },
      { prompt: "Write the programming term for the result a program produces.", answer: "output", topic: "planning" },
    ],
  },
  "real-world-input": {
    id: "real-world-input",
    title: "User Input, Validation, and Real Program Flow",
    summary: "Make the app respond to real inputs instead of fixed toy values.",
    goal: "Handle user data safely and keep the program stable when inputs are messy.",
    phase: "build",
    outline: [
      "Read inputs and convert them intentionally",
      "Validate before you trust the value",
      "Guide the user with clear output and useful errors",
      "Keep data flow readable from input to decision to result",
    ],
    nextSteps: [
      "You will use these habits in a mini project next.",
      "That is where the platform starts feeling practical.",
    ],
    quizSeeds: [
      { stem: "Why validate user input", options: ["to prevent bad data from breaking logic", "to avoid using conditions", "to replace loops", "to make output shorter"], answer: "to prevent bad data from breaking logic", topic: "input" },
      { stem: "What should happen after reading text that should be a number", options: ["convert it before math", "compare it as text forever", "delete the variable", "skip every check"], answer: "convert it before math", topic: "types" },
      { stem: "What is good output after invalid input", options: ["a clear message about what went wrong", "silence", "a random number", "closing the app"], answer: "a clear message about what went wrong", topic: "input" },
      { stem: "Where should validation happen", options: ["before deeper logic depends on the value", "after the app finishes", "only in comments", "only after a loop"], answer: "before deeper logic depends on the value", topic: "debugging" },
    ],
    shortChecks: [
      { prompt: "Write the Python function used to read text input from a user.", answer: "input", topic: "input" },
      { prompt: "Write the Python function used to convert text to an integer.", answer: "int", topic: "types" },
    ],
  },
  "state-and-data": {
    id: "state-and-data",
    title: "State, Data Flow, and Multi-Step Program Thinking",
    summary: "Understand what changes, what stays stable, and how data moves across a bigger feature.",
    goal: "Track state deliberately so larger exercises stay understandable.",
    phase: "accelerate",
    outline: [
      "Separate current state from derived results",
      "Update data in predictable places",
      "Avoid hidden changes that make debugging miserable",
      "Explain the flow of data from one function to the next",
    ],
    nextSteps: [
      "You will build on this in project work next.",
      "The next lessons lean into product-style thinking.",
    ],
    quizSeeds: [
      { stem: "What is state in a program", options: ["data that can change while the program runs", "the file name only", "the editor theme", "just the function name"], answer: "data that can change while the program runs", topic: "state" },
      { stem: "Why keep state updates predictable", options: ["it makes bugs easier to trace", "it removes all loops", "it avoids return values", "it stops syntax rules"], answer: "it makes bugs easier to trace", topic: "debugging" },
      { stem: "What is derived data", options: ["a value calculated from existing state", "raw user input only", "a syntax error", "a loop variable only"], answer: "a value calculated from existing state", topic: "state" },
      { stem: "What improves data flow clarity", options: ["knowing where each value comes from and goes next", "using more globals everywhere", "changing names randomly", "avoiding helper functions"], answer: "knowing where each value comes from and goes next", topic: "state" },
    ],
    shortChecks: [
      { prompt: "Write one word for data that can change over time in a program.", answer: "state", topic: "state" },
      { prompt: "Write the Python keyword used to send a value from one function to another caller.", answer: "return", topic: "return" },
    ],
  },
  "example-lab": {
    id: "example-lab",
    title: "Worked Examples and Copy-Then-Modify Practice",
    summary: "Since you learn best from examples, this lesson starts with a working pattern and then makes you adapt it.",
    goal: "Move from imitation to understanding without getting stuck in blank-page mode.",
    phase: "build",
    outline: [
      "Read a complete solution and label each part of it",
      "Modify one piece at a time and predict the effect",
      "Extract the reusable pattern from the example",
      "Build a sibling problem using the same structure",
    ],
    nextSteps: [
      "You will apply the same pattern inside the project lesson next.",
      "This keeps momentum high while still building independence.",
    ],
    quizSeeds: [
      { stem: "What is the best first move when studying a worked example", options: ["explain each part in your own words", "memorize it silently", "skip the output", "rename everything immediately"], answer: "explain each part in your own words", topic: "examples" },
      { stem: "Why change one part of an example at a time", options: ["so you can see what each piece affects", "to make it slower for no reason", "to avoid learning the pattern", "to remove testing"], answer: "so you can see what each piece affects", topic: "examples" },
      { stem: "What turns copying into learning", options: ["predicting and testing your modifications", "typing faster", "using shorter names", "avoiding questions"], answer: "predicting and testing your modifications", topic: "examples" },
      { stem: "What should you extract from a good example", options: ["the reusable pattern behind it", "only the exact words", "only the colors", "only the comments"], answer: "the reusable pattern behind it", topic: "examples" },
    ],
    shortChecks: [
      { prompt: "Write one word for the repeatable structure you learn from several examples.", answer: "pattern", topic: "examples" },
      { prompt: "Write the Python function commonly used to inspect changing results while modifying an example.", answer: "print", topic: "examples" },
    ],
  },
  "confidence-lab": {
    id: "confidence-lab",
    title: "Confidence Rebuild and Short Win Loops",
    summary: "If confidence is low, this lesson deliberately stacks small wins before ramping difficulty back up.",
    goal: "Replace hesitation with a repeatable rhythm: read, predict, run, explain.",
    phase: "build",
    outline: [
      "Start with shorter tasks you can finish cleanly",
      "Say what you expect before running the code",
      "Use tiny corrections instead of dramatic rewrites",
      "Bank a few wins before moving to heavier logic again",
    ],
    nextSteps: [
      "You will bring that steadier pace into project work next.",
      "The goal is momentum without fake difficulty spikes.",
    ],
    quizSeeds: [
      { stem: "What is a good move when confidence is low", options: ["solve a smaller version first", "jump to the hardest problem", "avoid running code", "change everything at once"], answer: "solve a smaller version first", topic: "confidence" },
      { stem: "Why predict output before running code", options: ["it strengthens your mental model", "it makes code shorter", "it removes bugs forever", "it replaces functions"], answer: "it strengthens your mental model", topic: "confidence" },
      { stem: "What kind of edits help when rebuilding confidence", options: ["small deliberate changes", "random rewrites", "deleting all conditions", "renaming everything"], answer: "small deliberate changes", topic: "confidence" },
      { stem: "What creates momentum", options: ["a few clear wins in a row", "one giant leap with no testing", "reading without doing", "skipping feedback"], answer: "a few clear wins in a row", topic: "confidence" },
    ],
    shortChecks: [
      { prompt: "Write one word for the result you expect a program to show after running.", answer: "output", topic: "confidence" },
      { prompt: "Write the Python function often used to check whether your prediction was right.", answer: "print", topic: "confidence" },
    ],
  },
  "speed-lab": {
    id: "speed-lab",
    title: "Fast Track Sprint and Higher Volume Practice",
    summary: "You have more weekly time, so this lesson increases problem volume and expects quicker pattern recognition.",
    goal: "Convert time availability into faster skill consolidation, not sloppy rushing.",
    phase: "accelerate",
    outline: [
      "Cycle through multiple short drills that hit the same pattern",
      "Compare two solution strategies and pick the cleaner one",
      "Keep quality high while shortening time-to-first-solution",
      "Use review passes to catch the speed mistakes you introduce",
    ],
    nextSteps: [
      "You will use this pace in the project build next.",
      "More time means we can ask for more reps without padding the curriculum.",
    ],
    quizSeeds: [
      { stem: "What keeps fast practice useful", options: ["reviewing mistakes before repeating the drill", "moving on without checking", "writing longer names only", "avoiding functions"], answer: "reviewing mistakes before repeating the drill", topic: "practice" },
      { stem: "What should speed never replace", options: ["clear thinking and verification", "loops", "variables", "output"], answer: "clear thinking and verification", topic: "practice" },
      { stem: "Why compare two solutions", options: ["to choose the cleaner and clearer one", "to slow the app down", "to avoid finishing", "to replace every condition"], answer: "to choose the cleaner and clearer one", topic: "practice" },
      { stem: "What improves time-to-first-solution", options: ["recognizing the pattern sooner", "skipping planning forever", "avoiding tests", "rewriting finished code"], answer: "recognizing the pattern sooner", topic: "practice" },
    ],
    shortChecks: [
      { prompt: "Write one word for a short focused practice repetition.", answer: "drill", topic: "practice" },
      { prompt: "Write the Python keyword used to define a reusable function for repeated drills.", answer: "def", topic: "functions" },
    ],
  },
  "project-studio": {
    id: "project-studio",
    title: "Project Studio: Build Something That Feels Real",
    summary: "Pull the concepts together in a guided mini-project instead of another isolated concept drill.",
    goal: "Ship a small but complete program with input, logic, state, and output.",
    phase: "project",
    outline: [
      "Plan the feature in tiny slices before writing code",
      "Implement one working path, then expand the feature safely",
      "Use functions, loops, and validation where they naturally belong",
      "Review behavior from a user perspective, not just line by line",
    ],
    nextSteps: [
      "You will polish and refactor the project next.",
      "That final pass is where good habits start to stick.",
    ],
    quizSeeds: [
      { stem: "What should exist before adding polish to a project", options: ["one working end-to-end flow", "all edge cases only", "perfect styling", "no inputs"], answer: "one working end-to-end flow", topic: "projects" },
      { stem: "Why build features in slices", options: ["each slice is easier to test and debug", "it makes names longer", "it removes the need for functions", "it avoids user input"], answer: "each slice is easier to test and debug", topic: "projects" },
      { stem: "What makes a mini project useful for learning", options: ["it combines several ideas in one real task", "it repeats one keyword only", "it removes all uncertainty", "it guarantees zero bugs"], answer: "it combines several ideas in one real task", topic: "projects" },
      { stem: "What should you review after a feature works", options: ["whether the user flow feels clear", "only the file name", "only the first line", "nothing else"], answer: "whether the user flow feels clear", topic: "projects" },
    ],
    shortChecks: [
      { prompt: "Write one word for the smallest usable chunk of a feature you can build and test.", answer: "slice", topic: "projects" },
      { prompt: "Write the Python keyword used for a branch that handles alternative user paths.", answer: "else", topic: "projects" },
    ],
  },
  "refactor-and-review": {
    id: "refactor-and-review",
    title: "Refactor, Review, and Raise the Quality Bar",
    summary: "Make working code better: clarify names, split logic, and remove accidental complexity.",
    goal: "Learn what quality improvement looks like after the first working version exists.",
    phase: "project",
    outline: [
      "Improve readability without changing behavior",
      "Split overstuffed logic into smaller pieces",
      "Rename variables and functions so intent is obvious",
      "Review code like a teammate will need to read it tomorrow",
    ],
    nextSteps: [
      "You will finish with a capstone sprint next.",
      "That final lesson asks you to make more of your own decisions.",
    ],
    quizSeeds: [
      { stem: "What is refactoring", options: ["improving code structure without changing behavior", "adding random features", "deleting all functions", "changing the output on purpose"], answer: "improving code structure without changing behavior", topic: "refactoring" },
      { stem: "Why rename unclear variables", options: ["to make intent easier to read", "to make the code run faster automatically", "to avoid testing", "to remove returns"], answer: "to make intent easier to read", topic: "refactoring" },
      { stem: "What should trigger splitting a function", options: ["it is doing too many unrelated jobs", "it has one parameter", "it returns a value", "it uses print"], answer: "it is doing too many unrelated jobs", topic: "refactoring" },
      { stem: "Who benefits from readable code", options: ["you and the next person reading it", "only the computer", "only the first user", "nobody"], answer: "you and the next person reading it", topic: "refactoring" },
    ],
    shortChecks: [
      { prompt: "Write one word for improving code structure without changing behavior.", answer: "refactoring", topic: "refactoring" },
      { prompt: "Write the Python keyword used to define a function you might extract during refactoring.", answer: "def", topic: "refactoring" },
    ],
  },
  "capstone-sprint": {
    id: "capstone-sprint",
    title: "Capstone Sprint and Final Readiness",
    summary: "Finish with a larger guided challenge that proves you can plan, build, debug, and explain your choices.",
    goal: "Be ready to continue learning from real exercises instead of only tutorial scaffolding.",
    phase: "project",
    outline: [
      "Choose a structure before you start typing",
      "Build the feature in checkpoints and verify each one",
      "Handle mistakes, edge cases, and user guidance intentionally",
      "Explain what you built and what you would improve next",
    ],
    nextSteps: [
      "After this, you head into the final check and ongoing practice.",
      "The platform will point you toward the next track based on your gaps.",
    ],
    quizSeeds: [
      { stem: "What matters most in a capstone build", options: ["combining planning, implementation, and debugging", "typing faster than before", "using every keyword once", "avoiding feedback"], answer: "combining planning, implementation, and debugging", topic: "capstone" },
      { stem: "Why work in checkpoints during a bigger build", options: ["each checkpoint is easier to verify", "it makes the project longer for no reason", "it removes the need for functions", "it avoids user input"], answer: "each checkpoint is easier to verify", topic: "capstone" },
      { stem: "What should you explain after finishing a build", options: ["your choices and what you would improve next", "only the file name", "only the color choices", "nothing at all"], answer: "your choices and what you would improve next", topic: "capstone" },
      { stem: "What shows real readiness", options: ["being able to continue learning from new problems", "memorizing one solution forever", "never making mistakes", "copying without understanding"], answer: "being able to continue learning from new problems", topic: "capstone" },
    ],
    shortChecks: [
      { prompt: "Write one word for a meaningful milestone in a larger build that you can test on its own.", answer: "checkpoint", topic: "capstone" },
      { prompt: "Write the Python keyword used to loop through repeated project tasks.", answer: "for", topic: "capstone" },
    ],
  },
};

const AVAILABLE_LANGUAGES: Array<{ id: string; name: string; level: Level }> = [
  { id: "python", name: "Python", level: "beginner" },
  { id: "java", name: "Java", level: "beginner" },
  { id: "javascript", name: "JavaScript", level: "advanced" },
  { id: "csharp", name: "C#", level: "advanced" },
  { id: "sql", name: "SQL", level: "advanced" },
];

function rotateOptions(options: [string, string, string, string], shift: number): [string, string, string, string] {
  const list = [...options];
  const rotated = list.map((_, index) => list[(index + shift) % list.length]) as [string, string, string, string];
  return rotated;
}

function mcq(id: string, prompt: string, options: string[], answer: string, topic: string): QuizQuestion {
  return { id, type: "mcq", prompt, options, answer, topic };
}

function short(id: string, prompt: string, answer: string, topic: string): QuizQuestion {
  return { id, type: "short", prompt, answer, topic };
}

function buildQuiz(prefix: string, seeds: QuizSeed[], shortChecks: ModuleSeed["shortChecks"]): QuizQuestion[] {
  const out: QuizQuestion[] = [];

  // Just use questions as-is, no variants
  seeds.forEach((seed, index) => {
    const rotatedOptions = [...rotateOptions(seed.options, index)];
    // Ensure answer is always the first option (A)
    out.push(
      mcq(
        `${prefix}_mcq_${index + 1}`,
        `${seed.stem}?`,
        rotatedOptions,
        rotatedOptions[0], // Always first option
        seed.topic,
      ),
    );
  });

  shortChecks.forEach((item, index) => {
    out.push(short(`${prefix}_short_${index + 1}`, item.prompt, item.answer, item.topic));
  });

  // Shuffle all questions
  return shuffleArray(out).slice(0, 10);
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildVideos(languageId: SupportedLanguage, moduleId: string, title: string): Video[] {
  const embedUrl = MODULE_VIDEO_URLS[languageId][moduleId] || MODULE_VIDEO_URLS[languageId]["syntax-basics"];
  return [{ title, embedUrl }];
}

function replaceForJava(text: string): string {
  return text
    .replaceAll("Python", "Java")
    .replaceAll("python", "java")
    .replaceAll("print(\"hello\")", "System.out.println(\"hello\");")
    .replaceAll("print", "System.out.println")
    .replaceAll("input()", "Scanner input")
    .replaceAll("input", "Scanner input")
    .replaceAll("list", "ArrayList")
    .replaceAll("def", "static method")
    .replaceAll("function", "method")
    .replaceAll("return", "return")
    .replaceAll("True", "true")
    .replaceAll("False", "false")
    .replaceAll("None", "null");
}

function replaceSeedForJava(seed: QuizSeed): QuizSeed {
  const options = seed.options.map((option) => {
    if (option === "print(\"hello\")") return "System.out.println(\"hello\");";
    if (option === "x = 7") return "int x = 7;";
    if (option === "indentation") return "curly braces";
    if (option === "def") return "static";
    if (option === "list") return "ArrayList";
    if (option === "True") return "true";
    return replaceForJava(option);
  }) as [string, string, string, string];

  let answer = seed.answer;
  if (answer === "print(\"hello\")") answer = "System.out.println(\"hello\");";
  if (answer === "x = 7") answer = "int x = 7;";
  if (answer === "indentation") answer = "curly braces";
  if (answer === "def") answer = "static";
  if (answer === "list") answer = "ArrayList";
  if (answer === "True") answer = "true";

  return {
    ...seed,
    stem: replaceForJava(seed.stem),
    options,
    answer: replaceForJava(answer),
  };
}

function replaceShortForJava(item: ModuleSeed["shortChecks"][number]) {
  let answer = replaceForJava(item.answer);
  if (item.answer === "print") answer = "System.out.println";
  if (item.answer === "input") answer = "Scanner";
  if (item.answer === "int") answer = "Integer.parseInt";
  if (item.answer === "list") answer = "ArrayList";
  if (item.answer === "def") answer = "static";
  return {
    ...item,
    prompt: replaceForJava(item.prompt),
    answer,
  };
}

function sectionFromModule(languageId: SupportedLanguage, module: ModuleSeed): Section {
  if (languageId === "python") {
    return {
      id: module.id,
      title: module.title,
      summary: module.summary,
      goal: module.goal,
      phase: module.phase,
      outline: module.outline,
      nextSteps: module.nextSteps,
      videos: buildVideos("python", module.id, module.title),
      quiz: buildQuiz(`py_${module.id}`, module.quizSeeds, module.shortChecks),
    };
  }

  return {
    id: module.id,
    title: replaceForJava(module.title),
    summary: replaceForJava(module.summary),
    goal: replaceForJava(module.goal),
    phase: module.phase,
    outline: module.outline.map(replaceForJava),
    nextSteps: module.nextSteps.map(replaceForJava),
    videos: buildVideos("java", module.id, replaceForJava(module.title)),
    quiz: buildQuiz(
      `ja_${module.id}`,
      module.quizSeeds.map(replaceSeedForJava),
      module.shortChecks.map(replaceShortForJava),
    ),
  };
}

function dedupe(list: string[]): string[] {
  return Array.from(new Set(list));
}

function buildPersonalizedModuleIds(profile?: Profile | null): string[] {
  const highestKnown = profile?.knowsFunctions
    ? 4
    : profile?.knowsLoops
      ? 3
      : profile?.knowsConditionals
        ? 2
        : profile?.knowsSyntax
          ? 1
          : 0;

  const ids: string[] = [];

  if (highestKnown <= 1) {
    ids.push(profile?.knowsSyntax ? "syntax-bridge" : "syntax-basics");
  }

  if (highestKnown <= 2 || (highestKnown >= 3 && profile?.knowsConditionals === false)) {
    ids.push(profile?.knowsConditionals ? "conditionals-logic" : "conditionals-basics");
  }

  ids.push(profile?.knowsLoops ? "loop-patterns" : "loops-basics");
  ids.push(highestKnown >= 3 ? "collections-advanced" : "data-collections");
  ids.push(profile?.knowsFunctions ? "function-design" : "functions-basics");
  ids.push("debugging-habits");

  if (profile?.preferExamples) {
    ids.push("example-lab");
  } else if (profile?.confidenceLevel === "low") {
    ids.push("confidence-lab");
  } else if (profile?.weeklyHours === "6+") {
    ids.push("speed-lab");
  } else {
    ids.push("real-world-input");
  }

  ids.push("problem-decomposition");
  ids.push(profile?.knowsFunctions ? "state-and-data" : "real-world-input");
  ids.push("project-studio");
  ids.push(highestKnown >= 3 ? "refactor-and-review" : "state-and-data");
  ids.push("capstone-sprint");

  const extras = [
    "example-lab",
    "confidence-lab",
    "speed-lab",
    "real-world-input",
    "state-and-data",
    "project-studio",
    "refactor-and-review",
    "capstone-sprint",
  ];

  const selected = dedupe([...ids, ...extras]).slice(0, 10);
  return selected;
}

function buildExamFromSections(languageId: SupportedLanguage, sections: Section[]): QuizQuestion[] {
  return sections
    .slice(Math.max(sections.length - 6, 0))
    .flatMap((section) => section.quiz.slice(0, 2))
    .map((question, index) => ({
      ...question,
      id: `${languageId}_exam_${index + 1}`,
    }))
    .slice(0, 12);
}

export const DEFAULT_LANGUAGES: LanguageContent[] = AVAILABLE_LANGUAGES.map((language) => ({
  ...language,
  sections: [],
  exam: [],
}));

export function buildLanguageTrack(languageId: string, profile?: Profile | null): LanguageContent {
  const normalized = languageId === "java" ? "java" : "python";
  const supportedId = normalized as SupportedLanguage;
  const languageName = supportedId === "python" ? "Python" : "Java";
  const moduleIds = buildPersonalizedModuleIds(profile);
  const sections = moduleIds.map((moduleId) => sectionFromModule(supportedId, PYTHON_MODULES[moduleId]));

  return {
    id: supportedId,
    name: languageName,
    level: highestTrackLevel(profile),
    sections,
    exam: buildExamFromSections(supportedId, sections),
  };
}

function highestTrackLevel(profile?: Profile | null): Level {
  if (profile?.knowsFunctions || profile?.knowsLoops) return "advanced";
  return "beginner";
}
