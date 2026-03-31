import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="text-center py-12 pb-10">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold text-stone-900 mb-4 leading-tight">
          Should I use AI<br className="hidden sm:block" /> for this?
        </h1>
        <p className="text-lg text-stone-500 max-w-xl mx-auto mb-8 leading-relaxed">
          A practical decision-support tool for students and teachers in higher education.
          Describe your situation and get a clear, reasoned answer in under a minute.
        </p>

        {/* Verdict badges */}
        <div className="flex justify-center gap-3 flex-wrap mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-800 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-700 shrink-0" />
            Green — likely acceptable
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            Amber — proceed with caution
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-900 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-700 shrink-0" />
            Red — likely not appropriate
          </span>
        </div>

        <Link
          href="/checker"
          className="inline-block px-7 py-3.5 bg-blue-700 text-white rounded-xl text-base font-semibold hover:bg-blue-800 transition-colors shadow-sm"
        >
          Start the checker →
        </Link>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[
          {
            title: 'Not an AI detector',
            body: 'This tool does not detect or score AI-generated text. It helps you decide what to do before you use AI — not after.',
          },
          {
            title: 'Rules first, always',
            body: 'Verdicts come from a transparent, inspectable rule engine — not from an AI making ad hoc policy decisions.',
          },
          {
            title: 'Built for academic integrity',
            body: 'Guidance distinguishes clearly between language support, thinking support, and content generation — three very different things.',
          },
          {
            title: 'Course rules override everything',
            body: 'This app provides guidance. Your assignment brief and your teacher\'s instructions always take priority.',
          },
        ].map(({ title, body }) => (
          <div
            key={title}
            className="bg-white border border-stone-200 rounded-xl p-5"
          >
            <h3 className="text-sm font-semibold text-stone-900 mb-1.5">{title}</h3>
            <p className="text-sm text-stone-500 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* Teacher bar */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-start sm:items-center gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">For teachers and academic skills staff</h3>
          <p className="text-sm text-blue-700 leading-relaxed">
            Set a policy preset, review the rule logic, and export a printable one-page guidance
            summary to share with your students or add to your course guide.
          </p>
        </div>
        <Link
          href="/teacher"
          className="shrink-0 px-4 py-2 bg-white border border-blue-200 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          Teacher view →
        </Link>
      </div>

      {/* Quick example link */}
      <p className="text-center text-sm text-stone-400 mt-8">
        Not sure where to start?{' '}
        <Link href="/scenarios" className="text-blue-600 hover:underline">
          Browse 12 pre-evaluated example scenarios →
        </Link>
      </p>
    </div>
  );
}
