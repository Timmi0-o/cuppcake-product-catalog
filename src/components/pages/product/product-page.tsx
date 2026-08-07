import { ProductGallery } from '@/components/pages/product/components/product-gallery/product-gallery';
import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import { Separator } from '@/components/shared/ui/separator';
import { INTL_LOCALES, isAppLocale } from '@/constants/locales';
import { Link } from '@/helpers/i18n/routing';
import { createProductsContainer } from '@/lib/di/products.container';
import { formatProductPrice } from '@/utils/format-price.util';
import { ArrowLeft } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

type ProductPageProps = {
  productId: string;
};

export async function ProductPage({ productId }: ProductPageProps) {
  const { getProductById } = createProductsContainer();
  const [t, locale] = await Promise.all([
    getTranslations('pages.product'),
    getLocale(),
  ]);
  const priceLocale = isAppLocale(locale) ? INTL_LOCALES[locale] : INTL_LOCALES.ru;

  const product = await getProductById
    .execute({
      productId,
      includeImages: true,
    })
    .catch(() => null);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 gap-1.5 text-muted-foreground"
        render={<Link href="/" />}
        nativeButton={false}
      >
        <ArrowLeft />
        {t('backToCatalog')}
      </Button>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery
          images={product.images ?? []}
          productName={product.name}
        />

        <div className="animate-in fade-in slide-in-from-right-2 space-y-6 duration-500">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <Badge key={category.id}>{category.name}</Badge>
              ))}
            </div>
            <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
              {product.name}
            </h1>
            <p className="text-2xl font-medium tracking-tight text-primary">
              {formatProductPrice(
                product.price,
                product.measurementUnit.symbol,
                priceLocale,
              )}
            </p>
          </div>

          {product.description ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          ) : null}

          <Separator />

          <div className="space-y-4">
            <h2 className="text-sm font-semibold tracking-[0.14em] text-foreground uppercase">
              {t('nutritionTitle')}
            </h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-secondary/70 px-3 py-3">
                <dt className="text-xs text-muted-foreground">{t('kcal')}</dt>
                <dd className="mt-1 text-lg font-medium">{product.manualKkal}</dd>
              </div>
              <div className="rounded-xl bg-secondary/70 px-3 py-3">
                <dt className="text-xs text-muted-foreground">{t('protein')}</dt>
                <dd className="mt-1 text-lg font-medium">
                  {t('grams', { value: product.nutritionalInfo.protein })}
                </dd>
              </div>
              <div className="rounded-xl bg-secondary/70 px-3 py-3">
                <dt className="text-xs text-muted-foreground">{t('fats')}</dt>
                <dd className="mt-1 text-lg font-medium">
                  {t('grams', { value: product.nutritionalInfo.fats })}
                </dd>
              </div>
              <div className="rounded-xl bg-secondary/70 px-3 py-3">
                <dt className="text-xs text-muted-foreground">
                  {t('carbohydrates')}
                </dt>
                <dd className="mt-1 text-lg font-medium">
                  {t('grams', {
                    value: product.nutritionalInfo.carbohydrates,
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
