export default function StatCard({ icon: Icon, label, value, accent = 'brand', sublabel }) {
  const accents = {
    brand: 'text-brand-700 bg-brand-100',
    success: 'text-success-700 bg-success-100',
    amber: 'text-amber-600 bg-amber-100',
    ink: 'text-ink-700 bg-cream-200',
  };

  return (
    <div className="group relative rounded-2xl bg-cream-50 border border-ink-900/8 p-5 transition-all duration-300 hover:border-ink-900/15 hover:shadow-lift hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{label}</p>
          <p className="display text-3xl font-medium text-ink-900 mt-2 tabular-nums">{value}</p>
          {sublabel && <p className="text-xs text-ink-400 mt-1">{sublabel}</p>}
        </div>
        {Icon && (
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${accents[accent]}`}>
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
}
