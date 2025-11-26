import { authApi } from "@/feature/auth/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";
import { locationReducer } from "./state/locationSlice";
import { photoReducer } from "./state/photoSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  location: locationReducer,
  photo: photoReducer,

  [authApi.reducerPath]: authApi.reducer,
});

export const apis = [authApi];

export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
