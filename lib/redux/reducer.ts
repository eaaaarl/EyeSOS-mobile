import { alertApi } from "@/feature/alert/api/alertApi";
import { authApi } from "@/feature/auth/api/authApi";
import { homeApi } from "@/feature/home/api/homeApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";
import { locationReducer } from "./state/locationSlice";
import { photoReducer } from "./state/photoSlice";

const rootReducer = combineReducers({
  // Redux State
  auth: authReducer,
  location: locationReducer,
  photo: photoReducer,

  // RTK Query
  [authApi.reducerPath]: authApi.reducer,
  [homeApi.reducerPath]: homeApi.reducer,
  [alertApi.reducerPath]: alertApi.reducer
});

export const apis = [authApi, homeApi,alertApi];

export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
