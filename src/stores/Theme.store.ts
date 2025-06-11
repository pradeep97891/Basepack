import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
  theme_value: any; // Adjust the type as per your requirement
} = {
  theme_value: "light",
};

const ThemeReducers = createSlice({
  name: 'ThemeReducer',
  initialState,
  reducers: {
    setTheme: (state, { payload }: PayloadAction<any>) => {
      state.theme_value = payload; // Update the theme_value directly
    },
  },
});

export const {
  reducer: ThemeReducer,
  actions: { setTheme },
} = ThemeReducers;