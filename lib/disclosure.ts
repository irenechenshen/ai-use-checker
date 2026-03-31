// ============================================================
// lib/disclosure.ts
//
// Generates suggested disclosure statements based on the
// user's scenario. These are offered when the verdict is
// GREEN or AMBER and the course policy does not forbid AI.
//
// TO EDIT: Add or modify entries in DISCLOSURE_TEMPLATES.
// Use [PLACEHOLDER] syntax for parts the user should fill in.
// ============================================================

import type { AIAction, TaskType, Stage } from '@/types';

// Template map: action → disclosure text
// More specific conditions checked first (task/stage combos),
// then general action-level fallback.
const DISCLOSURE_TEMPLATES: Array<{
  matches: (action: AIAction, task: TaskType, stage: Stage) => boolean;
  text: string;
}> = [
  {
    matches: (a, t, s) =>
      a === 'Improve grammar / spelling' && (s === 'Proofreading' || s === 'Revising'),
    text: 'I used a generative AI tool to check the grammar and spelling of my own draft at the proofreading stage. I reviewed all suggestions and made my own decisions about any changes to the text.',
  },
  {
    matches: (a) => a === 'Improve grammar / spelling',
    text: 'I used a generative AI tool to assist with grammar and spelling on my own writing. I reviewed all suggestions independently before making any changes.',
  },
  {
    matches: (a, t) => a === 'Improve academic style' && t === 'Reflection',
    text: 'I used a generative AI tool to review the language of my reflection for academic conventions. The content, personal insight, and analysis are entirely my own.',
  },
  {
    matches: (a) => a === 'Improve academic style',
    text: 'I used a generative AI tool to review the academic style and phrasing of my own draft text. I evaluated all suggestions independently before making any changes.',
  },
  {
    matches: (a) => a === 'Give feedback on clarity / argument',
    text: 'I used a generative AI tool to get feedback on the clarity and structure of my own written argument. I evaluated all feedback critically and revised the text myself.',
  },
  {
    matches: (a) => a === 'Generate ideas / brainstorm',
    text: 'I used a generative AI tool to help me brainstorm possible angles and subtopics at the early planning stage. I selected and developed my own ideas from the output. The analysis, argument, and writing are entirely my own.',
  },
  {
    matches: (a) => a === 'Explain a concept',
    text: 'I used a generative AI tool to help me understand [name the concept]. All analysis, interpretation, and written work is my own.',
  },
  {
    matches: (a) => a === 'Explain task instructions',
    text: 'I used a generative AI tool to help me clarify my understanding of the assignment brief. All written work and analysis is my own.',
  },
  {
    matches: (a) => a === 'Create an outline' || a === 'Suggest structure',
    text: 'I used a generative AI tool to suggest a possible structure for this work. I adapted and revised the suggested outline substantially to reflect my own argument and approach. The content and analysis are entirely my own.',
  },
  {
    matches: (a) => a === 'Summarise sources',
    text: 'I used a generative AI tool to produce initial summaries of sources at the research stage. I verified all summaries against the original texts and did not rely solely on AI-generated output in my writing.',
  },
  {
    matches: (a) => a === 'Analyse data',
    text: 'I used a generative AI tool to assist with [describe specific analytical task]. I verified the output against my own analysis and did not rely on AI results without independent checking.',
  },
  {
    matches: (a) => a === 'Draft slides',
    text: 'I used a generative AI tool to assist in drafting slide content for this presentation. The ideas, argument, and structure are my own. I reviewed and revised all AI-generated suggestions.',
  },
  {
    matches: (a) => a === 'Rewrite my sentences',
    text: 'I used a generative AI tool to suggest revisions to sentences in my own draft. I reviewed all suggestions critically and made my own decisions about what to change. The ideas and arguments are entirely my own.',
  },
];

const FALLBACK_DISCLOSURE =
  'I used a generative AI tool to assist with [describe specific use] in the preparation of this work. I reviewed all output critically and made my own academic judgments throughout. The ideas, analysis, and argument are my own.';

export function generateDisclosure(
  action: AIAction,
  task: TaskType,
  stage: Stage,
): string {
  for (const template of DISCLOSURE_TEMPLATES) {
    if (template.matches(action, task, stage)) {
      return template.text;
    }
  }
  return FALLBACK_DISCLOSURE;
}
