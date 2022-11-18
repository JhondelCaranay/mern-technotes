import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken } = action.payload;
            state.token = accessToken;
            // console.log("🚀 ~ file: authSLice.js ~ line 13 ~ accessToken", accessToken)
        },
        logOut: (state) => {
            state.token = null;
        }
    }
});


export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token