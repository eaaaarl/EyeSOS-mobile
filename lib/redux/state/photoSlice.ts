import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PhotoState {
  photoUri: string | null;
}

const initialState: PhotoState = {
  photoUri: null,
};

const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    setPhotoUri: (state, action: PayloadAction<string>) => {
      state.photoUri = action.payload;
    },
    clearPhotoUri: (state) => {
      state.photoUri = null;
    },
  },
});

export const { setPhotoUri, clearPhotoUri } = photoSlice.actions;
export const photoReducer = photoSlice.reducer;
