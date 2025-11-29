import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  paymongoAPI,
  createPaymentMethod,
  attachPaymentMethod,
  getPaymentIntentClient,
  PAYMENT_METHODS,
  buildCardPaymentMethod,
  buildEWalletPaymentMethod,
} from '../../api/paymongoAPI';
import { formatCurrency } from '../../utils/formatters';
import './PayMongoPayment.css';

const PayMongoPayment = ({ 
  bookingId, 
  amount, 
  schedule, 
  selectedSeats, 
  onSuccess, 
  onCancel 
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState('select'); // select | card | processing | redirect | success | error
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Card form state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  });
  
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Check for return from 3DS authentication
  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent_id');
    if (paymentIntentId) {
      handlePaymentReturn(paymentIntentId);
    }
  }, [searchParams]);

  // Handle return from 3DS/redirect
  const handlePaymentReturn = async (paymentIntentId) => {
    setStep('processing');
    setLoading(true);
    
    try {
      const response = await paymongoAPI.verifyPayment(paymentIntentId);
      
      if (response.data.success) {
        setStep('success');
        onSuccess?.({
          bookingId: response.data.bookingId,
          qrCode: response.data.qrCodeText,
          referenceCode: paymentIntentId,
        });
      } else {
        setError(response.data.error || 'Payment verification failed');
        setStep('error');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify payment');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Create Payment Intent
  const initializePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const description = `BusMate Booking - ${schedule.route?.origin} to ${schedule.route?.destination}`;
      const response = await paymongoAPI.createPaymentIntent(bookingId, description);
      setPaymentIntent(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initialize payment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle e-wallet payment (GCash, GrabPay, PayMaya)
  const handleEWalletPayment = async (type) => {
    setLoading(true);
    setError('');
    setPaymentMethod(type);
    
    try {
      // Create payment intent if not exists
      let intent = paymentIntent;
      if (!intent) {
        intent = await initializePayment();
      }

      // Create payment method for e-wallet
      const pmResponse = await createPaymentMethod(
        intent.publicKey,
        buildEWalletPaymentMethod(type, {
          name: billingDetails.name || 'BusMate Customer',
          email: billingDetails.email || 'customer@busmate.com',
          phone: billingDetails.phone || '09000000000',
        })
      );

      const paymentMethodId = pmResponse.data.id;

      // Attach payment method to intent
      const returnUrl = `${window.location.origin}/booking?payment_intent_id=${intent.id}`;
      const attachResponse = await attachPaymentMethod(
        intent.publicKey,
        intent.id,
        intent.clientKey,
        paymentMethodId,
        returnUrl
      );

      const status = attachResponse.data.attributes.status;
      const nextAction = attachResponse.data.attributes.next_action;

      if (status === 'awaiting_next_action' && nextAction?.redirect?.url) {
        // Redirect user to e-wallet app/page
        setStep('redirect');
        window.location.href = nextAction.redirect.url;
      } else if (status === 'succeeded') {
        // Payment completed without redirect
        await handlePaymentReturn(intent.id);
      } else {
        setError('Payment could not be processed. Please try again.');
        setStep('error');
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  // Handle card payment
  const handleCardPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPaymentMethod(PAYMENT_METHODS.CARD);
    setStep('processing');

    try {
      // Create payment intent if not exists
      let intent = paymentIntent;
      if (!intent) {
        intent = await initializePayment();
      }

      // Create payment method for card
      const pmResponse = await createPaymentMethod(
        intent.publicKey,
        buildCardPaymentMethod(cardDetails, {
          name: billingDetails.name,
          email: billingDetails.email,
          phone: billingDetails.phone,
        })
      );

      const paymentMethodId = pmResponse.data.id;

      // Attach payment method to intent
      const returnUrl = `${window.location.origin}/booking?payment_intent_id=${intent.id}`;
      const attachResponse = await attachPaymentMethod(
        intent.publicKey,
        intent.id,
        intent.clientKey,
        paymentMethodId,
        returnUrl
      );

      const status = attachResponse.data.attributes.status;
      const nextAction = attachResponse.data.attributes.next_action;

      if (status === 'awaiting_next_action' && nextAction?.redirect?.url) {
        // 3D Secure authentication required
        setStep('redirect');
        window.location.href = nextAction.redirect.url;
      } else if (status === 'succeeded') {
        // Payment completed without 3DS
        await handlePaymentReturn(intent.id);
      } else if (status === 'processing') {
        // Poll for status
        pollPaymentStatus(intent);
      } else {
        setError('Payment could not be processed. Please try again.');
        setStep('error');
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  // Poll payment status
  const pollPaymentStatus = async (intent, attempts = 0) => {
    if (attempts >= 10) {
      setError('Payment verification timed out. Please check your bookings.');
      setStep('error');
      return;
    }

    try {
      const statusResponse = await getPaymentIntentClient(
        intent.publicKey,
        intent.id,
        intent.clientKey
      );

      const status = statusResponse.data.attributes.status;

      if (status === 'succeeded') {
        await handlePaymentReturn(intent.id);
      } else if (status === 'awaiting_payment_method' || status === 'processing') {
        // Wait and poll again
        setTimeout(() => pollPaymentStatus(intent, attempts + 1), 3000);
      } else {
        setError('Payment failed. Please try again.');
        setStep('error');
      }
    } catch (err) {
      setError('Failed to verify payment status');
      setStep('error');
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  // Render payment method selection
  const renderMethodSelection = () => (
    <div className="payment-methods">
      <h3>Select Payment Method</h3>
      
      <div className="method-grid">
        <button
          type="button"
          className="method-card"
          onClick={() => setStep('card')}
          disabled={loading}
        >
          <span className="method-icon">💳</span>
          <span className="method-name">Credit/Debit Card</span>
          <span className="method-desc">Visa, Mastercard</span>
        </button>

        <button
          type="button"
          className="method-card gcash"
          onClick={() => handleEWalletPayment(PAYMENT_METHODS.GCASH)}
          disabled={loading}
        >
          <span className="method-icon">📱</span>
          <span className="method-name">GCash</span>
          <span className="method-desc">Pay with GCash</span>
        </button>

        <button
          type="button"
          className="method-card grabpay"
          onClick={() => handleEWalletPayment(PAYMENT_METHODS.GRAB_PAY)}
          disabled={loading}
        >
          <span className="method-icon">🚗</span>
          <span className="method-name">GrabPay</span>
          <span className="method-desc">Pay with GrabPay</span>
        </button>

        <button
          type="button"
          className="method-card paymaya"
          onClick={() => handleEWalletPayment(PAYMENT_METHODS.PAYMAYA)}
          disabled={loading}
        >
          <span className="method-icon">💚</span>
          <span className="method-name">Maya</span>
          <span className="method-desc">Pay with Maya</span>
        </button>
      </div>
    </div>
  );

  // Render card form
  const renderCardForm = () => (
    <form className="card-form" onSubmit={handleCardPayment}>
      <button
        type="button"
        className="back-button"
        onClick={() => setStep('select')}
      >
        ← Back to payment methods
      </button>

      <h3>Card Payment</h3>

      <div className="form-section">
        <h4>Billing Information</h4>
        <div className="form-row">
          <label>
            Full Name
            <input
              type="text"
              value={billingDetails.name}
              onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
              placeholder="Juan Dela Cruz"
              required
            />
          </label>
        </div>
        <div className="form-row two-col">
          <label>
            Email
            <input
              type="email"
              value={billingDetails.email}
              onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
              placeholder="juan@email.com"
              required
            />
          </label>
          <label>
            Phone
            <input
              type="tel"
              value={billingDetails.phone}
              onChange={(e) => setBillingDetails({ ...billingDetails, phone: e.target.value })}
              placeholder="09123456789"
              required
            />
          </label>
        </div>
      </div>

      <div className="form-section">
        <h4>Card Details</h4>
        <div className="form-row">
          <label>
            Card Number
            <input
              type="text"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({ 
                ...cardDetails, 
                cardNumber: formatCardNumber(e.target.value)
              })}
              placeholder="4343 4343 4343 4345"
              maxLength="19"
              required
            />
          </label>
        </div>
        <div className="form-row three-col">
          <label>
            Month
            <input
              type="text"
              value={cardDetails.expMonth}
              onChange={(e) => setCardDetails({ 
                ...cardDetails, 
                expMonth: e.target.value.replace(/\D/g, '').slice(0, 2)
              })}
              placeholder="12"
              maxLength="2"
              required
            />
          </label>
          <label>
            Year
            <input
              type="text"
              value={cardDetails.expYear}
              onChange={(e) => setCardDetails({ 
                ...cardDetails, 
                expYear: e.target.value.replace(/\D/g, '').slice(0, 2)
              })}
              placeholder="25"
              maxLength="2"
              required
            />
          </label>
          <label>
            CVC
            <input
              type="text"
              value={cardDetails.cvc}
              onChange={(e) => setCardDetails({ 
                ...cardDetails, 
                cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
              })}
              placeholder="123"
              maxLength="4"
              required
            />
          </label>
        </div>
      </div>

      <div className="test-cards-note">
        <p><strong>Test Cards (for development):</strong></p>
        <ul>
          <li>Success: 4343 4343 4343 4345</li>
          <li>3DS Required: 4571 7360 0000 0000</li>
          <li>Exp: Any future date | CVC: Any 3 digits</li>
        </ul>
      </div>

      <button type="submit" className="pay-button" disabled={loading}>
        {loading ? 'Processing...' : `Pay ${formatCurrency(amount, { withCents: true })}`}
      </button>
    </form>
  );

  // Render processing state
  const renderProcessing = () => (
    <div className="processing-state">
      <div className="spinner"></div>
      <h3>Processing your payment...</h3>
      <p>Please do not close this window.</p>
    </div>
  );

  // Render redirect state
  const renderRedirect = () => (
    <div className="redirect-state">
      <div className="spinner"></div>
      <h3>Redirecting to payment...</h3>
      <p>You will be redirected to complete your payment.</p>
      <p className="redirect-note">If you are not redirected automatically, please wait a moment.</p>
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className="error-state">
      <div className="error-icon">❌</div>
      <h3>Payment Failed</h3>
      <p>{error}</p>
      <div className="error-actions">
        <button onClick={() => { setError(''); setStep('select'); }}>
          Try Again
        </button>
        <button onClick={onCancel} className="secondary">
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="paymongo-payment">
      <div className="payment-header">
        <h2>Complete Payment</h2>
        <div className="amount-display">
          <span>Total Amount</span>
          <strong>{formatCurrency(amount, { withCents: true })}</strong>
        </div>
      </div>

      <div className="payment-summary">
        <div className="summary-item">
          <span>Route</span>
          <strong>{schedule.route?.origin} → {schedule.route?.destination}</strong>
        </div>
        <div className="summary-item">
          <span>Seats</span>
          <strong>{selectedSeats.join(', ')}</strong>
        </div>
      </div>

      {error && step !== 'error' && (
        <div className="error-banner">{error}</div>
      )}

      <div className="payment-content">
        {step === 'select' && renderMethodSelection()}
        {step === 'card' && renderCardForm()}
        {step === 'processing' && renderProcessing()}
        {step === 'redirect' && renderRedirect()}
        {step === 'error' && renderError()}
      </div>

      {(step === 'select' || step === 'card') && (
        <div className="payment-footer">
          <button onClick={onCancel} className="cancel-button" disabled={loading}>
            Cancel
          </button>
          <div className="secure-badge">
            🔒 Secured by PayMongo
          </div>
        </div>
      )}
    </div>
  );
};

export default PayMongoPayment;