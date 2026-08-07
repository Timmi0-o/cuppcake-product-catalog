import {
	ProductCard,
	type ProductCardData,
} from '@/components/shared/components/product/product-card/product-card'
import { getTranslations } from 'next-intl/server'

type ProductGridProps = {
	products: ProductCardData[]
}

export async function ProductGrid({ products }: ProductGridProps) {
	const t = await getTranslations('pages.catalog')

	if (products.length === 0) {
		return (
			<div className='rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center'>
				<p className='font-display text-2xl text-foreground'>
					{t('emptyTitle')}
				</p>
				<p className='mt-2 text-sm text-muted-foreground'>
					{t('emptyDescription')}
				</p>
			</div>
		)
	}

	return (
		<div className='grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
			{products.map((product, index) => (
				<ProductCard key={product.id} product={product} index={index} />
			))}
		</div>
	)
}
