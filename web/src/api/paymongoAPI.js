import api from './axios';

// PayMongo API endpoints (through our backend)
export const paymongoAPI = {
  // Create a payment intent for a booking
  createPaymentIntent: (bookingId, description) => 
    api.post('/paymongo/create-intent', { bookingId, description }),
  
  // Get payment intent status
  getPaymentStatus: (paymentIntentId) => 
    api.get(`/paymongo/intent/${paymentIntentId}/status`),
  
  // Verify payment after redirect
  verifyPayment: (paymentIntentId) => 
    api.post(`/paymongo/verify-payment/${paymentIntentId}`),
};

// PayMongo Direct API (for client-side operations using public key)
const PAYMONGO_API_URL = 'https://api.paymongo.com/v1';

/**
 * Create a Payment Method directly with PayMongo
 * This collects card/e-wallet details and creates a payment method
 */
export const createPaymentMethod = async (publicKey, paymentMethodData) => {
  const encodedKey = btoa(`${publicKey}:`);
  
  const response = await fetch(`${PAYMONGO_API_URL}/payment_methods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedKey}`,
    },
    body: JSON.stringify({
      data: {
        attributes: paymentMethodData,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.detail || 'Failed to create payment method');
  }

  return response.json();
};

/**
 * Attach a Payment Method to a Payment Intent
 * This initiates the actual payment
 */
export const attachPaymentMethod = async (publicKey, paymentIntentId, clientKey, paymentMethodId, returnUrl) => {
  const encodedKey = btoa(`${publicKey}:`);
  
  const response = await fetch(`${PAYMONGO_API_URL}/payment_intents/${paymentIntentId}/attach`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedKey}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          payment_method: paymentMethodId,
          client_key: clientKey,
          return_url: returnUrl,
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.detail || 'Failed to attach payment method');
  }

  return response.json();
};

/**
 * Retrieve Payment Intent status from client side
 */
export const getPaymentIntentClient = async (publicKey, paymentIntentId, clientKey) => {
  const encodedKey = btoa(`${publicKey}:`);
  
  const response = await fetch(
    `${PAYMONGO_API_URL}/payment_intents/${paymentIntentId}?client_key=${clientKey}`,
    {
      headers: {
        'Authorization': `Basic ${encodedKey}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.detail || 'Failed to retrieve payment intent');
  }

  return response.json();
};

// Payment method types supported
export const PAYMENT_METHODS = {
  CARD: 'card',
  GCASH: 'gcash',
  GRAB_PAY: 'grab_pay',
  PAYMAYA: 'paymaya',
};

// Helper to build card payment method attributes
export const buildCardPaymentMethod = (cardDetails, billingDetails) => ({
  type: 'card',
  details: {
    card_number: cardDetails.cardNumber.replace(/\s/g, ''),
    exp_month: parseInt(cardDetails.expMonth),
    exp_year: parseInt(cardDetails.expYear),
    cvc: cardDetails.cvc,
  },
  billing: billingDetails,
});

// Helper to build e-wallet payment method attributes
export const buildEWalletPaymentMethod = (type, billingDetails) => ({
  type,
  billing: billingDetails,
});

export default paymongoAPI;