import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
    loading:false,
    error:null,
    userLocation:null
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state) => {
            state.loading = true;
        },
        signInSuccess:(state,action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInError:(state,action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setInfoUser:(state,action) => {
            state.currentUser.details = action.payload;
            state.loading = false;
        },
        setUserLoc:(state,action) => {
            state.currentUser.location = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        addUserLoc: (state,action) => {
            state.userLocation = action.payload,
            state.loading = false;
        }
    }
});

export const {signInStart,signInSuccess,signInError,logout,setInfoUser,setUserLoc,addUserLoc} = userSlice.actions;

export default userSlice.reducer;