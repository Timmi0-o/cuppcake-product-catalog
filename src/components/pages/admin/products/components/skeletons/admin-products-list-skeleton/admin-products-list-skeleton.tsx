import { Skeleton } from "@/components/shared/ui/skeleton";
import styles from "./admin-products-list-skeleton.module.css";

type AdminProductsListSkeletonProps = {
  count?: number;
};

export function AdminProductsListSkeleton({
  count = 8,
}: AdminProductsListSkeletonProps) {
  return (
    <div className={styles.root} aria-busy aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={styles.row}>
          <div className={styles.main}>
            <Skeleton className={styles.name} />
            <Skeleton className={styles.slug} />
          </div>
          <Skeleton className={styles.price} />
        </div>
      ))}
    </div>
  );
}
