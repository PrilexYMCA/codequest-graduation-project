import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Trophy, Flame, GraduationCap, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import RankBadge from '../components/RankBadge';

const NEXT_RANK_THRESHOLDS = {
  TRAINEE: { next: 'JUNIOR', xp: 500 },
  JUNIOR: { next: 'MIDDLE', xp: 2000 },
  MIDDLE: { next: 'SENIOR', xp: 5000 },
  SENIOR: { next: 'LEAD', xp: 12000 },
  LEAD: null,
};

const CURRENT_RANK_BASE = {
  TRAINEE: 0,
  JUNIOR: 500,
  MIDDLE: 2000,
  SENIOR: 5000,
  LEAD: 12000,
};

const rankLabel = (r) => r.charAt(0) + r.slice(1).toLowerCase();

export default function DashboardPage() {
  const { user } = useAuth();
  const [_, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!user) return null;

  const next = NEXT_RANK_THRESHOLDS[user.rank];
  const base = CURRENT_RANK_BASE[user.rank] || 0;
  const progress = next ? Math.round(((user.xp - base) / (next.xp - base)) * 100) : 100;
  const toNext = next ? next.xp - user.xp : 0;

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-up">
          <p className="text-sm text-ink-500 mb-2 font-mono">// головна</p>
          <h1 className="display text-5xl font-medium text-ink-900 tracking-tight">
            Привіт, <span className="italic text-brand-700">{user.name.split(' ')[0]}</span>.
          </h1>
          <p className="text-ink-500 mt-3 text-lg">
            Ось ваш поточний прогрес. Час продовжити навчання.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Досвід"
            value={user.xp.toLocaleString('uk-UA')}
            icon={Zap}
            accent="brand"
            sublabel="балів усього"
          />
          <StatCard
            label="Поточний ранг"
            value={rankLabel(user.rank)}
            icon={Trophy}
            accent="success"
            sublabel={next ? `${toNext} XP до ${rankLabel(next.next)}` : 'найвищий ранг'}
          />
          <StatCard
            label="Серія активності"
            value={user.streakDays || 0}
            icon={Flame}
            accent="amber"
            sublabel={user.streakDays === 1 ? 'день поспіль' : 'днів поспіль'}
          />
          <StatCard
            label="Курсів"
            value="1"
            icon={GraduationCap}
            accent="ink"
            sublabel="доступно"
          />
        </div>

        <div className="rounded-2xl bg-ink-900 text-cream-50 p-8 mb-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cream-300 font-mono mb-3">
                  // ваш ранг
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="display text-5xl font-medium">{rankLabel(user.rank)}</span>
                  <RankBadge rank={user.rank} size="md" />
                </div>
                {next && (
                  <p className="text-cream-300 text-sm">
                    {toNext} XP до наступного рангу{' '}
                    <span className="text-cream-100 font-medium">{rankLabel(next.next)}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="display text-4xl font-medium tabular-nums">{progress}%</p>
                <p className="text-xs text-cream-300 uppercase tracking-wider mt-1">прогрес</p>
              </div>
            </div>
            <div className="h-2 bg-cream-50/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-300 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <Link
          to="/courses"
          className="block rounded-2xl bg-cream-50 border border-ink-900/8 p-8 hover:border-ink-900/15 hover:shadow-lift transition-all duration-300 group"
        >
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-500 mb-2 font-mono">
                // наступний крок
              </p>
              <h3 className="display text-2xl font-medium text-ink-900 mb-2">
                Продовжити навчання
              </h3>
              <p className="text-ink-500">
                Перейдіть до каталогу курсів, щоб обрати наступну задачу.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink-900 text-cream-50 font-medium group-hover:bg-brand-700 transition-colors">
              Перейти
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </Link>
      </main>
    </div>
  );
}
