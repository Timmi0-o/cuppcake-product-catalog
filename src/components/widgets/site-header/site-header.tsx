import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/widgets/language-switcher/language-switcher';
import { ThemeToggle } from '@/components/widgets/theme-toggle/theme-toggle';
import { Link } from '@/helpers/i18n/routing';
import styles from './site-header.module.css';

export async function SiteHeader() {
  const t = await getTranslations('common');

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brandLink} aria-label={t('brand')}>
          <Image
            src="/logo.png"
            alt={t('brand')}
            width={160}
            height={160}
            priority
            className={styles.logo}
          />
        </Link>

        <div className={styles.controls}>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
