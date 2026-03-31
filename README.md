# AI Use Checker

A practical decision-support tool for students and teachers in higher education. Helps users decide whether a specific use of AI in an academic task is likely acceptable (Green), uncertain (Amber), or likely inappropriate (Red).

**This is not an AI detector, plagiarism checker, or misconduct scoring tool.**

---

## Project purpose

Many students and teachers in higher education face genuine uncertainty about when and how AI tools can be used appropriately. Policies vary between institutions, courses, and even individual assignments. AI Use Checker provides structured, rule-based guidance by asking five questions about the situation and returning a clear, reasoned verdict — with explanation, risk summary, safer alternatives, and a suggested disclosure statement.

The app is designed first for English academic skills contexts in Dutch higher education, but is broadly applicable internationally.

---

## Quick start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Requirements

- Node.js 18.17 or later
- npm 9 or later

### Build for production

```bash
npm run build
npm start
```

### Type check

```bash
npm run type-check
```

---

## Architecture

```
ai-use-checker/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (nav, footer, fonts)
│   ├── globals.css         # Tailwind base + global styles
│   ├── page.tsx            # Home page
│   ├── checker/page.tsx    # Checker form page
│   ├── result/page.tsx     # Result display page (client)
│   ├── scenarios/page.tsx  # Example scenarios page
│   ├── teacher/page.tsx    # Teacher / admin-lite page
│   └── about/page.tsx      # About and guidance page
│
├── components/
│   ├── ui.tsx              # Shared UI primitives (badges, cards, etc.)
│   ├── nav.tsx             # Navigation component
│   ├── checker-form.tsx    # Multi-step checker form
│   └── result-view.tsx     # Result display component
│
├── lib/
│   ├── rules-engine.ts     # Core verdict logic (edit rules here)
│   └── disclosure.ts       # Disclosure statement generator
│
├── data/
│   ├── policy-presets.ts   # Teacher presets + rule matrix + form options
│   └── example-scenarios.ts # Pre-built example scenarios
│
└── types/
    └── index.ts            # All TypeScript types
```

**No backend. No database. No auth.** All verdict computation runs client-side. The only browser storage used is `sessionStorage` to pass checker answers to the result page — it clears when the tab closes.

---

## Rule engine explained

The rules engine is in `lib/rules-engine.ts`. It works in five stages:

### 1. Hard override: no-AI policy

If the user selects "No AI allowed", the verdict is immediately Red with no further computation.

### 2. Base score from AI action

Every AI action has a base risk score (0–10) defined in `ACTION_SCORES`:

```ts
const ACTION_SCORES: Record<AIAction, number> = {
  'Explain a concept': 1,
  'Improve grammar / spelling': 2,
  'Generate ideas / brainstorm': 3,
  'Create an outline': 4,
  'Summarise sources': 5,
  'Rewrite my sentences': 5,
  'Generate citations / references': 6,
  'Paraphrase text': 7,
  'Generate draft text': 9,
  // ...
};
```

### 3. Modifiers

The base score is adjusted by:

- **Task modifier** — e.g. `Rewrite my sentences` in a `Reflection` task adds +2; `Generate draft text` in `Exam preparation` subtracts 6.
- **Stage modifier** — e.g. `Improve grammar / spelling` at `Proofreading` subtracts 1 (very safe); `Improve academic style` at `Drafting` adds 1.
- **Policy × action modifier** — e.g. any non-language action under a language-only policy adds 3.

### 4. Privacy and material overrides

