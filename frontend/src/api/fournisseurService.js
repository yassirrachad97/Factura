import axiosInstance from './axiosInstance';
import { toast } from 'react-toastify';

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

  console.log('FormData envoyé:', Object.fromEntries(formData.entries()));

  return axiosInstance.post('/fournisseurs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    toast.success('Fournisseur créé avec succès!');
    return res.data;
  })
  .catch(error => {
    console.error('Erreur lors de la requête:', error);
    console.error('Réponse du serveur:', error.response?.data);
    toast.error('Erreur lors de la création du fournisseur');
    throw error;
  });
};

export const updateFournisseur = (id, formData) => {
  

  const token = localStorage.getItem("token");

  return axiosInstance.put(`/fournisseurs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => {
    toast.success('Fournisseur mis à jour avec succès!');
    return res.data;
  })
  .catch(error => {
    toast.error('Erreur lors de la mise à jour du fournisseur');
    throw error;
  });
};



export const deleteFournisseur = (id) => 
  axiosInstance.delete(`/fournisseurs/${id}`)
    .then(res => {
      toast.success('Fournisseur supprimé avec succès!');
      return res.data;
    })
    .catch(error => {
      toast.error('Erreur lors de la suppression du fournisseur');
      throw error;
    });