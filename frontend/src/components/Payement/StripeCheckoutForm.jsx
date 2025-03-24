import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { confirmPayment } from '../../api/payementService';

const StripeCheckoutForm = ({ clientSecret, paymentIntentId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }

  




    const checkStatus = async () => {
      try {
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        
        if (!paymentIntent) {
          setMessage("Impossible de récupérer les informations de paiement.");
          return;
        }

        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Paiement réussi!");
            onSuccess && onSuccess(paymentIntent);
            break;
          case "processing":
            setMessage("Votre paiement est en cours de traitement.");
            break;
          case "requires_payment_method":
            setMessage("Veuillez fournir un moyen de paiement.");
            break;
          default:
            setMessage("Une erreur s'est produite.");
            break;
        }
      } catch (error) {
        console.error("Error retrieving payment intent:", error);
        setMessage("Erreur lors de la vérification du statut de paiement.");
      }
    };

    checkStatus();
  }, [stripe, clientSecret, onSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
     
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {

      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/payment-success",
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setMessage(stripeError.message || "Une erreur s'est produite lors du paiement.");
        onError && onError(stripeError);
      } else {
        
        try {
          const result = await confirmPayment(paymentIntentId);
          if (result.success) {
            setMessage('Paiement réussi!');
            onSuccess && onSuccess(result);
          } else {
            setMessage(`Le paiement est ${result.status || 'en cours de traitement'}`);
          }
        } catch (backendError) {
          console.error("Backend error:", backendError);
          setMessage("Erreur lors de la confirmation du paiement.");
          onError && onError(backendError);
        }
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setMessage("Une erreur inattendue s'est produite.");
      onError && onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{}} />

      {message && (
        <div className={`mt-4 p-4 rounded-md ${message.includes('réussi') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        type="submit"
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin mr-2"></div>
            <span>Traitement en cours...</span>
          </div>
        ) : (
          <span>Payer maintenant</span>
        )}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;