const RANK_INFO = {
  TRAINEE: { label: 'Trainee', color: 'text-ink-700 bg-ink-100' },
  JUNIOR: { label: 'Junior', color: 'text-success-700 bg-success-100' },
  MIDDLE: { label: 'Middle', color: 'text-brand-800 bg-brand-100' },
  SENIOR: { label: 'Senior', color: 'text-amber-700 bg-amber-100' },
  LEAD: { label: 'Lead', color: 'text-cream-50 bg-ink-900' },
};

export default function RankBadge({ rank = 'TRAINEE', size = 'md' }) {
  const info = RANK_INFO[rank] || RANK_INFO.TRAINEE;
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${info.color} ${sizes[size]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {info.label}
    </span>
  );
}
