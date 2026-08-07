'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '@/lib/utils';

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border bg-zinc-200/80 p-0.5 shadow-[0_1px_2px_rgb(0_0_0_/0.08)] transition-[background-color,border-color,box-shadow] duration-200 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-45 data-checked:border-primary data-checked:bg-primary dark:bg-zinc-800/80 dark:data-checked:bg-primary',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 data-checked:translate-x-5 data-unchecked:translate-x-0',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
