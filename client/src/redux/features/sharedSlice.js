import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
};

const sharedSlice = createSlice({
  name: "shared",
  initialState,
  reducers: {
    processingStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    processingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    processingSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    clearSharedState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
});

export default sharedSlice.reducer;
export const {
  processingStart,
  processingFailure,
  processingSuccess,
  clearSharedState,
} = sharedSlice.actions;
