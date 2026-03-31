// ============================================================
// lib/rules-engine.ts
//
// The core verdict logic for AI Use Checker.
//
// HOW IT WORKS:
// 1. Hard overrides are checked first (no-AI policy, sensitive data)
// 2. Base score is determined by the AI action category
// 3. Modifiers adjust the score based on task, stage, and policy
// 4. Final score maps to GREEN (0-2) / AMBER (3-5) / RED (6-10)
// 5. A small number of hard verdict overrides ensure consistency
//    on the most clear-cut cases (e.g. "Generate draft text" = always RED)
//
// TO EDIT RULES:
// - Action scoring: see the ACTION_SCORES block below
// - Stage/task modifiers: see STAGE_MODIFIERS and TASK_MODIFIERS
// - Policy modifiers: see POLICY_MODIFIERS
// - Hard overrides: see the override blocks in computeVerdict()
// ============================================================

import type {
  CheckerAnswers,
  VerdictResult,
  Verdict,
  AIAction,
  TaskType,
  Stage,
  CoursePolicy,
  Material,
} from '@/types';

import { generateDisclosure } from './disclosure';

// ----------------------------------------------------------
// Constants: action categories
// ----------------------------------------------------------

export const SAFE_SUPPORT_ACTIONS: AIAction[] = [
  'Explain a concept',
  'Explain task instructions',
];

export const LANGUAGE_ACTIONS: AIAction[] = [
  'Improve grammar / spelling',
  'Improve academic style',
  'Give feedback on clarity / argument',
];

export const BRAINSTORM_ACTIONS: AIAction[] = ['Generate ideas / brainstorm'];

export const STRUCTURAL_ACTIONS: AIAction[] = [
  'Suggest structure',
  'Create an outline',
];

export const SOURCE_ACTIONS: AIAction[] = [
  'Summarise sources',
  'Paraphrase text',
  'Generate citations / references',
];

export const DRAFT_ACTIONS: AIAction[] = [
  'Generate draft text',
  'Rewrite my sentences',
];

export const SENSITIVE_MATERIALS: Material[] = [
  'Personal data (names, identifiers)',
  'Unpublished research data',
  "Other students' work",
  'Sensitive case or clinical information',
];

// ----------------------------------------------------------
// Base risk scores per action (0 = lowest, 10 = highest)
// These are starting points — modifiers adjust them below.
// ----------------------------------------------------------
const ACTION_SCORES: Record<AIAction, number> = {
  'Explain a concept': 1,
  'Explain task instructions': 1,
  'Generate ideas / brainstorm': 3,
  'Suggest structure': 4,
  'Create an outline': 4,
  'Improve grammar / spelling': 2,
  'Improve academic style': 3,
  'Give feedback on clarity / argument': 3,
  'Summarise sources': 5,
  'Paraphrase text': 7,
  'Generate citations / references': 6,
  'Analyse data': 4,
  'Draft slides': 3,
  'Rewrite my sentences': 5,
  'Generate draft text': 9,
};

// ----------------------------------------------------------
// Policy modifiers: delta applied to base score
// ----------------------------------------------------------


// ----------------------------------------------------------
// Task modifiers for specific risky combinations
// ----------------------------------------------------------
function getTaskModifier(task: TaskType, action: AIAction): number {
  // Reflections must be personal — rewriting or generating is especially risky
  if (task === 'Reflection' && (action === 'Rewrite my sentences' || action === 'Generate draft text')) {
    return 2;
  }
  // Lab reports: analysis is the assessed skill
  if (task === 'Lab report' && action === 'Analyse data') {
    return 2;
  }
  // Dissertations have stricter expectations
  if (task === 'Dissertation / thesis' && DRAFT_ACTIONS.includes(action)) {
    return 1;
  }
  // Exam prep: generating material is actually useful for studying, lower risk
  if (task === 'Exam preparation' && action === 'Generate draft text') {
    return -6; // Pull score way down — not assessed writing
  }
  return 0;
}

