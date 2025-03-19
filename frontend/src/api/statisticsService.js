import axiosInstance from './axiosInstance';

export const calculateStatistics = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in localStorage");
      throw new Error("Authentication token is missing");
    }
    
    const response = await axiosInstance.get('/statistics', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error calculating statistics:", error);
    throw error;
  }
};