import FreightQuoteForm from '@/components/FreightQuoteForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
      <FreightQuoteForm />
    </div>
  );
}
