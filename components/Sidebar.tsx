'use client';

import { Home, LogOut, Menu, Settings, Sheet, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { SheetContent, SheetTrigger } from './ui/sheet';

const navItems = [
	{ name: 'Главная', href: '/dashboard', icon: Home },
	{ name: 'Пользователи', href: '/users', icon: Users },
	{ name: 'Настройки', href: '/settings', icon: Settings },
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<div className='flex min-h-screen w-full'>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant='ghost'
						size='icon'
						className='lg:hidden fixed top-4 left-4 z-50'
					>
						<Menu className='h-5 w-5' />
					</Button>
				</SheetTrigger>
				<SheetContent side='left' className='p-0 w-64'>
					<SidebarContent pathname={pathname} />
				</SheetContent>
			</Sheet>

			<aside className='hidden lg:flex w-64 flex-col border-r bg-background'>
				<SidebarContent pathname={pathname} />
			</aside>
		</div>
	);
}

function SidebarContent({ pathname }: { pathname: string }) {
	return (
		<div className='flex flex-col h-full'>
			<div className='p-6 border-b'>
				<h1 className='text-lg font-semibold tracking-tight'>Admin Panel</h1>
			</div>

			<nav className='flex-1 p-2 space-y-1'>
				{navItems.map(({ name, href, icon: Icon }) => (
					<Link
						key={href}
						href={href}
						className={cn(
							'flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors hover:bg-accent',
							pathname.startsWith(href)
								? 'bg-accent text-accent-foreground'
								: 'text-muted-foreground'
						)}
					>
						<Icon className='h-4 w-4' />
						{name}
					</Link>
				))}
			</nav>

			<div className='p-4 border-t'>
				<Button variant='ghost' className='w-full justify-start'>
					<LogOut className='mr-2 h-4 w-4' />
					Выйти
				</Button>
			</div>
		</div>
	);
}
