import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  userDetails: null,
  message: null,
  toastMsg: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.userDetails = action.payload;
      localStorage.setItem('jwtToken', action.payload.token);
    },
    setLogout: (state) => {
      state.userDetails = null;
      localStorage.removeItem('jwtToken');
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setToastMsg: (state, action) => {
      state.toastMsg = action.payload;
    },
  },
});

export const { setLogin, setLogout, setMessage, setToastMsg } = authSlice.actions;
export default authSlice.reducer;
