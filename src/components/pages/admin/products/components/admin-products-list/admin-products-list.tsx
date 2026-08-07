'use client';

import { AdminProductsListSkeleton } from '@/components/pages/admin/products/components/skeletons/admin-products-list-skeleton/admin-products-list-skeleton';
import { EmptyState } from '@/components/shared/components/empty-state/empty-state';
import { Button } from '@/components/shared/ui/button';
import { Link } from '@/helpers/i18n/routing';
import { getPendingSkeletonCount } from '@/helpers/pagination/meta-pagination';
import { useProductGetManyInfinite } from '@/hooks/actions/product/use-product-get-many-infinite';
import { useInfiniteScrollObserver } from '@/hooks/use-infinite-scroll-observer';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import styles from '../../admin-products-page.module.css';

const PAGE_LIMIT = 20;

export function AdminProductsList() {
  const t = useTranslations('pages.admin');

  const filters = useMemo(
    () => ({
      limit: PAGE_LIMIT,
      includeImages: false,
    }),
    [],
  );

  const listQuery = useProductGetManyInfinite(filters, {
    errorMessage: t('productsLoadError'),
  });

  const handleLoadMore = useCallback(() => {
    if (!listQuery.hasNextPage || listQuery.isFetchingNextPage) {
      return;
    }
    void listQuery.fetchNextPage();
  }, [
    listQuery.fetchNextPage,
    listQuery.hasNextPage,
    listQuery.isFetchingNextPage,
  ]);

  const { sentinelRef } = useInfiniteScrollObserver({
    onLoadMore: handleLoadMore,
    hasMore: listQuery.hasNextPage,
    isLoading: listQuery.isFetchingNextPage,
    enabled: !listQuery.isLoading && !listQuery.error,
  });

  const totalCount = listQuery.meta?.totalCount ?? listQuery.items.length;

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('productsTitle')}</h1>
          <p className={styles.meta}>
            {listQuery.isLoading
              ? t('productsCountLoading')
              : t('productsCount', { count: totalCount })}
          </p>
        </div>
        <Button render={<Link href="/admin/products/new" />}>
          {t('createProduct')}
        </Button>
      </div>

      {listQuery.isLoading ? (
        <AdminProductsListSkeleton count={PAGE_LIMIT} />
      ) : listQuery.error ? (
        <EmptyState
          message={t('productsLoadError')}
          description={t('productsLoadErrorDescription')}
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => void listQuery.refetch()}
            >
              {t('productsRetry')}
            </Button>
          }
        />
      ) : listQuery.items.length === 0 ? (
        <EmptyState message={t('productsEmpty')} />
      ) : (
        <>
          <div className={styles.list}>
            {listQuery.items.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className={styles.row}
              >
                <div>
                  <p className={styles.name}>{product.name}</p>
                  <p className={styles.slug}>{product.slug}</p>
                </div>
                <p className={styles.price}>
                  {product.price} ₽ / {product.measurementUnit.symbol}
                </p>
              </Link>
            ))}
          </div>
          {listQuery.isFetchingNextPage ? (
            <AdminProductsListSkeleton
              count={
                getPendingSkeletonCount(
                  listQuery.meta,
                  listQuery.items.length,
                ) || listQuery.limit
              }
            />
          ) : null}
          <div ref={sentinelRef} className={styles.sentinel} aria-hidden />
        </>
      )}
    </section>
  );
}
