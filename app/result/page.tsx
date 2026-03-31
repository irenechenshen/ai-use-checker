'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { computeVerdict } from '@/lib/rules-engine';
import { ResultView } from '@/components/result-view';
import { RESULT_STORAGE_KEY } from '@/components/checker-form';
import type { CheckerAnswers, VerdictResult } from '@/types';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<VerdictResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RESULT_STORAGE_KEY);
      if (!raw) {
        setError(true);
        return;
      }
      const answers = JSON.parse(raw) as CheckerAnswers;
      setResult(computeVerdict(answers));
    } catch {
      setError(true);
    }
  }, []);

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-500 mb-4">No result found. Please complete the checker first.</p>
        <button
          onClick={() => router.push('/checker')}
          className="px-5 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800"
        >
          Start the checker →
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-16 text-stone-400 text-sm">
        Computing your result…
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-semibold text-stone-900 mb-6">Your result</h1>
      <ResultView result={result} />
    </div>
  );
}
