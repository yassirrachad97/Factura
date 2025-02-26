import axiosInstance from './axiosInstance';

export const login = (credentials) => axiosInstance.post('/auth/login', credentials).then(res => res.data);
export const register = (data) => axiosInstance.post('/users/register', data).then(res => res.data);
