import { createSlice } from "@reduxjs/toolkit";

import { layoutPresets } from "@/preferences/enums";

export interface CustomReducerState {
  layoutPreset: layoutPresets;
}

const initialState: CustomReducerState = {
  layoutPreset: layoutPresets.lineLength,
};

const customReducer = createSlice({
  name: "custom",
  initialState,
  reducers: {
    setLayoutPreset: (state, action) => {
      state.layoutPreset = action.payload;
    },
  },
});

export const { 
  setLayoutPreset
 } = customReducer.actions;

 export default customReducer.reducer;