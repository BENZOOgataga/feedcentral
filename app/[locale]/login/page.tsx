'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from '@/i18n-navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const t = useTranslations();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isRegistering) {
      result = await register(email, name, password);
    } else {
      result = await login(email, password);
    }

    if (result.success) {
      // Redirect based on user role
      const redirectPath = result.user?.role === 'ADMIN' ? '/admin' : '/app';
      router.push(redirectPath);
      router.refresh();
    } else {
      setError(result.error || t(isRegistering ? 'auth.register.error' : 'auth.login.error'));
    }
    
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-neutral-950 px-4">
      <div className="max-w-md space-y-8 rounded-xl border border-white/10 bg-neutral-900 p-8" style={{ width: '100%', maxWidth: '28rem' }}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">FeedCentral</h1>
          <p className="mt-2 text-sm text-neutral-400">
            {isRegistering ? t('auth.register.subtitle') : t('auth.login.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {isRegistering && (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-400">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <strong>{t('auth.register.warning.title')}:</strong> {t('auth.register.warning.description')}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
          {isRegistering && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300">
                {t('auth.register.name')}
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                placeholder={t('auth.register.namePlaceholder')}
              />
            </div>
          )}            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                {t('auth.login.email')}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder={t('auth.login.emailPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                {t('auth.login.password')} {isRegistering && <span className="text-neutral-500">({t('common.minCharacters', { count: 6 })})</span>}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegistering ? "new-password" : "current-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder={t('auth.login.passwordPlaceholder')}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading 
              ? (isRegistering ? t('auth.register.submitting') : t('auth.login.submitting')) 
              : (isRegistering ? t('auth.register.submit') : t('auth.login.submit'))
            }
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setEmail('');
                setName('');
                setPassword('');
              }}
              className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
            >
              {isRegistering 
                ? t('auth.register.hasAccount') 
                : t('auth.login.noAccount')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
