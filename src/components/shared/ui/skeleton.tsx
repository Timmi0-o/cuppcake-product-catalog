import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-[color-mix(in_srgb,var(--foreground)_6.5%,transparent)]',
        'shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_4%,transparent)]',
        'after:pointer-events-none after:absolute after:inset-0',
        'after:animate-[skeleton-shimmer_1.6s_linear_infinite]',
        'after:bg-[linear-gradient(105deg,transparent_55%,color-mix(in_srgb,var(--foreground)_5%,transparent)_68%,color-mix(in_srgb,var(--foreground)_14%,transparent)_75%,color-mix(in_srgb,var(--foreground)_5%,transparent)_82%,transparent_95%)]',
        'motion-reduce:after:animate-none',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
