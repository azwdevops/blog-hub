import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "@/redux/features/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
