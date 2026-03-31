'use client';

import { useState } from 'react';
import { POLICY_PRESETS, RULE_MATRIX } from '@/data/policy-presets';
import type { PolicyPreset } from '@/types';
import { SectionTitle } from '@/components/ui';

const PRESET_COLORS: Record<string, string> = {
  red: 'border-red-200 bg-red-50',
  amber: 'border-amber-200 bg-amber-50',
  blue: 'border-blue-200 bg-blue-50',
  green: 'border-green-200 bg-green-50',
};

const PRESET_ACTIVE_COLORS: Record<string, string> = {
  red: 'border-red-400 bg-red-100 ring-2 ring-red-300',
  amber: 'border-amber-400 bg-amber-100 ring-2 ring-amber-300',
  blue: 'border-blue-400 bg-blue-100 ring-2 ring-blue-300',
  green: 'border-green-400 bg-green-100 ring-2 ring-green-300',
};

const VERDICT_PILL: Record<string, string> = {
  Green: 'bg-green-50 text-green-800 border-green-200',
  Amber: 'bg-amber-50 text-amber-900 border-amber-200',
  'Amber → Red': 'bg-amber-50 text-amber-900 border-amber-200',
  'Green → Amber': 'bg-green-50 text-green-800 border-green-200',
  Red: 'bg-red-50 text-red-900 border-red-200',
  'Red (hard override)': 'bg-red-50 text-red-900 border-red-200',
  '→ Red': 'bg-red-50 text-red-900 border-red-200',
  '+ 3 score (often → Red)': 'bg-orange-50 text-orange-900 border-orange-200',
};

