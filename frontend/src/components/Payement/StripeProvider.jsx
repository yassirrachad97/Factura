import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
// This key will be exposed to the browser, which is okay for the publishable key
const stripePromise = loadStripe('pk_test_51R3NlfKTdNISrpi1oDTTVHvzTgZLyLmmKgHAuPc6QIQtX0exuAU1Gg0cLcPmCt5FwQHAhUXkVmjYS5hNxklXzM2h00WD723BL5');

const StripeProvider = ({ children, options }) => {
  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
