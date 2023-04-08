import { createSlice } from "@reduxjs/toolkit";

interface CommonState {
  showBuyMore: boolean;
}

// Define the initial state using that type
const initialState: CommonState = {
  showBuyMore: false,
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    showBuyMore: (state) => {
      state.showBuyMore = true;
    },
    hideBuyMore: (state) => {
      state.showBuyMore = false;
    },
  },
});

export const { showBuyMore, hideBuyMore } = commonSlice.actions;

export default commonSlice.reducer;
