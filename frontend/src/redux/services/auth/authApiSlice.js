import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "../../features/auth/authSLice";


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/api/auth/login",
                method: "POST",
                body: { ...credentials },
            }),
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: "/api/auth/logout",
                method: "POST",
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // console.log("🚀 ~ file: authApiSlice.js ~ line 22 ~ onQueryStarted ~ data", data)

                    dispatch(logOut());

                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState());
                    }, 1000)
                    // dispatch(authApiSlice.util.resetApiState());
                } catch (error) {
                    // console.log("🚀 ~ file: authApiSlice.js ~ line 30 ~ onQueryStarted ~ error", error)
                    console.log(error);
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/api/auth/refresh',
                method: 'GET',
                // headers: {
                //     'authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                // }
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    const { accessToken } = data
                    await dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
    }),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } = authApiSlice;