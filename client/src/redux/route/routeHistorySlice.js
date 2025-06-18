import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
};

const routeHistorySlice = createSlice({
  name: "routeHistory",
  initialState,
  reducers: {
    addRoute: (state, action) => {
      const path = action.payload;
      const last = state.history[state.history.length - 1];
      if (last !== path) {
        state.history.push(path);
      }
    },
    goBackRoute: (state) => {
      if (state.history.length > 1) {
        state.history.pop();
      }
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const { addRoute, goBackRoute, clearHistory } = routeHistorySlice.actions;
export default routeHistorySlice.reducer;
