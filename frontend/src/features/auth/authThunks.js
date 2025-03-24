import { createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../../api/userService';

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    return await login(credentials);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Erreur de connexion');
  }
});
