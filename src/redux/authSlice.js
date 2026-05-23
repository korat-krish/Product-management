import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export const loginUser = (credentials) => (dispatch) => {
  // Simple mock authentication for testing
  if (credentials.email && credentials.password) {
    const user = { email: credentials.email, name: 'Admin User' };
    dispatch(loginSuccess(user));
    return true;
  }
  return false;
};

export const logoutUser = () => (dispatch) => {
  dispatch(logoutSuccess());
};

export default authSlice.reducer;
