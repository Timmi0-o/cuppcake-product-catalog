import { RootProviders } from '@/components/providers/root-providers'
import { PreferencesBar } from '@/components/widgets/preferences-bar/preferences-bar'
import { auth } from '@/configs/auth/auth'
import { isAppLocale } from '@/constants/locales'
import {
	DEFAULT_THEME,
	isStoredTheme,
	THEME_COLORS,
	THEME_LIST,
	THEME_STORAGE_KEY,
	type IThemeValue,
} from '@/constants/theme.constants'
import { routing } from '@/helpers/i18n/routing'
import { cn } from '@/lib/utils'
import { getTheme } from '@wrksz/themes/next'
import type { Metadata, Viewport } from 'next'
import { getMessages, getTimeZone, setRequestLocale } from 'next-intl/server'
import { Fraunces, Manrope } from 'next/font/google'
import { notFound } from 'next/navigation'
import '../globals.css'

const manrope = Manrope({
	subsets: ['latin', 'latin-ext', 'cyrillic'],
	variable: '--font-outfit',
	display: 'swap',
})

const fraunces = Fraunces({
	subsets: ['latin', 'latin-ext'],
	variable: '--font-fraunces',
	display: 'swap',
})

const resolveInitialTheme = async (): Promise<IThemeValue> => {
	const storedTheme = await getTheme({
		storageKey: THEME_STORAGE_KEY,
		defaultTheme: DEFAULT_THEME,
		themes: [...THEME_LIST],
	})

	return isStoredTheme(storedTheme) ? storedTheme : DEFAULT_THEME
}

const getHtmlThemeClass = (theme: string): string =>
	theme === 'dark' ? 'dark' : 'light'

export const metadata: Metadata = {
	title: 'CUPPCAKE — каталог',
	description: 'Полезные торты и десерты CUPPCAKE',
}

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: THEME_COLORS.light },
		{ media: '(prefers-color-scheme: dark)', color: THEME_COLORS.dark },
	],
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ locale: string }>
}>) {
	const { locale } = await params

	if (!isAppLocale(locale)) {
		notFound()
	}

	setRequestLocale(locale)

	const [messages, timeZone, initialTheme, session] = await Promise.all([
		getMessages({ locale }),
		getTimeZone(),
		resolveInitialTheme(),
		auth(),
	])

	return (
		<html
			lang={locale}
			suppressHydrationWarning
			className={cn(
				manrope.variable,
				fraunces.variable,
				getHtmlThemeClass(initialTheme),
				'h-full antialiased',
			)}
		>
			<body className='flex min-h-dvh flex-col'>
				<RootProviders
					locale={locale}
					messages={messages}
					timeZone={timeZone}
					initialTheme={initialTheme}
					session={session}
				>
					<main className='mx-auto w-full max-w-[1440px] flex-1 px-2 py-8 sm:px-6 sm:py-10'>
						{children}
					</main>
					<PreferencesBar />
				</RootProviders>
			</body>
		</html>
	)
}
