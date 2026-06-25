'use client';

/**
 * AuthModal — login + register modal.
 *
 * Tabs swap between Sign In and Register with a sliding underline. Register
 * collects first/last name, email, phone and password; Sign In only needs
 * email + password. Submits through the `useAuth` hook.
 */

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Mail, Phone, Sparkles, User as UserIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTalent } from '@/lib/talent-store';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AuthModal() {
  const authOpen = useTalent((s) => s.authOpen);
  const authMode = useTalent((s) => s.authMode);
  const openAuth = useTalent((s) => s.openAuth);
  const closeAuth = useTalent((s) => s.closeAuth);
  const { login, register, loading, error, setError } = useAuth();

  const [form, setForm] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  React.useEffect(() => {
    if (authOpen) {
      setForm({ firstName: '', lastName: '', email: '', phone: '', password: '' });
      setError(null);
    }
  }, [authOpen, authMode, setError]);

  const update = (key: keyof typeof form, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await login(form.email, form.password);
      } else {
        await register({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
      }
    } catch {
      /* error handled by hook */
    }
  };

  return (
    <AnimatePresence>
      {authOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={closeAuth}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={authMode === 'login' ? 'Sign in' : 'Create your account'}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={cn(
              'relative w-full max-w-md overflow-hidden rounded-2xl border border-border/60',
              'bg-card shadow-2xl shadow-black/20',
            )}
          >
            {/* Gradient header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-card to-accent/15 p-6">
              <div className="grid-texture absolute inset-0 opacity-40" aria-hidden />
              <div className="relative flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/20">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {authMode === 'login' ? 'Welcome back' : 'Create your account'}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {authMode === 'login'
                      ? 'Sign in to track applications.'
                      : 'Join SayOne HRIS Career Portal.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Tabs */}
              <div className="relative mb-5 flex gap-4 border-b border-border/60">
                {(['login', 'register'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => openAuth(m)}
                    className={cn(
                      'relative pb-2 text-sm font-medium transition-colors',
                      authMode === m ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {m === 'login' ? 'Sign In' : 'Register'}
                    {authMode === m && (
                      <motion.span
                        layoutId="authTab"
                        transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                        className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {authMode === 'register' && (
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      label="First name"
                      icon={<UserIcon className="size-3.5" />}
                      value={form.firstName}
                      onChange={(v) => update('firstName', v)}
                      required
                    />
                    <FormField
                      label="Last name"
                      icon={<UserIcon className="size-3.5" />}
                      value={form.lastName}
                      onChange={(v) => update('lastName', v)}
                      required
                    />
                  </div>
                )}
                <FormField
                  label="Email"
                  type="email"
                  icon={<Mail className="size-3.5" />}
                  value={form.email}
                  onChange={(v) => update('email', v)}
                  required
                />
                {authMode === 'register' && (
                  <FormField
                    label="Phone"
                    type="tel"
                    icon={<Phone className="size-3.5" />}
                    value={form.phone}
                    onChange={(v) => update('phone', v)}
                    required
                  />
                )}
                <FormField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(v) => update('password', v)}
                  required
                />

                {error && (
                  <p className="text-xs text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'w-full bg-gradient-to-r from-primary to-accent text-primary-foreground',
                    'shadow-sm shadow-primary/20 hover:opacity-95',
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {authMode === 'login' ? 'Signing in…' : 'Creating account…'}
                    </>
                  ) : authMode === 'login' ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => openAuth(authMode === 'login' ? 'register' : 'login')}
                  className="font-medium text-primary hover:underline"
                >
                  {authMode === 'login' ? 'Register' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = 'text',
  required,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {icon}
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
