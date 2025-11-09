'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import { Provider } from 'react-redux';
import { AppSidebar } from '../components/app-sidebar';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '../components/ui/sidebar';
import { store } from '../lib/store/store';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Provider store={store}>
					<SidebarProvider>
						<AppSidebar />
						<SidebarInset>
							<header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
								<div className='flex items-center gap-2 px-4'>
									<SidebarTrigger className='-ml-1' />
								</div>
							</header>
							{children}
						</SidebarInset>
					</SidebarProvider>
				</Provider>
			</body>
		</html>
	);
}
