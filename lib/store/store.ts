import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import formReducer from './formSlice';
import sidebarReducer from './sidebarSlice';
import { userApi } from './userApi';

export const store = configureStore({
	reducer: {
		[userApi.reducerPath]: userApi.reducer,
		sidebar: sidebarReducer,
		form: formReducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(userApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
