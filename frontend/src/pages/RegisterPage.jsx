import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Не вдалося створити обліковий запис');
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
            Створити обліковий запис
          </h1>
          <p className="text-ink-500 mb-8">
            Кілька секунд, і ви готові розпочати першу задачу.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Імʼя"
              type="text"
              autoComplete="name"
              placeholder="Як вас звати"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              autoComplete="new-password"
              placeholder="Не менше 8 символів"
              hint="Мінімум 8 символів"
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
              Створити обліковий запис
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-6 text-sm text-ink-500">
            Уже маєте обліковий запис?{' '}
            <Link to="/login" className="text-brand-700 font-medium hover:text-brand-800">
              Увійти
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
            // п'ять рангів зростання
          </p>
          <h2 className="display text-5xl leading-[1.1] font-medium mb-8 tracking-tight">
            Trainee → Lead<br />
            <span className="italic text-brand-400">за вашим темпом</span>.
          </h2>

          <div className="flex flex-wrap gap-2 mb-8">
            {['Trainee', 'Junior', 'Middle', 'Senior', 'Lead'].map((r, i) => (
              <span
                key={r}
                className="px-3 py-1.5 rounded-full border border-cream-50/15 text-cream-100 text-sm font-medium"
                style={{ opacity: 1 - i * 0.1 }}
              >
                {r}
              </span>
            ))}
          </div>

          <p className="text-cream-300 text-lg leading-relaxed">
            Кожна розвʼязана задача додає очки досвіду. Накопичивши певну кількість — переходите на наступний ранг і відкриваєте новий рівень.
          </p>
        </div>
      </div>
    </div>
  );
}
