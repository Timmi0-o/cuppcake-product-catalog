import { productsGetMany } from '@/actions/product/actions';
import { Button } from '@/components/shared/ui/button';
import { Link } from '@/helpers/i18n/routing';
import { getTranslations } from 'next-intl/server';
import styles from './admin-products-page.module.css';

export async function AdminProductsPage() {
  const t = await getTranslations('pages.admin');
  const response = await productsGetMany({
    filters: {
      limit: 200,
      includeImages: false,
    },
  });

  const products = response.result?.data?.items ?? [];
  const total = response.result?.data?.total ?? products.length;

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('productsTitle')}</h1>
          <p className={styles.meta}>
            {t('productsCount', { count: total })}
          </p>
        </div>
        <Button render={<Link href="/admin/products/new" />}>
          {t('createProduct')}
        </Button>
      </div>

      {products.length === 0 ? (
        <p className={styles.empty}>{t('productsEmpty')}</p>
      ) : (
        <div className={styles.list}>
          {products.map((product) => (
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
      )}
    </section>
  );
}
