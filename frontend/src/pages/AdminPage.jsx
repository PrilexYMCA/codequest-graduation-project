import { useEffect, useState } from 'react';
import {
  Users,
  BookPlus,
  FilePlus2,
  Pencil,
  Check,
  X,
  ShieldOff,
  Shield as ShieldIcon,
  Trash2,
  Plus,
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import RankBadge from '../components/RankBadge';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-up">
          <p className="text-sm text-ink-500 mb-2 font-mono">// адмін</p>
          <h1 className="display text-5xl font-medium text-ink-900 tracking-tight">
            Адміністрування
          </h1>
          <p className="text-ink-500 mt-3 text-lg">
            Керування користувачами та контентом платформи.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users}>
            Користувачі
          </TabButton>
          <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={BookPlus}>
            Додати урок
          </TabButton>
          <TabButton active={activeTab === 'task'} onClick={() => setActiveTab('task')} icon={FilePlus2}>
            Додати задачу
          </TabButton>
        </div>

        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'lesson' && <AddLessonTab />}
        {activeTab === 'task' && <AddTaskTab />}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? 'bg-ink-900 text-cream-50'
          : 'bg-cream-50 text-ink-700 border border-ink-900/8 hover:border-ink-900/15'
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );
}

function UsersTab() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveName(id) {
    setError('');
    try {
      await api.patch(`/admin/users/${id}`, { name: editName });
      setEditingId(null);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка збереження');
    }
  }

  async function handleToggleActive(id) {
    setError('');
    try {
      await api.post(`/admin/users/${id}/toggle-active`);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка зміни статусу');
    }
  }

  if (loading) return <div className="text-center text-ink-400 py-12">Завантаження…</div>;

  return (
    <div className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-rose-50 text-rose-700 text-sm border border-rose-200">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-cream-50 border border-ink-900/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="bg-cream-100 text-xs uppercase tracking-wider text-ink-500">
                <th className="text-left px-5 py-3 font-medium">Користувач</th>
                <th className="text-left px-5 py-3 font-medium">Роль</th>
                <th className="text-left px-5 py-3 font-medium">Ранг</th>
                <th className="text-right px-5 py-3 font-medium">XP</th>
                <th className="text-left px-5 py-3 font-medium">Статус</th>
                <th className="text-right px-5 py-3 font-medium">Дії</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-ink-900/5">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-600 text-cream-50 flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {u.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        {editingId === u.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="px-2 py-1 text-sm rounded-md border border-ink-900/15 bg-cream-50 focus:outline-none focus:border-brand-500"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveName(u.id)}
                              className="text-success-700 p-1 hover:bg-success-100 rounded"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-ink-500 p-1 hover:bg-cream-200 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium text-ink-900 truncate">{u.name}</p>
                            <p className="text-xs text-ink-500 truncate">{u.email}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs uppercase tracking-wider px-2 py-1 rounded-full font-medium ${
                        u.role === 'ADMIN'
                          ? 'text-brand-700 bg-brand-100'
                          : 'text-ink-700 bg-cream-200'
                      }`}
                    >
                      {u.role === 'ADMIN' ? 'Адмін' : 'Студент'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <RankBadge rank={u.rank} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right text-ink-700 tabular-nums">
                    {u.xp.toLocaleString('uk-UA')}
                  </td>
                  <td className="px-5 py-4">
                    {u.isActive ? (
                      <span className="text-xs text-success-700 bg-success-100 px-2 py-1 rounded-full font-medium">
                        Активний
                      </span>
                    ) : (
                      <span className="text-xs text-rose-700 bg-rose-100 px-2 py-1 rounded-full font-medium">
                        Заблокований
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {editingId !== u.id && (
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingId(u.id);
                            setEditName(u.name);
                          }}
                          className="p-2 text-ink-500 hover:text-ink-900 hover:bg-cream-200 rounded-lg transition-colors"
                          title="Редагувати імʼя"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {u.id !== currentUser.id && u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleActive(u.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              u.isActive
                                ? 'text-rose-600 hover:bg-rose-100'
                                : 'text-success-700 hover:bg-success-100'
                            }`}
                            title={u.isActive ? 'Заблокувати' : 'Розблокувати'}
                          >
                            {u.isActive ? (
                              <ShieldOff className="w-4 h-4" />
                            ) : (
                              <ShieldIcon className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AddLessonTab() {
  const [structure, setStructure] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadStructure();
  }, []);

  async function loadStructure() {
    try {
      const res = await api.get('/admin/structure');
      setStructure(res.data);
    } catch (err) {
      setError('Не вдалося завантажити структуру курсів');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!moduleId) {
      setError('Оберіть модуль');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/admin/lessons', {
        moduleId: parseInt(moduleId),
        title,
        content,
      });
      setSuccess(`Урок "${res.data.title}" створено.`);
      setTitle('');
      setContent('');
      await loadStructure();
    } catch (err) {
      setError(err.response?.data?.error || 'Не вдалося створити урок');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-cream-50 border border-ink-900/8 p-8 space-y-4 max-w-3xl"
    >
      <h2 className="display text-2xl font-medium text-ink-900 mb-2">Новий урок</h2>
      <p className="text-sm text-ink-500 mb-4">
        Урок – це блок теоретичного тексту, який передує задачам. Створіть урок спочатку, потім додайте до нього задачу у наступній вкладці.
      </p>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink-700">Модуль</label>
        <select
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          className="w-full rounded-xl border border-ink-900/12 bg-cream-50 px-4 py-2.5 text-[15px] text-ink-900 focus:outline-none focus:border-brand-500 focus:bg-white"
          required
        >
          <option value="">— оберіть модуль —</option>
          {structure.flatMap((course) =>
            course.modules.map((m) => (
              <option key={m.id} value={m.id}>
                {course.title} → {m.title}
              </option>
            ))
          )}
        </select>
      </div>

      <Input
        label="Назва уроку"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Наприклад: Робота з масивами"
        required
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink-700">
          Теоретичний зміст уроку
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          placeholder="Текст теорії, що відображатиметься на сторінці уроку перед задачею…"
          className="w-full rounded-xl border border-ink-900/12 bg-cream-50 px-4 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-brand-500 focus:bg-white resize-y"
          required
        />
        <p className="text-xs text-ink-400">Не менше 10 символів</p>
      </div>

      {error && (
        <div className="px-3 py-2.5 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-200">
          {error}
        </div>
      )}
      {success && (
        <div className="px-3 py-2.5 rounded-lg bg-success-100 text-success-700 text-sm border border-success-500/30">
          {success}
        </div>
      )}

      <Button type="submit" loading={saving}>
        <Plus className="w-4 h-4" />
        Створити урок
      </Button>
    </form>
  );
}

