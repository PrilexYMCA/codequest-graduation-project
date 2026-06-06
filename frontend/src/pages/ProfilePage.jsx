import { useState } from 'react';
import {
  Trophy,
  Zap,
  Flame,
  Calendar,
  Lock,
  Check,
  X,
  Pencil,
  Mail,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import RankBadge from '../components/RankBadge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../lib/api';

const rankLabel = (r) => r.charAt(0) + r.slice(1).toLowerCase();

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState('');

  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!user) return null;

  async function handleNameSave() {
    setNameError('');
    if (name.trim().length < 2) {
      setNameError("Імʼя має містити щонайменше 2 символи");
      return;
    }
    setNameSaving(true);
    try {
      await api.patch('/users/me', { name: name.trim() });
      await refreshUser();
      setEditingName(false);
    } catch (err) {
      setNameError(err.response?.data?.error || 'Не вдалося зберегти');
    } finally {
      setNameSaving(false);
    }
  }

  function handleNameCancel() {
    setName(user.name);
    setEditingName(false);
    setNameError('');
  }

  async function handlePasswordSave() {
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Введіть поточний пароль');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Новий пароль має містити щонайменше 8 символів');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Підтвердження пароля не співпадає');
      return;
    }

    setPasswordSaving(true);
    try {
      await api.post('/users/me/password', { currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setEditingPassword(false);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Не вдалося змінити пароль');
    } finally {
      setPasswordSaving(false);
    }
  }

  function handlePasswordCancel() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setEditingPassword(false);
    setPasswordError('');
  }

  function startEditingPassword() {
    setEditingPassword(true);
    setPasswordSuccess(false);
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-up">
          <p className="text-sm text-ink-500 mb-2 font-mono">// кабінет</p>
          <h1 className="display text-5xl font-medium text-ink-900 tracking-tight">
            Особистий кабінет
          </h1>
          <p className="text-ink-500 mt-3 text-lg">
            Перегляд та редагування ваших даних.
          </p>
        </div>

        <div className="rounded-2xl bg-cream-50 border border-ink-900/8 p-8 mb-6 animate-fade-up">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-brand-600 text-cream-50 flex items-center justify-center display text-3xl font-medium flex-shrink-0">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="space-y-3">
                  <Input
                    label="Імʼя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше імʼя"
                    autoFocus
                  />
                  {nameError && <p className="text-sm text-rose-600">{nameError}</p>}
                  <div className="flex gap-2">
                    <Button onClick={handleNameSave} loading={nameSaving} size="sm">
                      <Check className="w-4 h-4" />
                      Зберегти
                    </Button>
                    <Button onClick={handleNameCancel} variant="secondary" size="sm">
                      <X className="w-4 h-4" />
                      Скасувати
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="display text-3xl font-medium text-ink-900">{user.name}</h2>
                    <button
                      onClick={() => {
                        setName(user.name);
                        setEditingName(true);
                      }}
                      className="inline-flex items-center gap-1 text-sm text-brand-700 hover:text-brand-900 font-medium"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Змінити
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-ink-500">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="mt-3">
                    <RankBadge rank={user.rank} size="md" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-ink-900/8">
            <ProfileStat icon={Zap} label="Досвід" value={user.xp.toLocaleString('uk-UA')} />
            <ProfileStat icon={Trophy} label="Ранг" value={rankLabel(user.rank)} />
            <ProfileStat icon={Flame} label="Серія" value={user.streakDays || 0} />
            <ProfileStat
              icon={Calendar}
              label="З нами з"
              value={new Date(user.createdAt).toLocaleDateString('uk-UA', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
              small
            />
          </div>
        </div>

        <div className="rounded-2xl bg-cream-50 border border-ink-900/8 p-6 animate-fade-up">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-ink-900/8 text-ink-700 flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="display text-lg font-medium text-ink-900">Пароль</h3>
                <p className="text-sm text-ink-500">Зміна пароля для входу в обліковий запис</p>
              </div>
            </div>
            {!editingPassword && (
              <Button onClick={startEditingPassword} variant="secondary" size="sm">
                <Pencil className="w-3.5 h-3.5" />
                Змінити пароль
              </Button>
            )}
          </div>

          {passwordSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-success-100 text-success-700 text-sm border border-success-500/30 flex items-center gap-2 animate-fade-up">
              <Check className="w-4 h-4" />
              Пароль успішно змінено.
            </div>
          )}

          {editingPassword && (
            <div className="space-y-3 pt-4 border-t border-ink-900/8 animate-fade-up">
              <Input
                label="Поточний пароль"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                label="Новий пароль"
                type="password"
                autoComplete="new-password"
                hint="Не менше 8 символів"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                label="Підтвердження нового пароля"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordError && (
                <p className="text-sm text-rose-600">{passwordError}</p>
              )}
              <div className="flex gap-2 pt-1">
                <Button onClick={handlePasswordSave} loading={passwordSaving} size="sm">
                  <Check className="w-4 h-4" />
                  Зберегти пароль
                </Button>
                <Button onClick={handlePasswordCancel} variant="secondary" size="sm">
                  <X className="w-4 h-4" />
                  Скасувати
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ProfileStat({ icon: Icon, label, value, small }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-ink-400 text-xs uppercase tracking-wider mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p
        className={`display font-medium text-ink-900 tabular-nums ${
          small ? 'text-base' : 'text-xl'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
