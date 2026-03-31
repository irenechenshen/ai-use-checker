import { CheckerForm } from '@/components/checker-form';
import { SectionTitle } from '@/components/ui';

export const metadata = {
  title: 'AI Use Checker — Start the Checker',
};

export default function CheckerPage() {
  return (
    <div>
      <SectionTitle
        title="Check a scenario"
        subtitle="Answer five questions to get a personalised verdict on your planned AI use."
      />
      <CheckerForm />
      <p className="text-xs text-stone-400 text-center mt-4">
        No data is stored or sent anywhere. All processing happens in your browser.
      </p>
    </div>
  );
}
