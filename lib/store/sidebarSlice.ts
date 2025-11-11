import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SidebarSliceState = {
	open: boolean;
	openMobile: boolean;
	isMobile: boolean;
};

const initialState: SidebarSliceState = {
	open: true,
	openMobile: false,
	isMobile: false,
};

const sidebarSlice = createSlice({
	name: 'sidebar',
	initialState,
	reducers: {
		setSidebarOpen(state, action: PayloadAction<boolean>) {
			state.open = action.payload;
		},
		setSidebarOpenMobile(state, action: PayloadAction<boolean>) {
			state.openMobile = action.payload;
		},
		setSidebarIsMobile(state, action: PayloadAction<boolean>) {
			state.isMobile = action.payload;
		},
		toggleSidebar(state) {
			if (state.isMobile) {
				state.openMobile = !state.openMobile;
			} else {
				state.open = !state.open;
			}
		},
		resetSidebarState(state) {
			state.open = initialState.open;
			state.openMobile = initialState.openMobile;
			state.isMobile = initialState.isMobile;
		},
	},
});

export const {
	setSidebarOpen,
	setSidebarOpenMobile,
	setSidebarIsMobile,
	toggleSidebar,
	resetSidebarState,
} = sidebarSlice.actions;

export type { SidebarSliceState };
export default sidebarSlice.reducer;

