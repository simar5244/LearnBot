# LearnBot

LearnBot is a web app that helps people learn coding in a more personalized way.

Instead of giving the same lesson to everyone, it tracks what a learner gets wrong and gives focused follow-up practice.

## What This App Does

- Builds a guided learning path after onboarding
- Uses video-first lessons, then timed quizzes
- Shows correct/incorrect feedback right away
- Tracks weak topics in progress
- Opens **My Tutor Lab** for targeted practice on mistakes

## Run LearnBot On Your Computer

### 1) Install Node.js

Install Node.js (LTS version, 18+ recommended) from the official site.
This also installs `npm`.

### 2) Open the project folder

Use terminal and go into the project folder.

```bash
cd capstoneproject
```

### 3) Install packages

```bash
npm install
```

### 4) Add environment file

Create a file named `.env.local` in the project root.

Put your API keys/config there (for example OpenAI key if you use My Tutor features).

Right now, for the purposes of this course, we aren't using any external APIs, so you don't need to add anything to the `.env.local` file. But in real applications, you would add your OPEN AI API keys there.

### 5) Start the app

```bash
npm run dev
```

Open:

`http://localhost:3000`

### 6) Production run (optional)

```bash
npm run build
npm run start
```

## Quick Check After Launch

- Sign up / log in
- Finish onboarding
- Open Learn page
- Complete a module quiz
- Check Progress page
- Open My Tutor Lab and confirm mistake-based practice appears
