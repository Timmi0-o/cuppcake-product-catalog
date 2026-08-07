'use client'

import { CatalogProductGridSkeleton } from '@/components/pages/catalog/components/skeletons/catalog-product-grid-skeleton/catalog-product-grid-skeleton'
import { EmptyState } from '@/components/shared/components/empty-state/empty-state'
import { ProductCard } from '@/components/shared/components/product/product-card/product-card'
import { Button } from '@/components/shared/ui/button'
import { getPendingSkeletonCount } from '@/helpers/pagination/meta-pagination'
import { useProductGetManyInfinite } from '@/hooks/actions/product/use-product-get-many-infinite'
import { useInfiniteScrollObserver } from '@/hooks/use-infinite-scroll-observer'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import styles from './product-grid.module.css'

const PAGE_LIMIT = 20

type ProductGridProps = {
	categorySlug?: string
	search?: string
}

export function ProductGrid({ categorySlug, search }: ProductGridProps) {
	const t = useTranslations('pages.catalog')

	const filters = useMemo(
		() => ({
			limit: PAGE_LIMIT,
			includeImages: true,
			...(categorySlug ? { categorySlug } : {}),
			...(search ? { search } : {}),
		}),
		[categorySlug, search],
	)

	const listQuery = useProductGetManyInfinite(filters)

	const handleLoadMore = useCallback(() => {
		if (!listQuery.hasNextPage || listQuery.isFetchingNextPage) {
			return
		}
		void listQuery.fetchNextPage()
	}, [
		listQuery.fetchNextPage,
		listQuery.hasNextPage,
		listQuery.isFetchingNextPage,
	])

	const { sentinelRef } = useInfiniteScrollObserver({
		onLoadMore: handleLoadMore,
		hasMore: listQuery.hasNextPage,
		isLoading: listQuery.isFetchingNextPage,
		enabled: !listQuery.isLoading && !listQuery.error,
	})

	if (listQuery.isLoading) {
		return <CatalogProductGridSkeleton count={PAGE_LIMIT} />
	}

	if (listQuery.error) {
		return (
			<EmptyState
				message={t('loadError')}
				description={t('loadErrorDescription')}
				action={
					<Button
						type='button'
						variant='outline'
						onClick={() => void listQuery.refetch()}
					>
						{t('retry')}
					</Button>
				}
			/>
		)
	}

	if (listQuery.items.length === 0) {
		return (
			<EmptyState
				message={t('emptyTitle')}
				description={t('emptyDescription')}
			/>
		)
	}

	const skeletonCount = listQuery.isFetchingNextPage
		? getPendingSkeletonCount(listQuery.meta, listQuery.items.length) ||
			listQuery.limit
		: 0

	return (
		<div className={styles.root}>
			<div className={styles.grid} aria-busy={listQuery.isFetchingNextPage}>
				{listQuery.items.map((product, index) => (
					<ProductCard key={product.id} product={product} index={index} />
				))}
				{skeletonCount > 0 ? (
					<CatalogProductGridSkeleton count={skeletonCount} embedded />
				) : null}
			</div>
			<div ref={sentinelRef} className={styles.sentinel} aria-hidden />
		</div>
	)
}
