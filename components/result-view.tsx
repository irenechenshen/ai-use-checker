'use client';

import Link from 'next/link';
import type { VerdictResult } from '@/types';
import {
  VerdictCard,
  ResultSection,
  WarningBox,
  InfoBox,
  DisclaimerNote,
} from '@/components/ui';

interface ResultViewProps {
  result: VerdictResult;
}

export function ResultView({ result }: ResultViewProps) {
  const {
    verdict,
    reasons,
    risks,
    safer,
    nextAction,
    disclosure,
    hasSensitive,
    isUnclear,
    extras,
  } = result;

  return (
    <div>
      {/* Verdict card */}
      <VerdictCard verdict={verdict} summary={reasons[0] ?? ''} />

      {/* Confidence note for unclear policy */}
      {isUnclear && (
        <InfoBox>
          <strong>Policy note:</strong> Your course policy is unclear. This result is based on
          general best practice for higher education. Check your assignment brief and confirm with
          your teacher before proceeding.
        </InfoBox>
      )}

      {/* Privacy warning */}
      {hasSensitive && (
        <WarningBox>
          <strong>Privacy risk flagged:</strong> You indicated you may share sensitive materials
          with an AI tool. Public AI tools are not appropriate for personal data, unpublished
          research, or identifiable case information. Consider anonymising data first or using an
          institution-approved tool.
        </WarningBox>
      )}

      {/* Result sections grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <ResultSection heading="Why this result?">
          {reasons.map((r, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>
              {r}
            </p>
          ))}
        </ResultSection>

        <ResultSection heading="Main risk">
          {risks.length > 0 ? (
            <ul className="space-y-1.5">
              {risks.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 mt-0.5 text-red-400">▸</span>
                  {r}
                </li>
              ))}
            </ul>
          ) : (
            <p>Low risk when used as described. Always check your specific course rules.</p>
          )}
        </ResultSection>

        <ResultSection heading="Safer approach">
          <p>{safer}</p>
        </ResultSection>

        <ResultSection heading="What to do next">
          <p>{nextAction}</p>
        </ResultSection>

        {extras.length > 0 && (
          <ResultSection heading="Additional guidance" full>
            {extras.map((e, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>
                {e}
              </p>
            ))}
          </ResultSection>
        )}
      </div>

      {/* Disclosure builder */}
      {disclosure && verdict !== 'RED' && (
        <div className="border-2 border-dashed border-stone-300 rounded-xl p-5 mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
            Suggested disclosure statement
          </h4>
          <blockquote className="font-serif italic text-stone-700 border-l-4 border-stone-300 pl-4 text-sm leading-relaxed mb-3">
            {disclosure}
          </blockquote>
          <p className="text-xs text-stone-400">
            You could adapt this for your assignment submission. Always check your institution&apos;s
            disclosure requirements. This wording does not guarantee compliance with any specific
            policy.
          </p>
        </div>
      )}

      {/* Try this instead (RED only) */}
      {verdict === 'RED' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-2">
            Try this instead
          </h4>
          <p className="text-sm text-red-900 leading-relaxed">
            {safer} If you need academic support, contact your institution&apos;s writing or
            academic skills service.
          </p>
        </div>
      )}

      <DisclaimerNote />

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Link
          href="/checker"
          className="px-5 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors"
        >
          Check another scenario
        </Link>
        <Link
          href="/scenarios"
          className="px-5 py-2.5 bg-white text-stone-700 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors"
        >
          Browse examples
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-white text-stone-600 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors"
        >
          Print result
        </button>
      </div>
    </div>
  );
}
