'use client';

import { useState } from 'react';
import { EXAMPLE_SCENARIOS } from '@/data/example-scenarios';
import { computeVerdict } from '@/lib/rules-engine';
import { ResultView } from '@/components/result-view';
import { SectionTitle, VerdictBadge } from '@/components/ui';
import type { ExampleScenario, Verdict } from '@/types';

const VERDICT_SYMBOL: Record<Verdict, string> = {
  GREEN: '✓',
  AMBER: '!',
  RED: '✕',
};

const VERDICT_ICON_CLASS: Record<Verdict, string> = {
  GREEN: 'bg-green-50 text-green-800 border-green-200',
  AMBER: 'bg-amber-50 text-amber-900 border-amber-200',
  RED: 'bg-red-50 text-red-900 border-red-200',
};

export default function ScenariosPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (activeIndex !== null) {
    const scenario = EXAMPLE_SCENARIOS[activeIndex];
    const result = computeVerdict({
      task: scenario.task,
      stage: scenario.stage,
      action: scenario.action,
      policy: scenario.policy,
      materials: scenario.materials,
    });

    return (
      <div>
        <button
          onClick={() => setActiveIndex(null)}
          className="mb-6 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
        >
          ← All examples
        </button>
        <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-6">
          {scenario.question}
        </h2>
        <ResultView result={result} />
      </div>
    );
  }

  return (
    <div>
      <SectionTitle
        title="Example scenarios"
        subtitle="Twelve common situations, pre-evaluated. Click any to see the full reasoning."
      />

      <div className="space-y-2">
        {EXAMPLE_SCENARIOS.map((scenario, i) => (
          <ScenarioCard
            key={i}
            scenario={scenario}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>

      <div className="mt-8 bg-stone-100 border border-stone-200 rounded-xl p-4 text-sm text-stone-500">
        These scenarios use the same rule engine as the checker. Clicking through shows the full
        reasoning, risks, and safer alternatives for each case.
      </div>
    </div>
  );
}

function ScenarioCard({
  scenario,
  onClick,
}: {
  scenario: ExampleScenario;
  onClick: () => void;
}) {
  const { verdict, question, summary } = scenario;
  const iconClass = VERDICT_ICON_CLASS[verdict];
  const symbol = VERDICT_SYMBOL[verdict];

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-stone-200 rounded-xl p-4 hover:border-stone-300 hover:bg-stone-50 transition-all flex items-start gap-4 group"
    >
      {/* Verdict icon */}
      <div
        className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold shrink-0 ${iconClass}`}
        aria-label={`Verdict: ${verdict}`}
      >
        {symbol}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-stone-900 mb-0.5 group-hover:text-blue-700 transition-colors">
          {question}
        </h4>
        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{summary}</p>
      </div>

      <span className="text-stone-300 group-hover:text-stone-500 transition-colors text-sm shrink-0 mt-0.5">
        →
      </span>
    </button>
  );
}
