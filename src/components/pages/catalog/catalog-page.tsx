import { CategoryFilter } from '@/components/pages/catalog/components/category-filter/category-filter'
import { ProductGrid } from '@/components/pages/catalog/components/product-grid/product-grid'
import { createProductsContainer } from '@/lib/di/products.container'
import { Suspense } from 'react'

type CatalogPageProps = {
	categoryId?: string
}

export async function CatalogPage({ categoryId }: CatalogPageProps) {
	const { findCategories, findProducts } = createProductsContainer()

	const [categories, productsResult] = await Promise.all([
		findCategories.execute(),
		findProducts.execute({
			categoryId,
			includeImages: true,
			limit: 48,
		}),
	])

	return (
		<div className='space-y-8'>
			<Suspense fallback={<div className='h-12 border-b border-border' />}>
				<CategoryFilter categories={categories} />
			</Suspense>

			<ProductGrid products={productsResult.items} />
		</div>
	)
}