export default function TeacherPage() {
  const [activePreset, setActivePreset] = useState<string | null>(null);

function handleExport() {
    const found = activePreset
      ? POLICY_PRESETS.find((p) => p.id === activePreset)
      : undefined;
    const preset: PolicyPreset | null = found ?? null;

    const html = buildExportHTML(preset);
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.print();
  }

  const activePresetData = POLICY_PRESETS.find((p) => p.id === activePreset) ?? null;

  return (
    <div>
      <SectionTitle
        title="Teacher & staff view"
        subtitle="Configure a policy preset, review the rule logic, and export a student-facing guidance summary."
      />

      {/* Step 1: Preset */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-stone-900 mb-4">
          1. Select a policy preset
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {POLICY_PRESETS.map((preset) => {
            const isActive = activePreset === preset.id;
            const colorClass = isActive
              ? PRESET_ACTIVE_COLORS[preset.color]
              : PRESET_COLORS[preset.color];

            return (
              <button
                key={preset.id}
                onClick={() => setActivePreset(isActive ? null : preset.id)}
                className={`text-left border rounded-xl p-4 transition-all cursor-pointer ${colorClass}`}
              >
                <h4 className="text-sm font-semibold text-stone-900 mb-1">{preset.label}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{preset.description}</p>
                {isActive && (
                  <p className="text-xs font-medium mt-2 text-blue-700">
                    ✓ Active — this preset is selected
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {activePresetData && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
            <strong>Active preset:</strong> {activePresetData.label} — The rule engine will treat
            policy as &ldquo;<em>{activePresetData.policy}</em>&rdquo; for demonstration purposes.
          </div>
        )}
      </section>

      {/* Step 2: Rule matrix */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-stone-900 mb-2">
          2. Rule engine overview
        </h2>
        <p className="text-sm text-stone-500 mb-4">
          These are the core decision rules used to compute verdicts. The logic is fully
          deterministic — no AI decides the outcome. You can inspect and edit the rules in{' '}
          <code className="bg-stone-100 px-1 py-0.5 rounded text-xs">lib/rules-engine.ts</code>.
        </p>

        <div className="overflow-x-auto border border-stone-200 rounded-xl bg-white">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-3 py-2.5 font-semibold text-stone-500 uppercase tracking-wide text-xs">
                  Category
                </th>
                <th className="text-left px-3 py-2.5 font-semibold text-stone-500 uppercase tracking-wide text-xs">
                  AI action
                </th>
                <th className="text-left px-3 py-2.5 font-semibold text-stone-500 uppercase tracking-wide text-xs hidden sm:table-cell">
                  Policy context
                </th>
                <th className="text-left px-3 py-2.5 font-semibold text-stone-500 uppercase tracking-wide text-xs">
                  Base verdict
                </th>
              </tr>
            </thead>
            <tbody>
              {RULE_MATRIX.map((row, i) => {
                const pillClass =
                  VERDICT_PILL[row.baseVerdict] ?? 'bg-stone-50 text-stone-700 border-stone-200';
                return (
                  <tr key={i} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                    <td className="px-3 py-2.5 text-stone-600 font-medium">{row.category}</td>
                    <td className="px-3 py-2.5 text-stone-700">{row.action}</td>
                    <td className="px-3 py-2.5 text-stone-500 hidden sm:table-cell">
                      {row.policyContext}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded border text-xs font-semibold ${pillClass}`}
                      >
                        {row.baseVerdict}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-stone-400 mt-2">
          Privacy and no-AI-policy overrides can escalate any verdict to Red, regardless of base
          score. Full logic is in <code className="bg-stone-100 px-1 rounded">lib/rules-engine.ts</code>.
        </p>
      </section>

      {/* Step 3: Export */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-stone-900 mb-2">
          3. Export student guidance
        </h2>
        <p className="text-sm text-stone-500 mb-4">
          Generate a printable one-page summary you can share with students or include in your
          course guide. Opens a print dialog.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Export printable guidance
          </button>
        </div>
      </section>
    </div>
  );
}

// ----------------------------------------------------------
// Build printable HTML for export
// ----------------------------------------------------------
function buildExportHTML(preset: PolicyPreset | null): string {
  const title = preset ? preset.label : 'General AI use guidance';
  const policy = preset ? preset.policy : 'See your assignment brief and teacher\'s instructions.';
  const date = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>AI Use Guidance — ${title}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, serif; max-width: 700px; margin: 2cm auto; color: #1a1a1a; font-size: 13px; line-height: 1.7; }
  h1 { font-size: 20px; border-bottom: 2px solid #333; padding-bottom: .5rem; margin-bottom: 1rem; }
  h2 { font-size: 15px; margin-top: 1.5rem; margin-bottom: .5rem; }
  p { margin-bottom: .5rem; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 4px; font-weight: bold; font-size: 11px; margin-right: 6px; font-family: sans-serif; }
  .g { background: #d4f0dc; color: #1a5c2e; }
  .a { background: #fff0cc; color: #6b4400; }
  .r { background: #fde0e0; color: #7a1a1a; }
  table { border-collapse: collapse; width: 100%; margin-top: .5rem; font-size: 12px; }
  td, th { border: 1px solid #ccc; padding: 5px 8px; text-align: left; }
  th { background: #f5f5f0; font-weight: bold; font-family: sans-serif; font-size: 11px; }
  ul { padding-left: 1.25rem; margin-top: .3rem; }
  li { margin-bottom: .3rem; }
  footer { margin-top: 2rem; font-size: 10px; color: #888; border-top: 1px solid #ddd; padding-top: .5rem; font-family: sans-serif; }
  .policy-box { background: #f0f0e8; border: 1px solid #ccc; padding: .5rem .75rem; border-radius: 4px; font-family: sans-serif; font-size: 12px; margin-bottom: 1rem; }
</style>
</head>
<body>
<h1>AI Use Guidance — ${title}</h1>
<div class="policy-box"><strong>Course policy:</strong> ${policy}${preset ? ` — ${preset.description}` : ''}</div>

<h2>Traffic light guide</h2>
<p><span class="badge g">GREEN</span> Likely acceptable — low risk for most policies.</p>
<p><span class="badge a">AMBER</span> Proceed with caution — may require disclosure or teacher clarification.</p>
<p><span class="badge r">RED</span> Likely not appropriate — high risk of misconduct or privacy violation.</p>

<h2>Quick reference: common AI uses</h2>
<table>
  <tr><th>AI use</th><th>Typical verdict</th><th>Notes</th></tr>
  <tr><td>Explain a concept or task</td><td><span class="badge g">GREEN</span></td><td>Generally low risk in all contexts</td></tr>
  <tr><td>Brainstorm ideas</td><td><span class="badge g">GREEN</span></td><td>Disclose if required by policy</td></tr>
  <tr><td>Improve grammar / spelling</td><td><span class="badge g">GREEN</span></td><td>Language support on student's own draft</td></tr>
  <tr><td>Improve academic style</td><td><span class="badge a">AMBER</span></td><td>Check policy; always disclose</td></tr>
  <tr><td>Generate outline or structure</td><td><span class="badge a">AMBER</span></td><td>Ideas must be entirely the student's own</td></tr>
  <tr><td>Summarise sources</td><td><span class="badge a">AMBER</span></td><td>Always verify against original texts</td></tr>
  <tr><td>Feedback on clarity / argument</td><td><span class="badge a">AMBER</span></td><td>Disclosure required in most cases</td></tr>
  <tr><td>Draft slides (presentation)</td><td><span class="badge a">AMBER</span></td><td>Content and argument must be student's own</td></tr>
  <tr><td>Paraphrase source text</td><td><span class="badge r">RED</span></td><td>Likely misconduct when submitted as own work</td></tr>
  <tr><td>Generate citations / references</td><td><span class="badge r">RED</span></td><td>AI hallucinates references — never submit unverified</td></tr>
  <tr><td>Generate draft text (assessed)</td><td><span class="badge r">RED</span></td><td>Likely misconduct for assessed writing</td></tr>
  <tr><td>Rewrite a reflection</td><td><span class="badge r">RED</span></td><td>Undermines the authentic purpose of the task</td></tr>
  <tr><td>Share personal / research data</td><td><span class="badge r">RED</span></td><td>GDPR and data protection risk</td></tr>
</table>

<h2>Privacy reminder</h2>
<p>Students must not share the following with public AI tools (ChatGPT, Claude, Gemini, etc.):</p>
<ul>
  <li>Personal data of real individuals (names, contact details, identifiers)</li>
  <li>Unpublished research data or interview transcripts</li>
  <li>Sensitive or clinical case information</li>
  <li>Other students' work</li>
</ul>

<h2>Disclosure guidance</h2>
<p>Where AI use is permitted, students should record: what tool they used, how they used it, and what they changed. A disclosure note might read:</p>
<p style="font-style:italic;margin-left:1rem">"I used a generative AI tool to [specific use]. I reviewed all output and made my own decisions throughout. The ideas and analysis are my own."</p>

<h2>Always remember</h2>
<ul>
  <li>Course and module rules override any general guidance</li>
  <li>When in doubt, students should ask their teacher before using AI</li>
  <li>AI-generated text submitted as the student's own work is misconduct</li>
  <li>This tool provides guidance, not an institutional ruling</li>
</ul>

<footer>
  Generated by AI Use Checker (ai-use-checker) — guidance only, not an official institutional ruling. ${date}
</footer>
</body>
</html>`;
}
