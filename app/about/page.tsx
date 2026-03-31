import { SectionTitle } from '@/components/ui';

export const metadata = {
  title: 'AI Use Checker — About',
};

export default function AboutPage() {
  return (
    <div>
      <SectionTitle
        title="About this tool"
        subtitle="What it does, how it works, and what it cannot tell you."
      />

      <div className="space-y-10">
        {/* What it does */}
        <section>
          <h2 className="text-xl font-serif font-semibold text-stone-900 mb-3">
            What this tool does
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-3">
            AI Use Checker helps students and teachers in higher education decide whether a specific
            use of AI is likely acceptable, uncertain, or inappropriate — given the task type, the
            stage of work, the intended AI action, course policy, and the materials involved.
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            It is designed for practical, pre-use decision support. Use it before you start, to
            understand the risks and your options.
          </p>
        </section>

        {/* What it does NOT do */}
        <section>
          <h2 className="text-xl font-serif font-semibold text-stone-900 mb-3">
            What this tool does not do
          </h2>
          <ul className="space-y-2">
            {[
              'Detect AI-generated text',
              'Check for plagiarism',
              'Score or grade your writing',
              'Determine academic misconduct',
              'Replace your institution\'s academic integrity policy',
              'Guarantee compliance with any specific course or institutional rules',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                <span className="text-stone-400 mt-0.5 shrink-0">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Understanding verdicts */}
        <section>
          <h2 className="text-xl font-serif font-semibold text-stone-900 mb-4">
            Understanding Green, Amber, and Red
          </h2>

          <div className="space-y-3">
            <div className="flex gap-4 items-start bg-green-50 border border-green-200 rounded-xl p-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-300 text-green-800 text-xs font-bold shrink-0 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-700" />
                Green
              </span>
              <div>
                <strong className="text-sm text-green-900 block mb-1">Likely acceptable</strong>
                <p className="text-sm text-green-800 leading-relaxed">
                  This use of AI is unlikely to cause problems in most academic contexts. Low risk
                  does not mean zero risk — always consider your specific course rules before
                  proceeding.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-amber-50 border border-amber-200 rounded-xl p-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shrink-0 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Amber
              </span>
              <div>
                <strong className="text-sm text-amber-900 block mb-1">Proceed with caution</strong>
                <p className="text-sm text-amber-800 leading-relaxed">
                  This use is in a grey area. It may be acceptable under some policies but not
                  others. Disclosure is usually required. Check your assignment brief and consider
                  whether the risk is worth taking.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-red-50 border border-red-200 rounded-xl p-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-900 text-xs font-bold shrink-0 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-red-700" />
                Red
              </span>
              <div>
                <strong className="text-sm text-red-900 block mb-1">Likely not appropriate</strong>
                <p className="text-sm text-red-800 leading-relaxed">
                  This use is likely to be considered academic misconduct, a privacy violation, or
                  otherwise inappropriate. We recommend not proceeding without direct confirmation
                  from your teacher.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How verdicts work */}
        <section>
          <h2 className="text-xl font-serif font-semibold text-stone-900 mb-3">
            How verdicts are computed
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-3">
            Verdicts come from a rules-based engine, not from an AI making ad hoc judgments. The
            engine considers five factors:
          </p>
          <ul className="space-y-1.5 mb-4">
            {[
              'The type of AI action (language support, structural support, content generation, etc.)',
              'The task type (essay, reflection, lab report, exam preparation, etc.)',
              'The stage of work (drafting, proofreading, brainstorming, etc.)',
              'The stated course policy on AI',
              'The sensitivity of any materials being shared with the AI tool',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                <span className="text-blue-400 mt-0.5 shrink-0">▸</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-stone-600 leading-relaxed">
            Privacy risks and explicit &ldquo;no AI&rdquo; policies act as hard overrides that
            escalate verdicts to Red regardless of other factors. The complete rule logic is visible
            in the Teacher view and in the source file{' '}
            <code className="bg-stone-100 px-1 rounded text-xs">lib/rules-engine.ts</code>.
          </p>
        </section>

        {/* Course rules */}
        <section>
          <h2 className="text-xl font-serif font-semibold text-stone-900 mb-3">
            Course rules always take priority
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            The verdicts in this app represent general guidance based on common academic integrity
            principles in higher education. Your institution, school, faculty, course, or individual
            teacher may have specific rules that differ — and those rules take precedence over
            anything this app tells you. When in doubt, ask your teacher before using AI.
          </p>
        </section>

        {/* Data and privacy */}
        <section>
          <h2 className="text-xl font-serif font-semibold text-stone-900 mb-3">
            Data and privacy
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            This app processes all information locally in your browser using session storage.
            Nothing you enter is sent to a server or stored beyond your current session. No account
            is required. Closing or refreshing the tab clears all data.
          </p>
        </section>
      </div>

      {/* Footer note */}
      <div className="mt-10 bg-stone-100 border border-stone-200 rounded-xl p-4 text-xs text-stone-500">
        AI Use Checker — guidance tool for higher education. Not affiliated with any institution.
        For educational purposes only. Always follow your institution&apos;s official academic
        integrity policy.
      </div>
    </div>
  );
}
