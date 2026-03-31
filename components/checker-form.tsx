'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TASK_TYPES,
  STAGES,
  AI_ACTIONS,
  POLICY_OPTIONS,
  MATERIAL_OPTIONS,
  SENSITIVE_MATERIAL_OPTIONS,
} from '@/data/policy-presets';
import type { CheckerAnswers, Material } from '@/types';
import { ProgressBar, StepLabel, OptionButton, WarningBox } from '@/components/ui';

// We store the result in sessionStorage so the result page
// can read it without needing a backend.
const RESULT_STORAGE_KEY = 'aiuc_result_answers';

interface Step {
  key: keyof CheckerAnswers;
  title: string;
  hint: string;
  options: readonly string[];
  multi: boolean;
}

const STEPS: Step[] = [
  {
    key: 'task',
    title: 'What kind of task is this?',
    hint: 'Select the closest match to your assignment type.',
    options: TASK_TYPES,
    multi: false,
  },
  {
    key: 'stage',
    title: 'What stage are you at?',
    hint: 'Where in your process are you right now?',
    options: STAGES,
    multi: false,
  },
  {
    key: 'action',
    title: 'What do you want AI to do?',
    hint: 'Choose the one that best describes your intended use.',
    options: AI_ACTIONS,
    multi: false,
  },
  {
    key: 'policy',
    title: 'What are your course rules on AI?',
    hint: 'Select the option that best matches what you have been told.',
    options: POLICY_OPTIONS,
    multi: false,
  },
  {
    key: 'materials',
    title: 'What material are you sharing with AI?',
    hint: 'Select all that apply. This affects the privacy risk assessment.',
    options: MATERIAL_OPTIONS,
    multi: true,
  },
];

export function CheckerForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<CheckerAnswers>>({
    materials: [],
  });

  const currentStep = STEPS[step];
  const totalSteps = STEPS.length;
  const isLastStep = step === totalSteps - 1;

  // Get current value(s) for this step
  const currentValue = answers[currentStep.key];
  const selectedValues = currentStep.multi
    ? (currentValue as Material[]) ?? []
    : (currentValue as string | undefined);

  const hasSensitiveSelected =
    currentStep.key === 'materials' &&
    (selectedValues as Material[]).some((m) =>
      (SENSITIVE_MATERIAL_OPTIONS as readonly string[]).includes(m),
    );

  const canProceed = currentStep.multi
    ? (selectedValues as Material[]).length > 0
    : !!selectedValues;

  function handleSingleSelect(value: string) {
    setAnswers((prev) => ({ ...prev, [currentStep.key]: value }));
  }

  function handleMultiToggle(value: string) {
    setAnswers((prev) => {
      const current = (prev.materials ?? []) as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, materials: next as Material[] };
    });
  }

  function handleNext() {
    if (isLastStep) {
      // Store answers and navigate to result page
      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(answers));
      router.push('/result');
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8">
      <ProgressBar current={step} total={totalSteps} />

      <div className="mb-6">
        <StepLabel step={step + 1} total={totalSteps} />
        <h2 className="text-xl font-serif font-semibold text-stone-900 mb-1">
          {currentStep.title}
        </h2>
        <p className="text-sm text-stone-500">{currentStep.hint}</p>
      </div>

      {currentStep.multi && (
        <p className="text-xs text-stone-400 mb-3">Select all that apply</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
        {currentStep.options.map((option) => {
          const isSensitive = (SENSITIVE_MATERIAL_OPTIONS as readonly string[]).includes(option);
          const selected = currentStep.multi
            ? (selectedValues as string[]).includes(option)
            : selectedValues === option;

          return (
            <OptionButton
              key={option}
              label={option}
              selected={selected}
              sensitive={isSensitive && selected}
              onClick={() =>
                currentStep.multi
                  ? handleMultiToggle(option)
                  : handleSingleSelect(option)
              }
            />
          );
        })}
      </div>

      {hasSensitiveSelected && (
        <WarningBox>
          <strong>Privacy alert:</strong> You have selected sensitive materials. Public AI tools
          (such as ChatGPT, Claude, or Gemini) process data on external servers. Sharing personal
          data, unpublished research, or identifiable case information with these tools may violate
          GDPR, your institution&apos;s data policy, or your research ethics agreement. Consider
          using an institution-approved tool, or anonymise all data before using any public AI
          service.
        </WarningBox>
      )}

      <div className="flex justify-between items-center pt-5 border-t border-stone-100">
        <div>
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
            >
              ← Back
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className="px-5 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLastStep ? 'Get my result →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

// Export the storage key so the result page can use it
export { RESULT_STORAGE_KEY };
