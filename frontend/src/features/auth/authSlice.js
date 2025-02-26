import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from './authThunks';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.user = payload.user;
        state.token = payload.token;
        localStorage.setItem('token', payload.token);
      })
      .addCase(loginUser.rejected, (state, { error }) => {
        state.status = 'failed';
        state.error = error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
