'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import styles from './empty-state.module.css';

type EmptyStateProps = {
  message: ReactNode;
  description?: ReactNode;
  className?: string;
  action?: ReactNode;
};

export function EmptyState({
  message,
  description,
  className,
  action,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(styles.root, className)}
    >
      <p className={styles.message}>{message}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
