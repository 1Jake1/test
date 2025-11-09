'use client';

import {
	AudioWaveform,
	Command,
	GalleryVerticalEnd,
	Settings2,
} from 'lucide-react';
import * as React from 'react';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from './ui/sidebar';

const data = {
	user: {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	teams: [
		{
			name: 'Acme Inc',
			logo: GalleryVerticalEnd,
			plan: 'Enterprise',
		},
		{
			name: 'Acme Corp.',
			logo: AudioWaveform,
			plan: 'Startup',
		},
		{
			name: 'Evil Corp.',
			logo: Command,
			plan: 'Free',
		},
	],
	navMain: [
		{
			title: 'Settings',
			url: '#',
			icon: Settings2,
			items: [
				{
					title: 'Users',
					url: '/users',
				},
				{
					title: 'Prizes',
					url: '/prizes',
				},
				{
					title: 'Dashboard',
					url: '/dashboard',
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