// ----------------------------------------------------------
// Stage modifiers for specific risky combinations
// ----------------------------------------------------------
function getStageModifier(stage: Stage, action: AIAction): number {
  // Proofreading + grammar/spelling = very safe
  if (
    (stage === 'Proofreading' || stage === 'Revising') &&
    action === 'Improve grammar / spelling'
  ) {
    return -1;
  }
  // Drafting stage + style improvement blurs into content gen
  if (stage === 'Drafting' && action === 'Improve academic style') {
    return 1;
  }
  // Referencing stage + generate citations = full risk (no reduction)
  if (stage === 'Referencing / citations' && action === 'Generate citations / references') {
    return 1;
  }
  return 0;
}

// ----------------------------------------------------------
// Policy-action interaction modifiers
// ----------------------------------------------------------
function getPolicyActionModifier(policy: CoursePolicy, action: AIAction): number {
  const isLangOnly = policy === 'AI allowed for language support only';

  if (isLangOnly) {
    // These actions are clearly outside language support
    if (
      BRAINSTORM_ACTIONS.includes(action) ||
      STRUCTURAL_ACTIONS.includes(action) ||
      SOURCE_ACTIONS.includes(action) ||
      DRAFT_ACTIONS.includes(action) ||
      action === 'Analyse data'
    ) {
      return 3;
    }
    // Feedback on argument is borderline
    if (action === 'Give feedback on clarity / argument') {
      return 1;
    }
    // Academic style is borderline
    if (action === 'Improve academic style') {
      return 1;
    }
  }

  return 0;
}

