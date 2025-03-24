import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPaymentStatus } from '../api/payementService';
import { downloadPDF } from '../api/factureService';
import { toast } from 'react-toastify';
import riadLogo from "../assets/riad-logo.png";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

 
  const paymentIntentId = searchParams.get('payment_intent');
  
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!paymentIntentId) {
        setError('Aucune information de paiement trouvée.');
        setIsLoading(false);
        return;
      }

      try {
        const result = await getPaymentStatus(paymentIntentId);
        setPaymentStatus(result.status);
        
      
        const timer = setTimeout(() => {
          navigate('/dashboard');
        }, 5000);
        
        return () => clearTimeout(timer);
      } catch (err) {
        console.error('Error checking payment status:', err);
        setError('Erreur lors de la vérification du statut du paiement.');
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [paymentIntentId, navigate]);

  const handleDownloadInvoice = async () => {
    if (!paymentIntentId) return;

    try {
    
      const result = await getPaymentStatus(paymentIntentId);
      if (result.factureId) {
       
        await downloadPDF({ id: result.factureId });
        toast.success('Facture téléchargée avec succès!');
      } else {
        toast.error('Impossible de trouver la facture');
      }
    } catch (err) {
      console.error('Error downloading invoice:', err);
      toast.error('Erreur lors du téléchargement de la facture');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Vérification du paiement...</h2>
          <p className="text-gray-600">Veuillez patienter pendant que nous confirmons votre paiement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-8">
          <img src={riadLogo} alt="RIAD Logo" className="h-16" />
        </div>

        {error ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-600">Erreur</h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
        ) : paymentStatus === 'succeeded' ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-green-600">Paiement réussi!</h2>
            <p className="text-gray-600 mb-6">
              Votre paiement a bien été effectué. Vous serez redirigé vers le tableau de bord dans quelques secondes.
            </p>
            <button
              onClick={handleDownloadInvoice}
              type="button"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Télécharger la facture
            </button>
          </div>
        ) : paymentStatus === 'processing' ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-4">
              <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-blue-600">Traitement en cours...</h2>
            <p className="text-gray-600 mb-6">
              Votre paiement est en cours de traitement. Nous vous tiendrons informé une fois le traitement terminé.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-yellow-600">Statut: {paymentStatus}</h2>
            <p className="text-gray-600 mb-6">
              Le statut de votre paiement est: {paymentStatus}. Veuillez contacter notre service client si vous avez des questions.
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            type="button"
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;