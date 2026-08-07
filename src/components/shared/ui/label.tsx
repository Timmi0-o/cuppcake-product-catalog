'use client';

import type * as React from 'react';

import { cn } from '@/lib/utils';

function LabelRoot({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium text-foreground select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-45 peer-disabled:cursor-not-allowed peer-disabled:opacity-45',
        className,
      )}
      {...props}
    />
  );
}

type LabelComponent = typeof LabelRoot & {
  Root: typeof LabelRoot;
};

const Label = Object.assign(LabelRoot, {
  Root: LabelRoot,
}) as LabelComponent;

export { Label };
