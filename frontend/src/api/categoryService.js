import axiosInstance from './axiosInstance';

export const getAllCategories = () => 
  axiosInstance.get('/categories').then(res => res.data);

export const getCategory = (identifier) => 
  axiosInstance.get(`/categories/${identifier}`).then(res => res.data);

export const createCategory = (data) => 
  axiosInstance.post('/categories', data).then(res => res.data);

export const updateCategory = (id, data) => 
  axiosInstance.put(`/categories/${id}`, data).then(res => res.data);

export const deleteCategory = (id) => 
  axiosInstance.delete(`/categories/${id}`).then(res => res.data);