// ----------------------------------------------------------
// Build plain-language reasons based on what drove the verdict
// ----------------------------------------------------------
function buildReasons(
  action: AIAction,
  task: TaskType,
  stage: Stage,
  policy: CoursePolicy,
  hasSensitive: boolean,
  score: number,
): string[] {
  const reasons: string[] = [];

  // Action-level explanations
  if (SAFE_SUPPORT_ACTIONS.includes(action)) {
    reasons.push(
      'Asking AI to explain concepts or task instructions is widely considered a low-risk form of support, similar to using a dictionary or asking a classmate for clarification.',
    );
  } else if (action === 'Generate ideas / brainstorm') {
    reasons.push(
      'Using AI to brainstorm is generally considered supportive rather than generative — you are developing your own thinking, not having AI write for you.',
    );
  } else if (STRUCTURAL_ACTIONS.includes(action)) {
    reasons.push(
      'Generating an outline or structure with AI is in a grey area. It supports your planning but may substitute for your own analytical work if the structure heavily shapes your argument.',
    );
  } else if (action === 'Improve grammar / spelling') {
    reasons.push(
      'Using AI for grammar and spelling on your own writing is one of the most commonly permitted uses in academic settings, often treated as equivalent to spell-check.',
    );
  } else if (action === 'Improve academic style') {
    reasons.push(
      'Using AI to improve academic style on your own draft is generally low risk, though it starts to shade into content editing. Make sure the ideas and arguments remain entirely your own.',
    );
  } else if (action === 'Give feedback on clarity / argument') {
    reasons.push(
      'Asking AI for feedback on clarity or argument structure is broadly comparable to asking a peer to review your draft. Your ideas and writing should remain your own.',
    );
  } else if (action === 'Summarise sources') {
    reasons.push(
      'Using AI to summarise academic sources is risky because AI can hallucinate details, misrepresent arguments, and fabricate quotes. You should read your sources directly and treat any AI summary as a rough starting point only.',
    );
  } else if (action === 'Paraphrase text') {
    reasons.push(
      'Asking AI to paraphrase text — especially source material — is high risk. Submitting AI-paraphrased text as your own writing can constitute academic misconduct, regardless of how the paraphrase is worded.',
    );
  } else if (action === 'Generate citations / references') {
    reasons.push(
      'AI-generated citations are frequently incorrect, incomplete, or entirely fabricated. Even where AI use is permitted, presenting unverified AI references as reliable sources is a serious academic risk.',
    );
  } else if (action === 'Generate draft text') {
    if (task === 'Exam preparation') {
      reasons.push(
        'Using AI to generate practice material for exam preparation is a different matter from assessed writing. Generating practice questions, model answers, or explanations is widely used as a study tool.',
      );
    } else {
      reasons.push(
        'Generating draft text with AI for an assessed piece of work is very likely to be considered academic misconduct. This applies to essays, reports, reflections, and most written assignments.',
      );
    }
  } else if (action === 'Rewrite my sentences') {
    reasons.push(
      'Having AI rewrite your sentences is in a grey area. If it substantially rewrites your ideas, it moves from language support into content generation, which is risky for assessed work.',
    );
    if (task === 'Reflection') {
      reasons.push(
        'Reflections are meant to be personal and authentic. Having AI rewrite a reflection is particularly problematic because it undermines the purpose of the task.',
      );
    }
  } else if (action === 'Analyse data') {
    reasons.push(
      'Using AI to assist with data analysis depends heavily on whether the analytical reasoning itself is the assessed skill. In many assignments — particularly lab reports and dissertations — it is.',
    );
  } else if (action === 'Draft slides') {
    reasons.push(
      'Using AI to draft slide content is generally lower risk than having it write your essay, provided the ideas, structure, and argument are entirely your own.',
    );
  }

  // Policy-level additions
  if (policy === 'AI allowed for language support only') {
    if (!LANGUAGE_ACTIONS.includes(action) && !SAFE_SUPPORT_ACTIONS.includes(action)) {
      reasons.push(
        'Your stated policy limits AI to language support. The action you have described goes beyond language support, which increases the risk.',
      );
    } else {
      reasons.push('Your policy explicitly permits language support, so this is within what is allowed — though always check your specific assignment brief.');
    }
  }

  if (policy === 'AI allowed only with disclosure') {
    reasons.push('Your course requires disclosure of AI use. Make sure you record what tool you used, how you used it, and what you changed.');
  }

  if (
    ['No specific policy given by teacher', 'Institution-level guidance only', 'I am not sure'].includes(
      policy,
    )
  ) {
    reasons.push(
      'Your course policy on AI is unclear. The verdict is based on general best practice. Check your assignment brief and confirm with your teacher before proceeding if you are in any doubt.',
    );
  }

  // Sensitive material additions
  if (hasSensitive) {
    reasons.push(
      'You have indicated that you may share sensitive or personal material with an AI tool. Public AI tools process data on remote servers and are not suitable for confidential, personal, or unpublished research data.',
    );
  }

  return reasons;
}

// ----------------------------------------------------------
// Build risk statements
// ----------------------------------------------------------
function buildRisks(
  action: AIAction,
  task: TaskType,
  hasSensitive: boolean,
  materials: Material[],
): string[] {
  const risks: string[] = [];

  if (action === 'Paraphrase text') {
    risks.push(
      'Paraphrased AI text submitted as original writing may be considered misconduct, regardless of how it has been reworded.',
    );
  } else if (action === 'Generate draft text' && task !== 'Exam preparation') {
    risks.push(
      'Submitting AI-generated text as your own work — even if edited — may breach academic integrity policy at most institutions.',
    );
  } else if (action === 'Generate citations / references') {
    risks.push(
      'AI regularly fabricates journal titles, author names, publication dates, and DOIs. References must always be verified against the real source before submission.',
    );
  } else if (action === 'Summarise sources') {
    risks.push(
      'AI-generated summaries may contain errors, omissions, or fabricated content. Relying on them uncritically risks misrepresenting your sources in your work.',
    );
  } else if (action === 'Rewrite my sentences') {
    risks.push(
      'If AI substantially rewrites your arguments or ideas, the work may no longer represent your own thinking, which undermines academic integrity.',
    );
  } else if (action === 'Analyse data') {
    risks.push(
      'If analytical reasoning is the assessed skill, using AI to perform it may mean you are not demonstrating the competency your assignment is designed to test.',
    );
  }

  if (hasSensitive) {
    risks.push(
      'Sharing personal data, unpublished research, or identifiable case information with a public AI tool may violate GDPR, your institution\'s data protection policy, or your research ethics agreement.',
    );
  }

  if (materials.includes("Other students' work")) {
    risks.push(
      "Sharing another student's work with an AI tool may violate their intellectual property rights and your institution's conduct policies.",
    );
  }

  return risks;
}

