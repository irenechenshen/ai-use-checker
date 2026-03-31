// ============================================================
// data/policy-presets.ts
//
// Teacher-facing policy presets.
// These map to CoursePolicy values used by the rules engine.
//
// TO EDIT: Add or modify presets here. The 'policy' field
// must match a value in the CoursePolicy union type.
// ============================================================

import type { PolicyPreset, RuleRow } from '@/types';

export const POLICY_PRESETS: PolicyPreset[] = [
  {
    id: 'strict',
    label: 'Strict — no AI',
    description:
      'No AI use is permitted for any assessed work. Any AI assistance, however minor, conflicts with course rules.',
    policy: 'No AI allowed',
    color: 'red',
  },
  {
    id: 'disclosure',
    label: 'Disclosure required',
    description:
      'AI is permitted but must be disclosed in all submitted work. Students must record what they used and how.',
    policy: 'AI allowed only with disclosure',
    color: 'amber',
  },
  {
    id: 'language',
    label: 'Language support only',
    description:
      'AI may only be used for grammar checking, spell-checking, and language editing on the student\'s own text. Thinking support and content generation are not permitted.',
    policy: 'AI allowed for language support only',
    color: 'blue',
  },
  {
    id: 'flexible',
    label: 'Flexible / teacher judgment',
    description:
      'No specific AI policy has been set. Students should use judgment and check the assignment brief. General best-practice guidance applies.',
    policy: 'No specific policy given by teacher',
    color: 'green',
  },
];

// ----------------------------------------------------------
// Rule matrix rows displayed in the Teacher view.
// This is a human-readable summary of the engine logic.
// The actual computation is in lib/rules-engine.ts.
// ----------------------------------------------------------
export const RULE_MATRIX: RuleRow[] = [
  {
    category: 'Interpretation support',
    action: 'Explain a concept',
    policyContext: 'Any policy',
    baseVerdict: 'Green',
  },
  {
    category: 'Interpretation support',
    action: 'Explain task instructions',
    policyContext: 'Any policy',
    baseVerdict: 'Green',
  },
  {
    category: 'Language support',
    action: 'Improve grammar / spelling',
    policyContext: 'Any (especially language-only)',
    baseVerdict: 'Green',
  },
  {
    category: 'Language support',
    action: 'Improve academic style',
    policyContext: 'Disclosure or unclear',
    baseVerdict: 'Amber',
  },
  {
    category: 'Language support',
    action: 'Give feedback on clarity / argument',
    policyContext: 'Disclosure or unclear',
    baseVerdict: 'Amber',
  },
  {
    category: 'Brainstorming support',
    action: 'Generate ideas / brainstorm',
    policyContext: 'Disclosure or unclear',
    baseVerdict: 'Green → Amber',
  },
  {
    category: 'Structural support',
    action: 'Suggest structure',
    policyContext: 'Disclosure or unclear',
    baseVerdict: 'Amber',
  },
  {
    category: 'Structural support',
    action: 'Create an outline',
    policyContext: 'Disclosure or unclear',
    baseVerdict: 'Amber',
  },
  {
    category: 'Source handling',
    action: 'Summarise sources',
    policyContext: 'Any policy',
    baseVerdict: 'Amber',
  },
  {
    category: 'Source handling',
    action: 'Paraphrase text',
    policyContext: 'Any policy',
    baseVerdict: 'Red (hard override)',
  },
  {
    category: 'Citation support',
    action: 'Generate citations / references',
    policyContext: 'Any policy',
    baseVerdict: 'Red',
  },
  {
    category: 'Draft generation',
    action: 'Generate draft text (assessed)',
    policyContext: 'Any policy',
    baseVerdict: 'Red (hard override)',
  },
  {
    category: 'Draft generation',
    action: 'Generate draft text (exam prep)',
    policyContext: 'Exam preparation context',
    baseVerdict: 'Amber',
  },
  {
    category: 'Draft generation',
    action: 'Rewrite my sentences',
    policyContext: 'Any policy',
    baseVerdict: 'Amber → Red',
  },
  {
    category: 'Presentation support',
    action: 'Draft slides',
    policyContext: 'Disclosure or unclear',
    baseVerdict: 'Amber',
  },
  {
    category: 'Data analysis',
    action: 'Analyse data',
    policyContext: 'Context-dependent',
    baseVerdict: 'Amber',
  },
  {
    category: 'Privacy override',
    action: 'Any action with sensitive materials',
    policyContext: 'Personal data / unpublished research / identifiable data',
    baseVerdict: '→ Red',
  },
  {
    category: 'Policy override',
    action: 'Any action',
    policyContext: 'No AI allowed',
    baseVerdict: '→ Red',
  },
  {
    category: 'Policy escalation',
    action: 'Non-language actions',
    policyContext: 'Language support only',
    baseVerdict: '+ 3 score (often → Red)',
  },
];

// ----------------------------------------------------------
// Form option arrays (used by checker form)
// ----------------------------------------------------------
export const TASK_TYPES = [
  'Essay',
  'Report',
  'Literature review',
  'Reflection',
  'Presentation',
  'Lab report',
  'Discussion post',
  'Exam preparation',
  'Group project',
  'Dissertation / thesis',
  'Other',
] as const;

export const STAGES = [
  'Understanding the task',
  'Brainstorming',
  'Research / reading',
  'Planning / outlining',
  'Drafting',
  'Revising',
  'Proofreading',
  'Referencing / citations',
  'Presentation preparation',
] as const;

export const AI_ACTIONS = [
  'Explain a concept',
  'Explain task instructions',
  'Generate ideas / brainstorm',
  'Suggest structure',
  'Create an outline',
  'Rewrite my sentences',
  'Improve grammar / spelling',
  'Improve academic style',
  'Summarise sources',
  'Paraphrase text',
  'Generate citations / references',
  'Analyse data',
  'Draft slides',
  'Give feedback on clarity / argument',
  'Generate draft text',
] as const;

export const POLICY_OPTIONS = [
  'No AI allowed',
  'AI allowed only with disclosure',
  'AI allowed for language support only',
  'No specific policy given by teacher',
  'Institution-level guidance only',
  'I am not sure',
] as const;

export const MATERIAL_OPTIONS = [
  'Only my own notes',
  'Assignment brief / task description',
  'My own draft text',
  'Published source articles',
  'Personal data (names, identifiers)',
  'Unpublished research data',
  "Other students' work",
  'Sensitive case or clinical information',
] as const;

export const SENSITIVE_MATERIAL_OPTIONS = [
  'Personal data (names, identifiers)',
  'Unpublished research data',
  "Other students' work",
  'Sensitive case or clinical information',
] as const;
