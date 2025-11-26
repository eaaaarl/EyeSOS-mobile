import { authApi } from "@/feature/auth/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";
import { locationReducer } from "./state/locationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  location: locationReducer,

  [authApi.reducerPath]: authApi.reducer,
});

export const apis = [authApi];

export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
