import { useEffect, useState } from 'react';
import { Trophy, Flame, Medal } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import RankBadge from '../components/RankBadge';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/gamification/leaderboard?limit=50')
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const myPosition = users.findIndex((u) => u.id === user?.id) + 1;

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-up">
          <p className="text-sm text-ink-500 mb-2 font-mono">// рейтинг</p>
          <h1 className="display text-5xl font-medium text-ink-900 tracking-tight">
            Таблиця лідерів
          </h1>
          <p className="text-ink-500 mt-3 text-lg">
            {myPosition > 0
              ? `Ви на ${myPosition} місці серед топ-50.`
              : 'Поки що не у топ-50 — час нагнати!'}
          </p>
        </div>

        {loading ? (
          <div className="text-center text-ink-400 py-12">Завантаження…</div>
        ) : users.length === 0 ? (
          <div className="text-center text-ink-400 py-12">У рейтингу поки немає учасників.</div>
        ) : (
          <div className="rounded-2xl bg-cream-50 border border-ink-900/8 overflow-hidden">
            {users.map((u, idx) => (
              <LeaderboardRow key={u.id} user={u} rank={idx + 1} isMe={u.id === user?.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function LeaderboardRow({ user, rank, isMe }) {
  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 border-b border-ink-900/5 last:border-b-0 transition-colors ${
        isMe ? 'bg-brand-100/40' : 'hover:bg-cream-100'
      }`}
    >
      <div className="w-10 flex items-center justify-center">
        {rank === 1 && (
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 text-amber-700">
            <Trophy className="w-4 h-4" strokeWidth={2.5} />
          </div>
        )}
        {rank === 2 && (
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-ink-300/60 text-ink-700">
            <Medal className="w-4 h-4" strokeWidth={2.5} />
          </div>
        )}
        {rank === 3 && (
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-100/50 text-amber-600">
            <Medal className="w-4 h-4" strokeWidth={2.5} />
          </div>
        )}
        {rank > 3 && (
          <span className="text-ink-400 text-sm font-medium tabular-nums">{rank}</span>
        )}
      </div>

      <div className="w-10 h-10 rounded-full bg-brand-600 text-cream-50 flex items-center justify-center text-sm font-medium flex-shrink-0">
        {user.name?.charAt(0).toUpperCase() || 'U'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-ink-900 truncate flex items-center gap-2">
          {user.name}
          {isMe && (
            <span className="text-xs uppercase tracking-wider text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full font-medium">
              ви
            </span>
          )}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <RankBadge rank={user.rank} size="sm" />
          {user.streakDays > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
              <Flame className="w-3 h-3" />
              {user.streakDays}
            </span>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="display text-2xl font-medium text-ink-900 tabular-nums">
          {user.xp.toLocaleString('uk-UA')}
        </p>
        <p className="text-xs text-ink-400 uppercase tracking-wider">XP</p>
      </div>
    </div>
  );
}