function AddTaskTab() {
  const [structure, setStructure] = useState([]);
  const [lessonId, setLessonId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [starterCode, setStarterCode] = useState('function solution() {\n  // ваш код\n}');
  const [xpReward, setXpReward] = useState(10);
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadStructure();
  }, []);

  async function loadStructure() {
    try {
      const res = await api.get('/admin/structure');
      setStructure(res.data);
    } catch (err) {
      setError('Не вдалося завантажити структуру курсів');
    }
  }

  function addTestCase() {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  }

  function removeTestCase(idx) {
    if (testCases.length === 1) return;
    setTestCases(testCases.filter((_, i) => i !== idx));
  }

  function updateTestCase(idx, field, value) {
    const next = testCases.map((tc, i) => (i === idx ? { ...tc, [field]: value } : tc));
    setTestCases(next);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!lessonId) {
      setError('Оберіть урок');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/admin/tasks', {
        lessonId: parseInt(lessonId),
        title,
        description,
        starterCode,
        xpReward: parseInt(xpReward),
        testCases,
      });
      setSuccess(`Задачу "${res.data.title}" створено з ${res.data.testCases.length} тестами.`);
      setTitle('');
      setDescription('');
      setStarterCode('function solution() {\n  // ваш код\n}');
      setXpReward(10);
      setTestCases([{ input: '', expectedOutput: '' }]);
    } catch (err) {
      setError(err.response?.data?.error || 'Не вдалося створити задачу');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-cream-50 border border-ink-900/8 p-8 space-y-4 max-w-3xl"
    >
      <h2 className="display text-2xl font-medium text-ink-900 mb-2">Нова задача</h2>
      <p className="text-sm text-ink-500 mb-4">
        Задача прикріплюється до існуючого уроку. Вхід і очікуваний результат тестових випадків мають бути у форматі JSON.
      </p>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink-700">Урок</label>
        <select
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
          className="w-full rounded-xl border border-ink-900/12 bg-cream-50 px-4 py-2.5 text-[15px] text-ink-900 focus:outline-none focus:border-brand-500 focus:bg-white"
          required
        >
          <option value="">— оберіть урок —</option>
          {structure.flatMap((course) =>
            course.modules.flatMap((m) =>
              m.lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {course.title} → {m.title} → {l.title}
                </option>
              ))
            )
          )}
        </select>
      </div>

      <Input
        label="Назва задачі"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Наприклад: Знайти максимум"
        required
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink-700">Опис задачі</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-ink-900/12 bg-cream-50 px-4 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-brand-500 focus:bg-white resize-y"
          placeholder="Напишіть функцію solution(...), яка..."
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink-700">Стартовий код</label>
        <textarea
          value={starterCode}
          onChange={(e) => setStarterCode(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-ink-900/12 bg-[#282c34] text-cream-50 px-4 py-2.5 text-[13px] font-mono focus:outline-none focus:border-brand-500 resize-y"
          required
        />
      </div>

      <Input
        label="XP-винагорода"
        type="number"
        min={1}
        max={1000}
        value={xpReward}
        onChange={(e) => setXpReward(e.target.value)}
        required
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-ink-700">Тестові випадки</label>
          <button
            type="button"
            onClick={addTestCase}
            className="inline-flex items-center gap-1 text-sm text-brand-700 hover:text-brand-900 font-medium"
          >
            <Plus className="w-4 h-4" />
            Додати тест
          </button>
        </div>
        <p className="text-xs text-ink-400">
          Вхід — масив аргументів у JSON (наприклад,{' '}
          <code className="font-mono bg-cream-200 px-1 rounded">[2, 3]</code>). Результат — JSON-значення (наприклад,{' '}
          <code className="font-mono bg-cream-200 px-1 rounded">5</code> або{' '}
          <code className="font-mono bg-cream-200 px-1 rounded">"Привіт"</code>).
        </p>

        {testCases.map((tc, idx) => (
          <div key={idx} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-start">
            <input
              type="text"
              value={tc.input}
              onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
              placeholder='Вхід: [1, 2]'
              className="px-3 py-2 text-sm rounded-lg border border-ink-900/15 bg-cream-50 font-mono focus:outline-none focus:border-brand-500"
              required
            />
            <input
              type="text"
              value={tc.expectedOutput}
              onChange={(e) => updateTestCase(idx, 'expectedOutput', e.target.value)}
              placeholder='Результат: 3'
              className="px-3 py-2 text-sm rounded-lg border border-ink-900/15 bg-cream-50 font-mono focus:outline-none focus:border-brand-500"
              required
            />
            <button
              type="button"
              onClick={() => removeTestCase(idx)}
              disabled={testCases.length === 1}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Видалити"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {error && (
        <div className="px-3 py-2.5 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-200">
          {error}
        </div>
      )}
      {success && (
        <div className="px-3 py-2.5 rounded-lg bg-success-100 text-success-700 text-sm border border-success-500/30">
          {success}
        </div>
      )}

      <Button type="submit" loading={saving}>
        <Plus className="w-4 h-4" />
        Створити задачу
      </Button>
    </form>
  );
}
