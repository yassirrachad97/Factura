import axiosInstance from './axiosInstance';

export const getAllFournisseurs = () => 
  axiosInstance.get('/fournisseurs').then(res => res.data);

export const getFournisseursByCategory = (categoryId) => 
  axiosInstance.get('/fournisseurs', {
    params: { categoryId }
  }).then(res => res.data);

export const getFournisseur = (id) => 
  axiosInstance.get(`/fournisseurs/${id}`).then(res => res.data);

export const createFournisseur = (data) => 
  axiosInstance.post('/fournisseurs', data).then(res => res.data);

export const updateFournisseur = (id, data) => 
  axiosInstance.put(`/fournisseurs/${id}`, data).then(res => res.data);

export const deleteFournisseur = (id) => 
  axiosInstance.delete(`/fournisseurs/${id}`).then(res => res.data);