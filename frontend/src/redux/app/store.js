import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSLice";

const isDevMode = import.meta.env.VITE_MODE === "dev" ? true : false;

export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		auth: authReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
	devTools: isDevMode,
});

setupListeners(store.dispatch);

// devTools: If this is a boolean, it will be used to indicate whether configureStore should automatically enable support for the Redux DevTools browser extension.
// devTools - Whether to enable Redux DevTools integration. Defaults to true in development mode, and false in production mode.

// setupListeners() - A utility used to enable refetchOnFocus and refetchOnReconnect behaviors. It requires the dispatch method from your store. Calling setupListeners(store.dispatch) will configure listeners with the recommended defaults, but you have the option of providing a callback for more granular controlThis function is used to set up listeners for the cache invalidation and refetching of queries. It should be called after the store is created, and the dispatch method should be passed in.
