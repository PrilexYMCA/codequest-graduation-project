import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function TestResults({ results }) {
  if (results.status === 'ERROR') {
    return (
      <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5 animate-fade-up">
        <div className="flex items-center gap-2 text-rose-700 mb-2">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-medium">Помилка виконання</h3>
        </div>
        <p className="text-sm text-rose-700 font-mono">{results.error}</p>
      </div>
    );
  }

  const visible = results.results.filter((r) => !r.isHidden);
  const passed = results.results.filter((r) => r.passed).length;
  const total = results.results.length;

  return (
    <div
      className={`rounded-2xl border p-5 animate-fade-up ${
        results.status === 'PASSED'
          ? 'bg-success-100 border-success-500/30'
          : 'bg-amber-100 border-amber-500/40'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`font-medium flex items-center gap-2 ${
            results.status === 'PASSED' ? 'text-success-700' : 'text-amber-700'
          }`}
        >
          {results.status === 'PASSED' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          {results.status === 'PASSED' ? 'Усі тести пройдено' : 'Деякі тести не пройдено'}
        </h3>
        <span
          className={`text-sm tabular-nums font-medium ${
            results.status === 'PASSED' ? 'text-success-700' : 'text-amber-700'
          }`}
        >
          {passed} / {total}
        </span>
      </div>

      <div className="space-y-2">
        {visible.map((r) => (
          <div
            key={r.id}
            className={`flex items-start gap-3 p-3 rounded-lg bg-cream-50 border ${
              r.passed ? 'border-success-500/20' : 'border-rose-500/20'
            }`}
          >
            {r.passed ? (
              <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs font-mono space-y-0.5">
              <div className="text-ink-700">
                <span className="text-ink-400">Вхід: </span>
                {r.input}
              </div>
              <div className="text-ink-700">
                <span className="text-ink-400">Очікувано: </span>
                {r.expected}
              </div>
              {!r.passed && (
                <div className="text-rose-700">
                  <span className="text-ink-400">Отримано: </span>
                  {r.error ? `помилка — ${r.error}` : r.actual}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
