import { LanguageSwitcher } from '@/components/widgets/language-switcher/language-switcher'
import { ThemeToggle } from '@/components/widgets/theme-toggle/theme-toggle'

export function PreferencesBar() {
	return (
		<div className='pointer-events-none fixed right-1 bottom-4 z-50 flex items-center gap-2 sm:right-6 sm:bottom-6'>
			<div className='pointer-events-auto flex items-center flex-col gap-2'>
				<LanguageSwitcher />
				<ThemeToggle />
			</div>
		</div>
	)
}
