import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
	// reducerPath: "api", // reducerPath - The name of the reducer to use for this API. Defaults to the name of the slice is "api"
	baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
	tagTypes: ["User", "Note"],
	endpoints: (builder) => ({}),
});
