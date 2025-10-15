import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
  id: string;
  email: string;
}

export const initialState: authState = {
  id: "",
  email: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: string; email: string }>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
    },

    clearUser: (state) => {
      state.email = "";
      state.id = "";
    },
  },
});

export const { clearUser, setUser } = authSlice.actions;

export const authReducer = authSlice.reducer;
