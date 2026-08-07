'use client';

import { Button } from '@/components/shared/ui/button';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import styles from './auth-modal.module.css';

type AuthModalProps = {
  /** When true, modal is forced open and cannot be dismissed. */
  forced?: boolean;
};

export function AuthModal({ forced = true }: AuthModalProps) {
  const t = useTranslations('ui.auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await signIn('baseCredentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('invalidCredentials'));
        return;
      }

      router.refresh();
    } catch {
      setError(t('serverError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-auth-title"
    >
      <div className={styles.dialog}>
        <h1 id="admin-auth-title" className={styles.title}>
          {t('loginTitle')}
        </h1>
        <p className={styles.description}>
          {forced ? t('loginRequiredDescription') : t('loginDescription')}
        </p>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="admin-auth-email">
              {t('email')}
            </label>
            <input
              id="admin-auth-email"
              className={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="admin-auth-password">
              {t('password')}
            </label>
            <input
              id="admin-auth-password"
              className={styles.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          <Button
            type="submit"
            className={styles.submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('loggingIn') : t('loginSubmit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
