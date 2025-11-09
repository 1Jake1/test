'use client';
import { useEffect, useState } from 'react';

export function useTheme() {
	const getInitialTheme = (): 'light' | 'dark' => {
		if (typeof window === 'undefined') return 'light';
		const stored = localStorage.getItem('theme');
		if (stored === 'dark') return 'dark';
		return 'light';
	};

	const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark');
		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () =>
		setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

	return { theme, toggleTheme };
}
