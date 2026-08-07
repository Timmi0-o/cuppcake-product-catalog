'use client'

import {
	LOCALE_COOKIE_KEY,
	LOCALE_COOKIE_MAX_AGE,
} from '@/constants/locale-cookie.constants'
import {
	isAppLocale,
	LOCALE_OPTIONS,
	type AppLocale,
} from '@/constants/locales'
import { formatClientCookie } from '@/helpers/cookies/format-client-cookie'
import { useRouter } from '@/helpers/i18n/routing'
import { cn } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'

type LanguageSwitcherProps = {
	className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
	const router = useRouter()
	const locale = useLocale()
	const t = useTranslations('ui.language')
	const currentLocale = isAppLocale(locale) ? locale : LOCALE_OPTIONS[0].locale

	const handleChange = (nextLocale: AppLocale) => {
		if (nextLocale === currentLocale) {
			return
		}

		document.cookie = formatClientCookie(LOCALE_COOKIE_KEY, nextLocale, {
			maxAge: LOCALE_COOKIE_MAX_AGE,
		})
		router.refresh()
	}

	return (
		<div
			role='group'
			aria-label={t('label')}
			className={cn(
				'inline-flex items-center  gap-0.5 rounded-full border border-border bg-card/90 p-1 shadow-sm backdrop-blur-sm',
				className,
			)}
		>
			{LOCALE_OPTIONS.map(({ locale: optionLocale, label }) => {
				const isActive = optionLocale === currentLocale

				return (
					<button
						key={optionLocale}
						type='button'
						onClick={() => handleChange(optionLocale)}
						aria-pressed={isActive}
						className={cn(
							'rounded-full px-2.5 py-1.5 text-xs font-medium tracking-wide transition-colors',
							isActive
								? 'bg-primary text-primary-foreground'
								: 'text-muted-foreground hover:text-foreground',
						)}
					>
						{optionLocale.toUpperCase()}
						<span className='sr-only'>{label}</span>
					</button>
				)
			})}
		</div>
	)
}
