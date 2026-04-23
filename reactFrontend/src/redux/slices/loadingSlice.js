import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardLoading: false,
  alumniLoading: false,
  meetLoading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setDashboardLoading: (state, action) => {
      state.dashboardLoading = action.payload;
    },
    setAlumniLoading: (state, action) => {
      state.alumniLoading = action.payload;
    },
    setMeetLoading: (state, action) => {
      state.meetLoading = action.payload;
    },
  },
});

export const {
  setDashboardLoading,
  setAlumniLoading,
  setMeetLoading,
} = loadingSlice.actions;
export default loadingSlice.reducer;
