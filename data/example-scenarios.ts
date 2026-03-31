// ============================================================
// data/example-scenarios.ts
//
// Pre-built example scenarios for the Examples page.
// Each has a curated verdict and short summary for the card view.
// The full result is re-computed live by the rules engine when
// a user clicks through to the detail view.
//
// TO ADD SCENARIOS: append to this array.
// ============================================================

import type { ExampleScenario } from '@/types';

export const EXAMPLE_SCENARIOS: ExampleScenario[] = [
  {
    question: 'Can I use AI to improve grammar in my own draft?',
    task: 'Essay',
    stage: 'Proofreading',
    action: 'Improve grammar / spelling',
    policy: 'AI allowed only with disclosure',
    materials: ['My own draft text'],
    verdict: 'GREEN',
    summary:
      'Low-risk language support on your own writing. Most policies permit this, especially at the proofreading stage. Disclosure is needed if your course requires it.',
  },
  {
    question: 'Can I ask AI to summarise journal articles?',
    task: 'Literature review',
    stage: 'Research / reading',
    action: 'Summarise sources',
    policy: 'No specific policy given by teacher',
    materials: ['Published source articles'],
    verdict: 'AMBER',
    summary:
      'Risky because AI can misrepresent or fabricate source content. Always verify against the original before using in your work.',
  },
  {
    question: 'Can I use AI to generate an essay outline?',
    task: 'Essay',
    stage: 'Planning / outlining',
    action: 'Create an outline',
    policy: 'AI allowed only with disclosure',
    materials: ['Only my own notes'],
    verdict: 'AMBER',
    summary:
      'Structural support is a grey area. Your ideas must drive the outline. Disclosure is required under this policy.',
  },
  {
    question: 'Can I use AI to rewrite my reflection?',
    task: 'Reflection',
    stage: 'Revising',
    action: 'Rewrite my sentences',
    policy: 'No specific policy given by teacher',
    materials: ['My own draft text'],
    verdict: 'RED',
    summary:
      'Rewriting a reflection undermines its personal and authentic nature. High risk for assessed reflective writing.',
  },
  {
    question: 'Can I paste teacher feedback into AI for guidance?',
    task: 'Essay',
    stage: 'Revising',
    action: 'Explain task instructions',
    policy: 'No specific policy given by teacher',
    materials: ['Assignment brief / task description'],
    verdict: 'AMBER',
    summary:
      'Sharing assignment feedback is lower risk, but check whether it contains institution-specific or confidential context that should not be shared externally.',
  },
  {
    question: 'Can AI help me prepare presentation slides?',
    task: 'Presentation',
    stage: 'Presentation preparation',
    action: 'Draft slides',
    policy: 'AI allowed only with disclosure',
    materials: ['Only my own notes'],
    verdict: 'AMBER',
    summary:
      'Generally lower risk than essay writing, provided the ideas and argument are entirely your own. Disclosure is required.',
  },
  {
    question: 'Can I ask AI to produce references?',
    task: 'Report',
    stage: 'Referencing / citations',
    action: 'Generate citations / references',
    policy: 'No specific policy given by teacher',
    materials: ['Published source articles'],
    verdict: 'RED',
    summary:
      'AI frequently fabricates references. Never submit AI-generated citations without full independent verification against real sources.',
  },
  {
    question: 'Can I use AI for brainstorming only?',
    task: 'Essay',
    stage: 'Brainstorming',
    action: 'Generate ideas / brainstorm',
    policy: 'AI allowed only with disclosure',
    materials: ['Only my own notes'],
    verdict: 'GREEN',
    summary:
      'Brainstorming support is widely accepted as legitimate academic use. Disclose it and develop all ideas yourself from that point on.',
  },
  {
    question: 'Can I use AI to paraphrase source text?',
    task: 'Essay',
    stage: 'Drafting',
    action: 'Paraphrase text',
    policy: 'AI allowed only with disclosure',
    materials: ['Published source articles'],
    verdict: 'RED',
    summary:
      'Paraphrasing sources with AI for submission as your own work is very likely to constitute academic misconduct.',
  },
  {
    question: 'Can I upload interview transcripts to AI?',
    task: 'Dissertation / thesis',
    stage: 'Research / reading',
    action: 'Summarise sources',
    policy: 'No specific policy given by teacher',
    materials: [
      'Personal data (names, identifiers)',
      'Unpublished research data',
    ],
    verdict: 'RED',
    summary:
      'Sharing identifiable research data with a public AI tool is a serious data protection concern and may breach GDPR or your research ethics agreement.',
  },
  {
    question: 'Can I ask AI to explain assignment instructions?',
    task: 'Essay',
    stage: 'Understanding the task',
    action: 'Explain task instructions',
    policy: 'No specific policy given by teacher',
    materials: ['Assignment brief / task description'],
    verdict: 'GREEN',
    summary:
      'Equivalent to asking a classmate or looking up a definition. Generally acceptable and very low risk in most contexts.',
  },
  {
    question: 'Can I use AI to check if my argument is clear?',
    task: 'Essay',
    stage: 'Revising',
    action: 'Give feedback on clarity / argument',
    policy: 'AI allowed only with disclosure',
    materials: ['My own draft text'],
    verdict: 'AMBER',
    summary:
      'Getting AI feedback on clarity is comparable to asking a peer to review your draft. Low risk but requires disclosure under this policy.',
  },
];
