import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FormItemMeta = {
	id: string;
};

type FormSliceState = {
	items: Record<string, FormItemMeta>;
};

const initialState: FormSliceState = {
	items: {},
};

const formSlice = createSlice({
	name: 'form',
	initialState,
	reducers: {
		registerFormItem(
			state,
			action: PayloadAction<{ name: string; id: string }>
		) {
			state.items[action.payload.name] = { id: action.payload.id };
		},
		unregisterFormItem(state, action: PayloadAction<{ name: string }>) {
			delete state.items[action.payload.name];
		},
		resetFormSlice() {
			return initialState;
		},
	},
});

export const { registerFormItem, unregisterFormItem, resetFormSlice } =
	formSlice.actions;

export type { FormItemMeta, FormSliceState };
export default formSlice.reducer;

