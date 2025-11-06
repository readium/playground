import { createSlice } from "@reduxjs/toolkit";

import { layoutPresets, readerPreferencesContainerKeys } from "@/preferences/enums";

export interface CustomReducerState {
  layoutPreset: layoutPresets;
  readerPreferencesContainerKey: readerPreferencesContainerKeys;
}

const initialState: CustomReducerState = {
  layoutPreset: layoutPresets.lineLength,
  readerPreferencesContainerKey: readerPreferencesContainerKeys.initial,
};

const customReducer = createSlice({
  name: "custom",
  initialState,
  reducers: {
    setLayoutPreset: (state, action) => {
      state.layoutPreset = action.payload;
    },
    setReaderPreferencesContainerKey: (state, action) => {
      state.readerPreferencesContainerKey = action.payload;
    },
  },
});

export const { 
  setLayoutPreset,
  setReaderPreferencesContainerKey
 } = customReducer.actions;

 export default customReducer.reducer;