import axiosInstance from './axiosInstance';

export const getAllCategories = () => 
  axiosInstance.get('/categories').then(res => res.data);

export const getCategory = async (identifier) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get(`/categories/${identifier}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCategory = (categoryData) => 
  axiosInstance.post('/categories', categoryData).then(res => res.data);

export const updateCategory = (id, categoryData) => 
  axiosInstance.put(`/categories/${id}`, categoryData).then(res => res.data);

export const deleteCategory = (id) => 
  axiosInstance.delete(`/categories/${id}`).then(res => res.data);