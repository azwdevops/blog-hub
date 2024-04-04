import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    createPostSuccess: (state, action) => {
      state.posts = [...state.posts, action.payload];
    },
  },
});

export default postSlice.reducer;

export const { createPostSuccess } = postSlice.actions;
