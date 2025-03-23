import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message:null,
    type:null
}

const flashSlice = createSlice({
    name:'flash',
    initialState,
    reducers:{
        setFlashMessage: (state,action) => {
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
        clearFlashMessage: (state) => {
            state.message = null;
            state.type = null;
        }
    }
});

export const {setFlashMessage,clearFlashMessage} = flashSlice.actions;

export default flashSlice.reducer;