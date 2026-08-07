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
