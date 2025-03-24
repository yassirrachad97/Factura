import React, { useState, useEffect } from 'react';
import { createPaymentIntent } from '../../api/payementService';
import StripeProvider from './StripeProvider';
import StripeCheckoutForm from './StripeCheckoutForm';

const PaymentModal = ({ isOpen, onClose, factureId, factureAmount, onPaymentSuccess }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
 
  const [stripeKey, setStripeKey] = useState(1);

  useEffect(() => {
   
    if (!isOpen) {
      setClientSecret('');
      setPaymentIntentId('');
      setError('');
      return;
    }
    
  
    if (!factureId) {
      setError('ID de facture manquant');
      setIsLoading(false);
      return;
    }


    const fetchPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const result = await createPaymentIntent(factureId);
        
       
        setStripeKey(prevKey => prevKey + 1);
        
        setClientSecret(result.clientSecret);
        setPaymentIntentId(result.paymentIntentId);
        setError('');
      } catch (err) {
        console.error('Failed to create payment intent:', err);
        setError('Erreur lors de la préparation du paiement: ' + (err.message || 'Veuillez réessayer plus tard'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [isOpen, factureId]);

  const handlePaymentSuccess = (result) => {
  
    console.log('Payment successful:', result);
    onPaymentSuccess && onPaymentSuccess(result);
    
 
    setTimeout(() => onClose(), 2000);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Paiement par carte bancaire</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {factureAmount && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <p className="text-gray-700">Montant à payer:</p>
              <p className="text-2xl font-bold text-blue-600">{factureAmount} MAD</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Préparation du paiement...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              <p className="font-bold">Erreur</p>
              <p>{error}</p>
              <button 
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                type="button"
              >
                Fermer
              </button>
            </div>
          ) : clientSecret ? (
            <div key={stripeKey}>
              <StripeProvider options={{ clientSecret }}>
                <StripeCheckoutForm 
                  clientSecret={clientSecret}
                  paymentIntentId={paymentIntentId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </StripeProvider>
            </div>
          ) : (
            <div className="text-center py-4">
              <p>Une erreur s'est produite lors de l'initialisation du paiement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;