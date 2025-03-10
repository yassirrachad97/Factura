import axiosInstance from './axiosInstance';

export const getAllFournisseurs = () => 
  axiosInstance.get('/fournisseurs').then(res => res.data);

export const getFournisseursByCategory = (categoryId) => 
  axiosInstance.get('/fournisseurs', {
    params: { categoryId }
  }).then(res => res.data);

export const getFournisseur = (id) => 
  axiosInstance.get(`/fournisseurs/${id}`).then(res => res.data);

export const createFournisseur = (formData) => {
  const token = localStorage.getItem('token');
  console.log('Token exists:', !!token);
  if (token) {
    console.log('Token value:', token.substring(0, 15) + '...');
    console.log(hasRole); 
  }
  
  return axiosInstance.post('/fournisseurs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.data);
};

export const updateFournisseur = (id, formData) => {
  const token = localStorage.getItem('token');
  return axiosInstance.put(`/fournisseurs/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.data);
};

export const deleteFournisseur = (id) => 
  axiosInstance.delete(`/fournisseurs/${id}`).then(res => res.data);