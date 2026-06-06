import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import api from '../lib/api';
import Header from '../components/Header';

export default function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
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

  if (!course) return null;

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link
          to="/courses"
          className="inline-flex items-center gap-1 text-ink-500 hover:text-ink-900 text-sm mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          До каталогу
        </Link>

        <div className="mb-10 animate-fade-up">
          <p className="text-sm text-brand-700 font-mono mb-2">// курс</p>
          <h1 className="display text-5xl font-medium text-ink-900 tracking-tight mb-3">
            {course.title}
          </h1>
          <p className="text-ink-500 text-lg">{course.description}</p>
        </div>

        <div className="space-y-6">
          {course.modules.map((module, idx) => (
            <div
              key={module.id}
              className="rounded-2xl bg-cream-50 border border-ink-900/8 overflow-hidden"
            >
              <div className="p-6 border-b border-ink-900/8">
                <p className="text-xs uppercase tracking-wider text-ink-400 mb-1">
                  Модуль {idx + 1}
                </p>
                <h2 className="display text-2xl font-medium text-ink-900">{module.title}</h2>
              </div>
              <div className="divide-y divide-ink-900/5">
                {module.lessons.map((lesson, lessonIdx) => (
                  <Link
                    key={lesson.id}
                    to={`/lessons/${lesson.id}`}
                    className="flex items-center justify-between gap-4 p-5 hover:bg-cream-100 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cream-200 text-ink-700 text-sm font-medium">
                        {lessonIdx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-ink-900">{lesson.title}</p>
                        <p className="text-xs text-ink-400 flex items-center gap-1 mt-0.5">
                          <FileText className="w-3 h-3" />
                          {lesson._count.tasks}{' '}
                          {lesson._count.tasks === 1 ? 'задача' : 'задачі'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-ink-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
