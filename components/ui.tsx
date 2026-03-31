'use client';

import React from 'react';
import type { Verdict } from '@/types';

// ----------------------------------------------------------
// VerdictBadge
// ----------------------------------------------------------
interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
}

const VERDICT_CONFIG = {
  GREEN: {
    label: 'Green — Likely acceptable',
    shortLabel: 'Green',
    symbol: '✓',
    bgClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-800',
    iconBg: 'bg-green-700',
    dotClass: 'bg-green-700',
  },
  AMBER: {
    label: 'Amber — Proceed with caution',
    shortLabel: 'Amber',
    symbol: '!',
    bgClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-900',
    iconBg: 'bg-amber-600',
    dotClass: 'bg-amber-500',
  },
  RED: {
    label: 'Red — Likely not appropriate',
    shortLabel: 'Red',
    symbol: '✕',
    bgClass: 'bg-red-50 border-red-200',
    textClass: 'text-red-900',
    iconBg: 'bg-red-700',
    dotClass: 'bg-red-700',
  },
} as const;

export function VerdictBadge({ verdict, size = 'md' }: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict];
  const iconSize = size === 'lg' ? 'w-10 h-10 text-base' : size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';
  const labelSize = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bgClass}`}>
      <span className={`${iconSize} rounded-full ${config.iconBg} text-white flex items-center justify-center font-bold shrink-0`}>
        {config.symbol}
      </span>
      <span className={`${labelSize} font-semibold ${config.textClass}`}>
        {size === 'sm' ? config.shortLabel : config.label}
      </span>
    </div>
  );
}

// ----------------------------------------------------------
// VerdictCard (large result display)
// ----------------------------------------------------------
interface VerdictCardProps {
  verdict: Verdict;
  summary: string;
}

export function VerdictCard({ verdict, summary }: VerdictCardProps) {
  const config = VERDICT_CONFIG[verdict];
  return (
    <div className={`rounded-2xl border-2 p-6 ${config.bgClass} mb-6`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full ${config.iconBg} text-white flex items-center justify-center text-lg font-bold shrink-0`}>
          {config.symbol}
        </div>
        <h2 className={`text-2xl font-serif font-semibold ${config.textClass}`}>
          {config.label}
        </h2>
      </div>
      <p className={`text-sm leading-relaxed ${config.textClass} opacity-90`}>{summary}</p>
    </div>
  );
}

// ----------------------------------------------------------
// ResultSection
// ----------------------------------------------------------
interface ResultSectionProps {
  heading: string;
  children: React.ReactNode;
  className?: string;
  full?: boolean;
}

export function ResultSection({ heading, children, className = '', full = false }: ResultSectionProps) {
  return (
    <div className={`bg-white border border-stone-200 rounded-xl p-4 ${full ? 'col-span-2' : ''} ${className}`}>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
        {heading}
      </h4>
      <div className="text-sm text-stone-700 leading-relaxed">{children}</div>
    </div>
  );
}

// ----------------------------------------------------------
// WarningBox (privacy / data alert)
// ----------------------------------------------------------
interface WarningBoxProps {
  children: React.ReactNode;
}

export function WarningBox({ children }: WarningBoxProps) {
  return (
    <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 my-4">
      <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">⚠</span>
      <div className="text-sm text-amber-900 leading-relaxed">{children}</div>
    </div>
  );
}

// ----------------------------------------------------------
// InfoBox (neutral informational notice)
// ----------------------------------------------------------
interface InfoBoxProps {
  children: React.ReactNode;
}

export function InfoBox({ children }: InfoBoxProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 my-4">
      <div className="text-sm text-blue-900 leading-relaxed">{children}</div>
    </div>
  );
}

// ----------------------------------------------------------
// DisclaimerNote (always shown at bottom of results)
// ----------------------------------------------------------
export function DisclaimerNote() {
  return (
    <p className="text-xs text-stone-400 bg-white border border-stone-200 rounded-lg px-4 py-3 mt-4">
      This result is guidance, not an official institutional ruling. Your module or course rules always take
      priority. When in doubt, ask your teacher.
    </p>
  );
}

// ----------------------------------------------------------
// SectionTitle
// ----------------------------------------------------------
export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-serif font-semibold text-stone-900 mb-1">{title}</h1>
      {subtitle && <p className="text-stone-500">{subtitle}</p>}
    </div>
  );
}

// ----------------------------------------------------------
// StepLabel (checker form)
// ----------------------------------------------------------
export function StepLabel({ step, total }: { step: number; total: number }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">
      Step {step} of {total}
    </p>
  );
}

// ----------------------------------------------------------
// ProgressBar (checker form)
// ----------------------------------------------------------
export function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-8" role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
            i < current ? 'bg-blue-600' : i === current ? 'bg-blue-300' : 'bg-stone-200'
          }`}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------
// OptionButton (checker form selections)
// ----------------------------------------------------------
interface OptionButtonProps {
  label: string;
  selected: boolean;
  sensitive?: boolean;
  onClick: () => void;
}

export function OptionButton({ label, selected, sensitive = false, onClick }: OptionButtonProps) {
  const base = 'px-3 py-2.5 border rounded-lg text-sm text-left font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer';
  const stateClass = selected
    ? sensitive
      ? 'border-red-400 bg-red-50 text-red-800'
      : 'border-blue-500 bg-blue-50 text-blue-800'
    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50';

  return (
    <button className={`${base} ${stateClass}`} onClick={onClick} type="button">
      {label}
    </button>
  );
}
