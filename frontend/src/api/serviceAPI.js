
import { getCategory } from './categoryService';
import { getFournisseursByCategory } from './fournisseurService';


export const fetchServices = async (categoryId) => {
  try {
    const category = await getCategory(categoryId);
    const services = await getFournisseursByCategory(category._id);
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};