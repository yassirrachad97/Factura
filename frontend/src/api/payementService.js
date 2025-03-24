import api from './axiosInstance';

export const createPaymentIntent = async (factureId) => {
  try {
    const response = await api.post('/paiement/create-payment-intent', { factureId });
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const confirmPayment = async (paymentIntentId) => {
  try {
    const response = await api.post('/paiement/confirm-payment', { paymentIntentId });
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

export const getPaymentStatus = async (paymentIntentId) => {
  try {
    const response = await api.get(`/paiement/payment-status/${paymentIntentId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};