// ----------------------------------------------------------
// Build safer alternative text
// ----------------------------------------------------------
function buildSaferAlternative(action: AIAction, task: TaskType): string {
  const alts: Partial<Record<AIAction, string>> = {
    'Generate draft text':
      'Write your own first draft, even if it is rough. Then use AI to give you feedback on what you have written — rather than generating the text for you.',
    'Paraphrase text':
      'Read the source yourself, close it, and write a summary in your own words from memory. This paraphrasing-from-memory approach is the most academically sound method.',
    'Summarise sources':
      'Read the abstract and conclusion of each source yourself. Take your own brief notes before consulting AI. Never submit AI summaries without verifying them against the original text.',
    'Generate citations / references':
      'Use a reference manager such as Zotero, Mendeley, or your library\'s citation tool. Always verify every reference against the original source before submitting.',
    'Rewrite my sentences':
      'Read your draft aloud to find unclear sentences. Then rewrite them yourself. You can ask AI to explain why a sentence is unclear, but do the rewriting in your own words.',
    'Create an outline':
      'Try drafting a rough mind map or bullet list of your main points first. Then ask AI to react to your outline or point out gaps, rather than generating one from scratch.',
    'Suggest structure':
      'Look at published examples in your field for structural inspiration. Ask your tutor for guidance on the expected format before turning to AI.',
    'Improve academic style':
      'Consult your institution\'s academic writing guide or writing support service. Many offer free workshops or one-to-one sessions.',
    'Analyse data':
      'Contact your institution\'s statistical support service or consult your supervisor directly for guidance on analysis methods.',
  };

  if (task === 'Reflection' && action === 'Rewrite my sentences') {
    return 'For reflections, write in your own voice throughout. If you are struggling, try talking through your experience aloud first, then write what you said. Reflections are assessed on personal insight, not style.';
  }

  return (
    alts[action] ??
    'Consider working through this part of the task yourself first. Then use AI as a reviewer or explainer — someone to react to your ideas — rather than as a producer of content.'
  );
}

// ----------------------------------------------------------
// Build next action guidance
// ----------------------------------------------------------
function buildNextAction(verdict: Verdict, policy: CoursePolicy): string {
  if (verdict === 'RED') {
    return 'We recommend not proceeding with this AI use as described. If your situation seems different from the general case, contact your teacher directly before using AI — do not assume it will be acceptable.';
  }
  if (verdict === 'AMBER') {
    return 'Proceed carefully. Consider the risks described, check your assignment brief for any specific guidance on AI, and be ready to disclose your use if required.';
  }
  // GREEN
  if (policy === 'AI allowed only with disclosure') {
    return 'You can proceed. Keep a record of what AI tool you used, how you used it, and what changes you made to its output. You will need this for your disclosure statement.';
  }
  return 'You can proceed, but use AI as a support tool rather than a replacement for your own thinking. Keep a note of how you used it in case disclosure is required later.';
}

