import Image from 'next/image';
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
import { formatProductPrice } from '@/utils/format-price.util';
import { getLocale, getTranslations } from 'next-intl/server';

export type ProductCardData = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  measurementUnit: { symbol: string };
  images?: Array<{ fileUrl: string; originalName: string }>;
};

type ProductCardProps = {
  product: ProductCardData;
  index?: number;
};

export async function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [t, locale] = await Promise.all([
    getTranslations('pages.catalog'),
    getLocale(),
  ]);
  const image = product.images?.[0];
  const href = `/product/${product.id}`;
  const priceLocale = isAppLocale(locale) ? INTL_LOCALES[locale] : INTL_LOCALES.ru;

  return (
    <Card
      className="group animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
      >
        {image ? (
          <Image
            src={image.fileUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary to-muted px-6 text-center">
            <span className="font-display text-2xl text-primary/40">
              {product.name}
            </span>
          </div>
        )}
      </Link>
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
      <CardContent>
        <p className="text-base font-medium tracking-tight text-foreground">
          {formatProductPrice(
            product.price,
            product.measurementUnit.symbol,
            priceLocale,
          )}
        </p>
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
