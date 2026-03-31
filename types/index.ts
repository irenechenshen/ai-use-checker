// ============================================================
// Core domain types for AI Use Checker
// Edit these when adding new task types, actions, or policies.
// ============================================================

export type TaskType =
  | 'Essay'
  | 'Report'
  | 'Literature review'
  | 'Reflection'
  | 'Presentation'
  | 'Lab report'
  | 'Discussion post'
  | 'Exam preparation'
  | 'Group project'
  | 'Dissertation / thesis'
  | 'Other';

export type Stage =
  | 'Understanding the task'
  | 'Brainstorming'
  | 'Research / reading'
  | 'Planning / outlining'
  | 'Drafting'
  | 'Revising'
  | 'Proofreading'
  | 'Referencing / citations'
  | 'Presentation preparation';

export type AIAction =
  | 'Explain a concept'
  | 'Explain task instructions'
  | 'Generate ideas / brainstorm'
  | 'Suggest structure'
  | 'Create an outline'
  | 'Rewrite my sentences'
  | 'Improve grammar / spelling'
  | 'Improve academic style'
  | 'Summarise sources'
  | 'Paraphrase text'
  | 'Generate citations / references'
  | 'Analyse data'
  | 'Draft slides'
  | 'Give feedback on clarity / argument'
  | 'Generate draft text';

export type CoursePolicy =
  | 'No AI allowed'
  | 'AI allowed only with disclosure'
  | 'AI allowed for language support only'
  | 'No specific policy given by teacher'
  | 'Institution-level guidance only'
  | 'I am not sure';

export type Material =
  | 'Only my own notes'
  | 'Assignment brief / task description'
  | 'My own draft text'
  | 'Published source articles'
  | 'Personal data (names, identifiers)'
  | 'Unpublished research data'
  | "Other students' work"
  | 'Sensitive case or clinical information';

export type Verdict = 'GREEN' | 'AMBER' | 'RED';

// The answers a user provides in the checker form
export interface CheckerAnswers {
  task: TaskType;
  stage: Stage;
  action: AIAction;
  policy: CoursePolicy;
  materials: Material[];
}

// The full result returned by the rules engine
export interface VerdictResult {
  verdict: Verdict;
  score: number; // 0–10 internal risk score (for transparency / debugging)
  reasons: string[]; // Plain-language explanation paragraphs
  risks: string[]; // Specific risk statements
  safer: string; // Safer alternative suggestion
  nextAction: string; // What to do now
  disclosure: string | null; // Generated disclosure statement (null if RED or no-AI policy)
  hasSensitive: boolean; // True if sensitive materials were selected
  isUnclear: boolean; // True if policy is ambiguous
  isDisclosure: boolean; // True if disclosure is required by policy
  extras: string[]; // Additional guidance notes
  // Echo back the answers for display in results
  task: TaskType;
  stage: Stage;
  action: AIAction;
  policy: CoursePolicy;
  materials: Material[];
}

// A pre-built example scenario shown on the Examples page
export interface ExampleScenario {
  question: string;
  task: TaskType;
  stage: Stage;
  action: AIAction;
  policy: CoursePolicy;
  materials: Material[];
  verdict: Verdict; // Expected / curated verdict for display
  summary: string; // Short plain-language summary for the scenario card
}

// Teacher policy preset
export interface PolicyPreset {
  id: string;
  label: string;
  description: string;
  policy: CoursePolicy;
  color: 'red' | 'amber' | 'blue' | 'green';
}

// A single rule in the rule matrix (for the teacher view table)
export interface RuleRow {
  category: string;
  action: string;
  policyContext: string;
  baseVerdict: string; // e.g. "Green", "Amber→Red", "→ Red"
}
