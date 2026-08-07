export const formatPriceRub = (
  price: number | string,
  locale = 'ru-RU',
): string => {
  const numeric = typeof price === 'number' ? price : Number(price);

  if (!Number.isFinite(numeric)) {
    return String(price);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(numeric);
};

export const formatProductPrice = (
  price: number | string,
  measurementUnitSymbol: string,
  locale = 'ru-RU',
): string => `${formatPriceRub(price, locale)} / ${measurementUnitSymbol}`;

export const formatProductPriceWithVariants = (
  price: number | string,
  measurementUnitSymbol: string,
  priceVariants: Array<{ volumeMl: number; price: string }> | null | undefined,
  locale = 'ru-RU',
): string => {
  if (!priceVariants || priceVariants.length === 0) {
    return formatProductPrice(price, measurementUnitSymbol, locale);
  }

  if (priceVariants.length === 1) {
    const [variant] = priceVariants;
    return `${formatPriceRub(variant.price, locale)} / ${variant.volumeMl} ${measurementUnitSymbol}`;
  }

  const volumes = priceVariants.map((variant) => variant.volumeMl).join('/');
  const prices = priceVariants
    .map((variant) => formatPriceRub(variant.price, locale))
    .join(' / ');

  return `${prices} · ${volumes} ${measurementUnitSymbol}`;
};
