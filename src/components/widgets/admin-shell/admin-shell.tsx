'use client';

import { Button } from '@/components/shared/ui/button';
import { Link, usePathname } from '@/helpers/i18n/routing';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import styles from './admin-shell.module.css';

type AdminShellProps = {
  userEmail: string;
  children: ReactNode;
};

export function AdminShell({ userEmail, children }: AdminShellProps) {
  const t = useTranslations('pages.admin');
  const pathname = usePathname();

  const isProducts =
    pathname === '/admin/products' || pathname.startsWith('/admin/products/');

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.brand}>{t('shellTitle')}</p>
          <p className={styles.userEmail}>{userEmail}</p>
        </div>
        <nav className={styles.nav}>
          <Link
            href="/admin"
            className={cn(
              styles.navLink,
              pathname === '/admin' && styles.navLinkActive,
            )}
          >
            {t('navDashboard')}
          </Link>
          <Link
            href="/admin/products"
            className={cn(styles.navLink, isProducts && styles.navLinkActive)}
          >
            {t('navProducts')}
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              void signOut({ redirect: false }).then(() => {
                window.location.href = '/admin';
              });
            }}
          >
            {t('logout')}
          </Button>
        </nav>
      </header>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
