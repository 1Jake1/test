'use client';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<Button
			variant='ghost'
			size='icon'
			onClick={toggleTheme}
			aria-label='Переключить тему'
		>
			{theme === 'light' ? (
				<Moon className='w-4 h-4' />
			) : (
				<Sun className='w-4 h-4' />
			)}
		</Button>
	);
}
