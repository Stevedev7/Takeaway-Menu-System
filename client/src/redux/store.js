/**
 * Configures the Redux store using `configureStore` from Redux Toolkit.
 * Combines multiple reducers, including `authReduces`, `locationSlice`, and `apiSlice.reducer`.
 * Applies middleware and enables Redux DevTools for development.
 */

import { configureStore } from '@reduxjs/toolkit';
import authReduces from './slices/authSlice';
import locationSlice from './slices/locationSlice';
import { apiSlice } from './apiSlices/api';


export const store = configureStore({
	reducer: {
		auth: authReduces,
		location: locationSlice,
		[apiSlice.reducerPath]: apiSlice.reducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(apiSlice.middleware),
	devTools: true
});

export default store;