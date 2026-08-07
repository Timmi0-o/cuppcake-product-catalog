import type * as React from 'react';
import { cn } from '@/lib/utils';

function Badge({
  className,
  ...props
}: React.ComponentProps<'span'> & { variant?: 'default' | 'outline' }) {
  return (
    <span
      data-slot="badge"
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide',
        'bg-secondary text-secondary-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
