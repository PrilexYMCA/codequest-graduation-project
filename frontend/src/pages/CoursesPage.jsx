import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ChevronRight, BookOpen } from 'lucide-react';
import api from '../lib/api';
import Header from '../components/Header';

const LEVEL_LABEL = {
  BEGINNER: 'Початковий',
  INTERMEDIATE: 'Середній',
  ADVANCED: 'Просунутий',
};

const LEVEL_ACCENT = {
  BEGINNER: 'text-success-700 bg-success-100',
  INTERMEDIATE: 'text-amber-600 bg-amber-100',
  ADVANCED: 'text-brand-700 bg-brand-100',
};

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/courses')
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-up">
          <p className="text-sm text-ink-500 mb-2 font-mono">// каталог</p>
          <h1 className="display text-5xl font-medium text-ink-900 tracking-tight">Курси</h1>
          <p className="text-ink-500 mt-3 text-lg">
            Оберіть курс, щоб розпочати або продовжити навчання.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-ink-400 py-12">Завантаження…</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-ink-400 py-12">Немає доступних курсів.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group rounded-2xl bg-cream-50 border border-ink-900/8 p-6 transition-all duration-300 hover:border-ink-900/15 hover:shadow-lift hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`text-xs uppercase tracking-wider px-2.5 py-1 rounded-full font-medium ${
                      LEVEL_ACCENT[course.level]
                    }`}
                  >
                    {LEVEL_LABEL[course.level]}
                  </span>
                  <ChevronRight className="w-5 h-5 text-ink-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="display text-2xl font-medium text-ink-900 mb-2">{course.title}</h3>
                <p className="text-ink-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 text-ink-400 text-sm pt-3 border-t border-ink-900/8">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{course._count.modules} модулів</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
