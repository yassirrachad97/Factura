import axiosInstance from './axiosInstance';

export const getAllCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get('/categories', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

export const createCategory = (data) => 
  axiosInstance.post('/categories', data).then(res => res.data);

export const updateCategory = (id, data) => 
  axiosInstance.put(`/categories/${id}`, data).then(res => res.data);

export const deleteCategory = (id) => 
  axiosInstance.delete(`/categories/${id}`).then(res => res.data);