import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken } = action.payload;
            console.log("🚀 ~ file: authSlice.js ~ line 12 ~ accessToken", accessToken)
            state.token = accessToken;
        },
        logOut: (state) => {
            state.token = null;
        }
    }
});


export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;