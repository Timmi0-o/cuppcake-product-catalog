import { Skeleton } from '@/components/shared/ui/skeleton';
import { cn } from '@/lib/utils';
import styles from './catalog-product-grid-skeleton.module.css';

type CatalogProductGridSkeletonProps = {
  count?: number;
  /** Render skeleton cards without outer grid — for embedding into product grid. */
  embedded?: boolean;
  className?: string;
};

export function CatalogProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <Skeleton className={styles.media} />
      <div className={styles.body}>
        <Skeleton className={styles.title} />
        <Skeleton className={styles.line} />
        <Skeleton className={styles.price} />
        <Skeleton className={styles.button} />
      </div>
    </div>
  );
}

export function CatalogProductGridSkeleton({
  count = 8,
  embedded = false,
  className,
}: CatalogProductGridSkeletonProps) {
  const cards = Array.from({ length: count }, (_, index) => (
    <CatalogProductCardSkeleton key={index} />
  ));

  if (embedded) {
    return <>{cards}</>;
  }

  return (
    <div className={cn(styles.root, className)} aria-busy aria-hidden>
      {cards}
    </div>
  );
}
