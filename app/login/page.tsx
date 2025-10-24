'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
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
      setError(result.error || (isRegistering ? 'Registration failed' : 'Login failed'));
    }
    
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-neutral-950 px-4">
      <div className="max-w-md space-y-8 rounded-xl border border-white/10 bg-neutral-900 p-8" style={{ width: '100%', maxWidth: '28rem' }}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">FeedCentral</h1>
          <p className="mt-2 text-sm text-neutral-400">
            {isRegistering ? 'Create your account' : 'Sign in to your account'}
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
              <strong>⚠️ Important:</strong> We don't have email support configured on our server. 
              <strong> There is no password recovery option.</strong> Please remember your password. 
              If you forget it, contact the administrator for assistance.
            </div>
          )}

          <div className="space-y-4">
            {isRegistering && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-300">
                  Full Name
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
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                Email address
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
                placeholder={isRegistering ? "you@example.com" : "admin@feedcentral.local"}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                Password {isRegistering && <span className="text-neutral-500">(min. 6 characters)</span>}
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
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading 
              ? (isRegistering ? 'Creating account...' : 'Signing in...') 
              : (isRegistering ? 'Create account' : 'Sign in')
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
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Register"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
