import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-cream-100">
      <div className="text-center max-w-md">
        <p className="display text-9xl font-medium text-ink-900 mb-4 tracking-tight">404</p>
        <p className="display text-2xl font-medium text-ink-900 mb-3">Сторінку не знайдено</p>
        <p className="text-ink-500 mb-8">
          Здається, ви забрели туди, де ще немає вмісту.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink-900 text-cream-50 font-medium hover:bg-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          На головну
        </Link>
      </div>
    </div>
  );
}
