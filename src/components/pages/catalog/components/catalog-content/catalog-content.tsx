'use client'

import { CatalogSearchInput } from '@/components/pages/catalog/components/catalog-search-input/catalog-search-input'
import {
	CategoryFilter,
	type CategoryFilterItem,
} from '@/components/pages/catalog/components/category-filter/category-filter'
import { ProductGrid } from '@/components/pages/catalog/components/product-grid/product-grid'
import { useDebounceValue } from '@/hooks/use-debounce-value'
import { Suspense, useState } from 'react'

const SEARCH_DEBOUNCE_MS = 300

type CatalogContentProps = {
	categories: CategoryFilterItem[]
	categorySlug?: string
}

export function CatalogContent({
	categories,
	categorySlug,
}: CatalogContentProps) {
	const [searchQuery, setSearchQuery] = useState('')
	const debouncedSearch = useDebounceValue(
		searchQuery.trim(),
		SEARCH_DEBOUNCE_MS,
	)

	return (
		<div className='space-y-8'>
			<div className='space-y-4'>
				<Suspense fallback={<div className='h-12 border-b border-border' />}>
					<CategoryFilter categories={categories} />
				</Suspense>

				<CatalogSearchInput
					value={searchQuery}
					onValueChange={setSearchQuery}
				/>
			</div>

			<ProductGrid
				categorySlug={categorySlug}
				search={debouncedSearch || undefined}
			/>
		</div>
	)
}
