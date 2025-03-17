import axiosInstance from './axiosInstance';
export const calculateStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      return await response.json();
    } catch (error) {
      console.error("Error calculating statistics:", error);
      throw error;
    }
  };