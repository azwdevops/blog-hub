import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.user = action.payload;
    },
    updateUserSuccess: (state, action) => {
      state.user = action.payload;
    },
    deleteUserSuccess: (state) => {
      state.user = null;
    },
    signoutSuccess: (state) => {
      state.user = null;
    },
  },
});

export default authSlice.reducer;

export const {
  signInSuccess,
  updateUserSuccess,
  deleteUserSuccess,
  signoutSuccess,
} = authSlice.actions;
