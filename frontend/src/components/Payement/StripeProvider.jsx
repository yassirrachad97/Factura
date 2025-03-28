import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';


const stripePromise = loadStripe('pk_test_51R3NlfKTdNISrpi1k4RYTzJjAFKCv6DkIQmm94gANU3AqrTDW4Z299vKdRJdpJNM6j8mfrv7jBCIS2joT2DjWeFq00L5KtSdqP');

const StripeProvider = ({ children, options }) => {
  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
