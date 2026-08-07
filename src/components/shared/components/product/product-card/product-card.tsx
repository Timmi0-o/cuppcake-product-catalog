'use client';

import { ProductCardMedia } from '@/components/shared/components/product/product-card/product-card-media/product-card-media';
import { Button } from '@/components/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shared/ui/card';
import { INTL_LOCALES, isAppLocale } from '@/constants/locales';
import { Link } from '@/helpers/i18n/routing';
import { formatProductPriceWithVariants } from '@/utils/format-price.util';
import { pickImageUrlByVariant } from '@/utils/pick-image-url-by-variant.util';
import { useLocale, useTranslations } from 'next-intl';

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  note: string | null;
  price: string;
  priceVariants?: Array<{ volumeMl: number; price: string }> | null;
  measurementUnit: { symbol: string };
  images?: Array<{
    id: string;
    fileUrl: string;
    urls: string[];
    originalName: string;
  }>;
};

type ProductCardProps = {
  product: ProductCardData;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const t = useTranslations('pages.catalog');
  const locale = useLocale();
  const href = `/product/${product.slug}`;
  const priceLocale = isAppLocale(locale)
    ? INTL_LOCALES[locale]
    : INTL_LOCALES.ru;

  const mediaImages = (product.images ?? []).map((image) => {
    const urls = image.urls.length > 0 ? image.urls : [image.fileUrl];
    return {
      id: image.id,
      src: pickImageUrlByVariant(urls, 'low', image.fileUrl),
      alt: product.name,
    };
  });

  return (
    <Card
      className="group animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <ProductCardMedia
        href={href}
        productName={product.name}
        images={mediaImages}
      />
      <CardHeader className="gap-2">
        <CardTitle>
          <Link href={href} className="hover:text-primary">
            {product.name}
          </Link>
        </CardTitle>
        {product.description ? (
          <CardDescription className="line-clamp-3">
            {product.description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-base font-medium tracking-tight text-foreground">
          {formatProductPriceWithVariants(
            product.price,
            product.measurementUnit.symbol,
            product.priceVariants,
            priceLocale,
          )}
        </p>
        {product.note ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {product.note}
          </p>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant="outline"
          render={<Link href={href} />}
          nativeButton={false}
        >
          {t('moreDetails')}
        </Button>
      </CardFooter>
    </Card>
  );
}