If sensitive materials are selected (personal data, unpublished research, other students' work, clinical information), the score is escalated to at least 7. Sharing another student's work escalates to at least 8.

### 5. Score → verdict mapping

| Score | Verdict |
|-------|---------|
| 0–2   | Green   |
| 3–5   | Amber   |
| 6–10  | Red     |

### Hard verdict overrides (post-score)

Certain action/task combinations always produce a specific verdict regardless of score:

- `Generate draft text` (non exam-prep) → always **Red**
- `Paraphrase text` → always **Red**
- Language-only policy + non-language action → at least **Amber**

---

## How to edit rules

### Change a base action score

In `lib/rules-engine.ts`, find `ACTION_SCORES` and update the value:

```ts
// Make "Summarise sources" slightly more permissive
'Summarise sources': 4,  // was 5
```

### Add a new AI action

1. Add the string to the `AIAction` union in `types/index.ts`
2. Add it to `AI_ACTIONS` in `data/policy-presets.ts`
3. Add a base score in `ACTION_SCORES` in `lib/rules-engine.ts`
4. Add explanation text in `buildReasons()` and risk text in `buildRisks()`
5. Add a safer alternative in `buildSaferAlternative()`
6. Optionally add a disclosure template in `lib/disclosure.ts`

### Add a new task type or stage

1. Add to the relevant union type in `types/index.ts`
2. Add to the `TASK_TYPES` or `STAGES` array in `data/policy-presets.ts`
3. Optionally add a task or stage modifier in `getTaskModifier()` or `getStageModifier()`

### Add an example scenario

In `data/example-scenarios.ts`, append an object to `EXAMPLE_SCENARIOS`:

```ts
{
  question: 'Can I use AI to help structure my lab report?',
  task: 'Lab report',
  stage: 'Planning / outlining',
  action: 'Suggest structure',
  policy: 'AI allowed only with disclosure',
  materials: ['Only my own notes'],
  verdict: 'AMBER',          // curated for the card display
  summary: 'Short summary for the scenario card...',
},
```

The full result is always recomputed live by the engine when a user clicks through.

### Change the score-to-verdict thresholds

In `computeVerdict()` in `lib/rules-engine.ts`, find:

```ts
if (score <= 2) verdict = 'GREEN';
else if (score <= 5) verdict = 'AMBER';
else verdict = 'RED';
```

Adjust the thresholds as needed.

---

## Limitations

- **No backend.** Policy presets in the Teacher view are UI state only — they do not persist across sessions or pre-fill the checker for students. A future version could use URL params or a simple config file.
- **Rule coverage.** The engine covers the most common academic AI use cases. Edge cases (e.g. AI use in oral exams, co-authored work, creative writing courses) are not fully modelled.
- **Disclosure statements.** Generated statements are starting points. Users must adapt them to their institution's specific requirements.
- **Not legal advice.** No claim of institutional compliance is made. Course and institutional rules always take precedence.
- **No internationalisation.** All content is in English. Dutch or multilingual support would require an i18n layer.

---

## Future ideas

- **URL-based preset sharing** — teachers could share a URL with their policy pre-filled (e.g. `?policy=language-only`)
- **Embeddable widget** — a minimal version embeddable in a VLE (Moodle, Canvas, Brightspace)
- **Course-level configuration file** — a JSON file teachers can edit to customise the rule thresholds and presets for their institution
- **Multilingual support** — Dutch, German, French UI for international contexts
- **LLM-enhanced explanations** — optional: use an LLM to generate richer, context-specific explanation text (verdict logic stays rule-based)
- **Audit log export** — CSV export of checked scenarios for teacher review
- **Accessibility audit** — full WCAG 2.1 AA review and screen reader testing

---

## Design decisions

**Why Next.js App Router?** Simple, modern, well-supported. Server components are used where there is no interactivity; client components are marked `'use client'` only where needed.

**Why Tailwind CSS?** Utility-first keeps the design consistent without a separate design system. The stone/neutral palette was chosen to feel academic and calm.

**Why sessionStorage and not URL params for results?** The full checker answers object is too large and complex to encode cleanly in a URL. Session storage is simple, private, and clears automatically.

**Why no LLM for verdicts?** The product brief requires rules-first logic for transparency and consistency. LLM verdicts would be non-deterministic and harder for teachers and institutions to trust or inspect.

---

## Licence

MIT — free to use, adapt, and deploy. Attribution appreciated but not required.
