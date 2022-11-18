import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSLice";

const baseQuery = fetchBaseQuery({
	baseUrl: import.meta.env.VITE_BASE_URL,
	credentials: "include", // credentials: 'same-origin' | 'include' | 'omit'
	// credentials: - include: always send cookies, even for cross-origin requests
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token;

		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}

		return headers;
	}
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
	// console.log(args) // request url, method, body
	// console.log(api) // signal, dispatch, getState()
	// console.log(extraOptions) //custom like {shout: true}
	let result = await baseQuery(args, api, extraOptions)
	// console.log("🚀 ~ file: apiSlice.js ~ line 23 ~ baseQueryWithReauth ~ result", result)

	// If you want, handle other status codes, too
	if (result?.error?.status === 403) {
		console.log('sending refresh token')

		// send refresh token to get new access token 
		const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
		console.log("🚀 ~ file: apiSlice.js ~ line 32 ~ baseQueryWithReauth ~ refreshResult", refreshResult)

		if (refreshResult?.data) {

			// store the new token 
			await api.dispatch(setCredentials({ ...refreshResult.data }))

			// retry original query with new access token
			result = await baseQuery(args, api, extraOptions)
			// console.log("🚀 ~ file: apiSlice.js ~ line 41 ~ baseQueryWithReauth ~ result", result)
		} else {
			if (refreshResult?.error?.status === 403) {
				refreshResult.error.data.message = "Your login has expired."
			}
			return refreshResult
		}
	}

	return result
}

export const apiSlice = createApi({
	// reducerPath: "api", // reducerPath - The name of the reducer to use for this API. Defaults to the name of the slice is "api"
	// baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
	// baseQuery,
	baseQuery: baseQueryWithReauth,
	tagTypes: ["User", "Note"],
	endpoints: (builder) => ({}),
});
