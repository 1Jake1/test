import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './store';

export const selectSidebarSlice = (state: RootState) => state.sidebar;

export const selectSidebarOpen = (state: RootState) =>
	selectSidebarSlice(state).open;
export const selectSidebarOpenMobile = (state: RootState) =>
	selectSidebarSlice(state).openMobile;
export const selectSidebarIsMobile = (state: RootState) =>
	selectSidebarSlice(state).isMobile;
export const selectSidebarUiState = createSelector(
	selectSidebarOpen,
	open => (open ? 'expanded' : 'collapsed')
);

export const selectFormSlice = (state: RootState) => state.form;

export const makeSelectFormItemMeta = (name: string) =>
	createSelector(selectFormSlice, form =>
		name ? form.items[name] ?? null : null
	);

