import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, Trophy, Flame, Code2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Не вдалося увійти');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-cream-100">
        <div className="w-full max-w-sm animate-fade-up">
          <Link to="/" className="inline-flex items-center gap-2 mb-12">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-ink-900 text-cream-50">
              <Sparkles className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="display text-xl font-medium text-ink-900">CodeQuest</span>
          </Link>

          <h1 className="display text-4xl font-medium text-ink-900 mb-2 tracking-tight">
            З поверненням
          </h1>
          <p className="text-ink-500 mb-8">
            Введіть свої дані, щоб продовжити навчання.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Електронна пошта"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Пароль"
              type="password"
              autoComplete="current-password"
              placeholder="Не менше 8 символів"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="px-3 py-2.5 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-200">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2">
              Увійти
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-6 text-sm text-ink-500">
            Ще не маєте облікового запису?{' '}
            <Link to="/register" className="text-brand-700 font-medium hover:text-brand-800">
              Зареєструватися
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-ink-900 text-cream-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-cream bg-grid opacity-[0.04]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-brand-800/40 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-16 max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-cream-300 mb-6 font-mono">
            // навчання як гра
          </p>
          <h2 className="display text-5xl leading-[1.1] font-medium mb-6 tracking-tight">
            Програмуй,<br />
            змагайся,<br />
            <span className="italic text-brand-400">прокачуйся</span>.
          </h2>
          <p className="text-cream-300 text-lg leading-relaxed mb-10">
            Виконуй задачі, заробляй очки досвіду, відкривай досягнення й рухайся вгору від Trainee до Lead.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-cream-100">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-500/30">
                <Code2 className="w-5 h-5 text-brand-300" />
              </div>
              <span className="text-base">Перевірка коду прямо в браузері</span>
            </div>
            <div className="flex items-center gap-4 text-cream-100">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-500/30">
                <Trophy className="w-5 h-5 text-brand-300" />
              </div>
              <span className="text-base">Досягнення та таблиця лідерів</span>
            </div>
            <div className="flex items-center gap-4 text-cream-100">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-500/30">
                <Flame className="w-5 h-5 text-brand-300" />
              </div>
              <span className="text-base">Щоденні серії активності</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