// ----------------------------------------------------------
// Main export: compute a verdict from checker answers
// ----------------------------------------------------------
export function computeVerdict(answers: CheckerAnswers): VerdictResult {
  const { task, stage, action, policy, materials } = answers;

  const hasSensitive = materials.some((m) => SENSITIVE_MATERIALS.includes(m));
  const isNoAI = policy === 'No AI allowed';
  const isDisclosure = policy === 'AI allowed only with disclosure';
  const isUnclear = ['No specific policy given by teacher', 'Institution-level guidance only', 'I am not sure'].includes(
    policy,
  );

  // ----------------------------------------------------------
  // HARD OVERRIDE: No AI policy
  // ----------------------------------------------------------
  if (isNoAI) {
    const reasons = [
      'Your course policy does not permit AI use. Even low-risk AI assistance conflicts with your stated rules.',
    ];
    const risks = ['Using AI could constitute a breach of academic integrity policy under your course rules, regardless of how the AI is used.'];
    const extras = [
      'Check your assignment brief carefully. If you believe the restriction might not apply to your specific use, ask your tutor directly before using any AI tool.',
    ];
    return {
      verdict: 'RED',
      score: 10,
      reasons,
      risks,
      safer: buildSaferAlternative(action, task),
      nextAction: 'Do not use AI for this task. If you believe your situation warrants an exception, speak to your tutor before proceeding.',
      disclosure: null,
      hasSensitive,
      isUnclear: false,
      isDisclosure: false,
      extras,
      task,
      stage,
      action,
      policy,
      materials,
    };
  }

  // ----------------------------------------------------------
  // Compute score
  // ----------------------------------------------------------
  let score = ACTION_SCORES[action] ?? 5;

  // Apply modifiers
  score += getTaskModifier(task, action);
  score += getStageModifier(stage, action);
  score += getPolicyActionModifier(policy, action);

  // Sensitive materials override: escalate to at least 7
  if (hasSensitive) {
    score = Math.max(score, 7);
  }

  // Other students' work: escalate to at least 8
  if (materials.includes("Other students' work")) {
    score = Math.max(score, 8);
  }

  // Disclosure policy: ensure at least Amber
  if (isDisclosure) {
    score = Math.max(score, 3);
  }

  // Clamp score
  score = Math.max(0, Math.min(10, score));

  // ----------------------------------------------------------
  // Map score to verdict
  // ----------------------------------------------------------
  let verdict: Verdict;
  if (score <= 2) verdict = 'GREEN';
  else if (score <= 5) verdict = 'AMBER';
  else verdict = 'RED';

  // ----------------------------------------------------------
  // HARD VERDICT OVERRIDES
  // These ensure specific high-risk combinations are always RED
  // regardless of score arithmetic.
  // ----------------------------------------------------------

  // Generating draft text for assessed work is always RED
  if (action === 'Generate draft text' && task !== 'Exam preparation') {
    verdict = 'RED';
    score = Math.max(score, 9);
  }

  // Paraphrasing source text is always RED
  if (action === 'Paraphrase text') {
    verdict = 'RED';
    score = Math.max(score, 7);
  }

  // Language-only policy + non-language action escalates to at least AMBER
  if (
    policy === 'AI allowed for language support only' &&
    !LANGUAGE_ACTIONS.includes(action) &&
    !SAFE_SUPPORT_ACTIONS.includes(action) &&
    verdict === 'GREEN'
  ) {
    verdict = 'AMBER';
  }

  // ----------------------------------------------------------
  // Build result components
  // ----------------------------------------------------------
  const reasons = buildReasons(action, task, stage, policy, hasSensitive, score);
  const risks = buildRisks(action, task, hasSensitive, materials);
  const safer = buildSaferAlternative(action, task);
  const nextAction = buildNextAction(verdict, policy);
  const disclosure = verdict !== 'RED' ? generateDisclosure(action, task, stage) : null;
  const extras: string[] = [];

  // Add extra note for exam prep
  if (task === 'Exam preparation' && action === 'Generate draft text') {
    extras.push(
      'Since this is exam preparation rather than assessed writing, generating practice material is treated differently. Make sure you are using AI output to learn from, not to memorise as if it were authoritative.',
    );
  }

  return {
    verdict,
    score,
    reasons,
    risks,
    safer,
    nextAction,
    disclosure,
    hasSensitive,
    isUnclear,
    isDisclosure,
    extras,
    task,
    stage,
    action,
    policy,
    materials,
  };
}
