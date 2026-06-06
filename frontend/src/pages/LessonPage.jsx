import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Play,
  Send,
  Sparkles,
  Trophy,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import api from '../lib/api';
import { runCode } from '../lib/runCode';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import CodeEditor from '../components/CodeEditor';
import TestResults from '../components/TestResults';

export default function LessonPage() {
  const { id } = useParams();
  const { refreshUser } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    setLoading(true);
    setLesson(null);
    setCode('');
    setResults(null);
    setSubmission(null);

    api
      .get(`/lessons/${id}`)
      .then((res) => {
        setLesson(res.data);
        if (res.data.tasks?.length > 0) {
          setCode(res.data.tasks[0].starterCode);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Header />
        <div className="text-center text-ink-400 py-16">Завантаження…</div>
      </div>
    );
  }

  if (!lesson) return null;
  const task = lesson.tasks[0];

  async function handleRun() {
    setRunning(true);
    setResults(null);
    setSubmission(null);
    const r = await runCode(code, task.testCases);
    setResults(r);
    setRunning(false);
  }

  async function handleSubmit() {
    if (!results) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/tasks/${task.id}/submit`, {
        code,
        status: results.status,
      });
      setSubmission(res.data);
      if (res.data.gamification) {
        await refreshUser();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setCode(task.starterCode);
    setResults(null);
    setSubmission(null);
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Link
          to={`/courses/${lesson.module.courseId}`}
          className="inline-flex items-center gap-1 text-ink-500 hover:text-ink-900 text-sm mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          До курсу
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[5fr,6fr] gap-8 items-start">
          <div className="animate-fade-up">
            <p className="text-sm text-ink-500 font-mono mb-2">// {lesson.module.title}</p>
            <h1 className="display text-4xl font-medium text-ink-900 tracking-tight mb-5">
              {lesson.title}
            </h1>

            <div className="text-ink-700 leading-relaxed mb-8 whitespace-pre-wrap">
              {lesson.content}
            </div>

            {task && (
              <div className="rounded-2xl bg-cream-50 border border-ink-900/8 p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink-400 mb-1">Задача</p>
                    <h2 className="display text-xl font-medium text-ink-900">{task.title}</h2>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-brand-700 bg-brand-100 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                    <Sparkles className="w-3 h-3" />
                    +{task.xpReward} XP
                  </span>
                </div>
                <p className="text-ink-700 leading-relaxed">{task.description}</p>
              </div>
            )}
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="rounded-2xl bg-[#282c34] overflow-hidden border border-ink-900/10 shadow-soft">
              <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-success-500/70" />
                  </div>
                  <span className="text-xs text-cream-300/60 font-mono ml-2">solution.js</span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-cream-300/50 hover:text-cream-300 font-mono"
                >
                  скинути
                </button>
              </div>
              <CodeEditor value={code} onChange={setCode} />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRun}
                disabled={running || submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cream-50 border border-ink-900/15 text-ink-900 font-medium hover:bg-cream-200 hover:border-ink-900/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {running ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Виконання…
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Запустити
                  </>
                )}
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !results || results.status !== 'PASSED' || submitting || running || submission
                }
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ink-900 text-cream-50 font-medium hover:bg-brand-700 disabled:bg-ink-300 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Надсилання…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Надіслати розв'язок
                  </>
                )}
              </button>
            </div>

            {results && <TestResults results={results} />}

            {submission?.gamification && (
              <div className="rounded-2xl bg-ink-900 text-cream-50 p-6 relative overflow-hidden animate-fade-up">
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand-600/40 blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-500/30">
                      <Sparkles className="w-5 h-5 text-brand-300" />
                    </div>
                    <div>
                      <h3 className="display text-2xl font-medium">
                        +{submission.gamification.xpAwarded} XP
                      </h3>
                      <p className="text-cream-300 text-sm">Задачу пройдено вперше</p>
                    </div>
                  </div>

                  {submission.gamification.rankChanged && (
                    <div className="mt-4 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-brand-300" />
                      <span className="text-sm text-cream-100">
                        Новий ранг:{' '}
                        <span className="font-medium">
                          {submission.gamification.newRank.charAt(0) +
                            submission.gamification.newRank.slice(1).toLowerCase()}
                        </span>
                      </span>
                    </div>
                  )}

                  {submission.gamification.newAchievements?.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs uppercase tracking-wider text-cream-300">
                        Нові досягнення
                      </p>
                      {submission.gamification.newAchievements.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-cream-50/5 border border-cream-50/10"
                        >
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <span className="text-sm text-cream-100">{a.title}</span>
                          {a.xpReward > 0 && (
                            <span className="ml-auto text-xs text-brand-300">+{a.xpReward} XP</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {submission?.alreadyPassed && !submission.gamification && (
              <div className="rounded-2xl bg-cream-50 border border-ink-900/8 p-4 text-sm text-ink-500 animate-fade-up">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-600" />
                  Задачу вже було вирішено раніше. XP повторно не нараховується.
                </div>
              </div>
            )}

            {submission && lesson.nextLesson && (
              <Link
                to={`/lessons/${lesson.nextLesson.id}`}
                className="block rounded-2xl bg-cream-50 border border-ink-900/8 p-5 hover:border-ink-900/15 hover:shadow-lift transition-all duration-300 group animate-fade-up"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-ink-400 mb-1 font-mono">
                      {lesson.nextLessonInNewModule
                        ? `// наступний модуль · ${lesson.nextModuleTitle}`
                        : '// далі в модулі'}
                    </p>
                    <p className="display text-lg font-medium text-ink-900 truncate">
                      {lesson.nextLesson.title}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink-900 text-cream-50 text-sm font-medium group-hover:bg-brand-700 transition-colors whitespace-nowrap">
                    {lesson.nextLessonInNewModule ? 'Розпочати' : 'Перейти'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            )}

            {submission && !lesson.nextLesson && (
              <Link
                to="/courses"
                className="block rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-cream-50 p-6 hover:shadow-lift transition-all duration-300 group animate-fade-up"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-cream-300 mb-1 font-mono">
                      // курс завершено
                    </p>
                    <p className="display text-xl font-medium">Вітаємо з фінішем!</p>
                    <p className="text-cream-200 text-sm mt-1">
                      Усі задачі курсу пройдено
                    </p>
                  </div>
                  <Trophy className="w-10 h-10 text-amber-300" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
