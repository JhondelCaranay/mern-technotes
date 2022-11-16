import { apiSlice } from "../../app/api/apiSlice";
import { logOut } from "../../features/auth/authSLice";


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
                    console.log("🚀 ~ file: authApiSLice.js ~ line 22 ~ onQueryStarted ~ data", data)

                    dispatch(logOut());
                    dispatch(authApiSlice.util.resetApiState());
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }),
});

export const { useLoginMutation, useSendLogoutMutation } = authApiSlice;