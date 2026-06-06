import { useEffect, useState } from 'react';
import { Lock, Trophy } from 'lucide-react';
import api from '../lib/api';
import Header from '../components/Header';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/gamification/achievements')
      .then((res) => setAchievements(res.data))
      .finally(() => setLoading(false));
  }, []);

  const unlocked = achievements.filter((a) => a.isUnlocked).length;
  const total = achievements.length;
  const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-up">
          <p className="text-sm text-ink-500 mb-2 font-mono">// досягнення</p>
          <h1 className="display text-5xl font-medium text-ink-900 tracking-tight">
            Досягнення
          </h1>
          <p className="text-ink-500 mt-3 text-lg">
            {unlocked} з {total} розблоковано · {progress}%
          </p>
        </div>

        <div className="rounded-2xl bg-ink-900 p-6 mb-8 relative overflow-hidden animate-fade-up">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-cream-300 text-sm">Загальний прогрес</span>
              <span className="display text-2xl font-medium text-cream-50 tabular-nums">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-cream-50/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-300 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-ink-400 py-12">Завантаження…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function AchievementCard({ achievement }) {
  const isUnlocked = achievement.isUnlocked;

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        isUnlocked
          ? 'bg-cream-50 border-ink-900/8 hover:border-ink-900/15 hover:shadow-lift hover:-translate-y-0.5'
          : 'bg-cream-200/50 border-ink-900/5'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-xl ${
            isUnlocked ? 'bg-amber-100 text-amber-600' : 'bg-cream-300 text-ink-400'
          }`}
        >
          {isUnlocked ? (
            <Trophy className="w-6 h-6" strokeWidth={2} />
          ) : (
            <Lock className="w-5 h-5" strokeWidth={2} />
          )}
        </div>
        {achievement.xpReward > 0 && (
          <span
            className={`text-xs uppercase tracking-wider px-2 py-1 rounded-full font-medium ${
              isUnlocked ? 'text-brand-700 bg-brand-100' : 'text-ink-400 bg-cream-300/60'
            }`}
          >
            +{achievement.xpReward} XP
          </span>
        )}
      </div>
      <h3
        className={`display text-lg font-medium mb-1 ${
          isUnlocked ? 'text-ink-900' : 'text-ink-500'
        }`}
      >
        {achievement.title}
      </h3>
      <p className={`text-sm leading-relaxed ${isUnlocked ? 'text-ink-500' : 'text-ink-400'}`}>
        {achievement.description}
      </p>
      {isUnlocked && achievement.unlockedAt && (
        <p className="text-xs text-ink-400 mt-3 pt-3 border-t border-ink-900/5">
          Отримано {new Date(achievement.unlockedAt).toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      )}
    </div>
  );
}
