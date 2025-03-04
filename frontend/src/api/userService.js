import axiosInstance from './axiosInstance';

export const login = (credentials) => axiosInstance.post('/auth/login', credentials).then(res => res.data);
export const register = (data) => axiosInstance.post('/users/register', data).then(res => res.data);
export const verifyOtp = (email, otp) => axiosInstance.post('/users/verify-otp', {email, otp}).then(res => res.data);
export const resendOtp = (email) => axiosInstance.post('/users/resendOtp', { email }).then((res) => res.data);
export const ChangePassword = (email) => axiosInstance.post('/users/ChangePassword', {email}).then(res => res.data);
export const resetPassword = (data) => axiosInstance.post('/users/ResetPassword', data).then(res => res.data);