'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaShoppingCart, FaCreditCard, FaMoneyBillWave, FaMapMarkerAlt, FaUser, FaPhone, FaHome, FaCity, FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';

const CheckoutForm = ({ user, checkoutUrl, quantity, onQuantityChange, paymentMethod, onPaymentMethodChange, switchingPayment }: { 
  user: any, 
  checkoutUrl: string | null,
  quantity: number,
  onQuantityChange: (quantity: number) => void,
  paymentMethod: string,
  onPaymentMethodChange: (method: string) => void,
  switchingPayment: boolean
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper function to safely get search params
  const getSearchParam = (key: string, defaultValue: string = '') => {
    return searchParams?.get(key) || defaultValue;
  };

  const getPrimaryEmail = () => {
    if (!user) return null;
    const primaryEmail = user.emailAddresses.find((email: any) => email.id === user.primaryEmailAddressId);
    return primaryEmail ? primaryEmail.emailAddress : null;
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 100) {
      onQuantityChange(newQuantity);
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOnlinePayment = async () => {
    if (!checkoutUrl) {
      setErrorMessage('Checkout session not ready. Please wait a moment.');
      return;
    }

    // Redirect to Stripe checkout
    window.location.href = checkoutUrl;
  };

  const handleCashOnDelivery = async () => {
    try {
      const primaryEmail = getPrimaryEmail();
      if (!primaryEmail) {
        setErrorMessage("Primary email address not found.");
        return;
      }

      // Validate shipping address
      if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
        setErrorMessage("Please fill in all shipping address fields.");
        return;
      }

      const product = {
        productId: getSearchParam('productId'),
        title: getSearchParam('title'),
        image: getSearchParam('image'),
        price: parseFloat(getSearchParam('price', '0')),
        quantity: quantity,
        unit: getSearchParam('unit'),
        category: getSearchParam('category'),
        seller: getSearchParam('seller'),
      };

      const orderData = {
        userEmail: primaryEmail,
        items: [product],
        address: shippingAddress,
        status: 'Placed',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        totalAmount: product.price * product.quantity,
      };

      console.log('Creating COD order with data:', orderData);
      
      const response = await axios.post('/api/orders', orderData);
      console.log('Order created successfully:', response.data);
      
      router.push('/order-success?payment_method=cod');
    } catch (error: any) {
      console.error('COD order error:', error);
      
      if (error.response?.data?.error) {
        setErrorMessage(`Order failed: ${error.response.data.error}`);
      } else if (error.message) {
        setErrorMessage(`Order failed: ${error.message}`);
      } else {
        setErrorMessage('Failed to place order. Please try again.');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (paymentMethod === 'online') {
      await handleOnlinePayment();
    } else {
      await handleCashOnDelivery();
    }

    setLoading(false);
  };

  const basePrice = parseFloat(getSearchParam('price', '0'));
  const totalPrice = basePrice * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-900 mb-2">Checkout</h1>
          <p className="text-green-700 text-lg">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100">
              {/* Quantity Selection */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-3">
                  <FaShoppingCart className="text-green-600" />
                  Quantity Selection
                </h2>
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <img
                    src={getSearchParam('image', '/assets/file.svg')}
                    alt={getSearchParam('title', 'Product')}
                    className="w-16 h-16 object-contain rounded-lg border border-green-200 bg-white"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 text-lg">
                      {getSearchParam('title', 'Product')}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {getSearchParam('category', 'Category')}
                    </p>
                    <p className="text-green-700 font-medium">
                      ₹{basePrice} per {getSearchParam('unit', 'unit')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-full border-2 border-green-300 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-lg"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-green-900 text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 100}
                      className="w-10 h-10 rounded-full border-2 border-green-300 text-green-600 hover:bg-green-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-3">
                  <FaMapMarkerAlt className="text-green-600" />
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline mr-2 text-green-600" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline mr-2 text-green-600" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaHome className="inline mr-2 text-green-600" />
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900"
                      placeholder="Enter your street address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCity className="inline mr-2 text-green-600" />
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900"
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaGlobe className="inline mr-2 text-green-600" />
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900"
                      placeholder="Enter your state"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.pincode}
                      onChange={(e) => handleAddressChange('pincode', e.target.value)}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900"
                      placeholder="Enter pincode"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-3">
                  <FaCreditCard className="text-green-600" />
                  Payment Method
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                                          <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={() => onPaymentMethodChange('online')}
                        className="mr-3 text-green-600 focus:ring-green-500"
                      />
                    <div className="flex items-center gap-3">
                      <FaCreditCard className="text-green-600 text-xl" />
                      <div>
                        <div className="font-semibold text-green-900">Online Payment</div>
                        <div className="text-sm text-gray-600">Secure payment with Stripe</div>
                      </div>
                    </div>
                  </label>
                  
                                    <label className="flex items-center p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => onPaymentMethodChange('cod')}
                      className="mr-3 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex items-center gap-3">
                      <FaMoneyBillWave className="text-green-600 text-xl" />
                      <div>
                        <div className="font-semibold text-green-900">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Pay when you receive your order</div>
                        <div className="text-xs text-green-600 mt-1">
                          ✅ Available for all order amounts (Default)
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Online Payment Info */}
              {paymentMethod === 'online' && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3 text-blue-700">
                    <FaExternalLinkAlt className="text-blue-600" />
                    <div>
                      <div className="font-semibold">Online Payment</div>
                      <div className="text-sm">You'll be redirected to Stripe's secure payment page to complete your purchase.</div>
                      <div className="text-xs text-blue-600 mt-1">
                        💡 Minimum order amount for online payment: ₹50
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method Switching Info */}
              {switchingPayment && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3 text-yellow-700">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                    <div>
                      <div className="font-semibold">Setting up payment...</div>
                      <div className="text-sm">Please wait while we prepare your checkout session.</div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (paymentMethod === 'online' && !checkoutUrl)}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-3"
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : paymentMethod === 'online' ? (
                  <>
                    <FaCreditCard />
                    Proceed to Payment
                  </>
                ) : (
                  <>
                    <FaShoppingCart />
                    Place Order
                  </>
                )}
              </button>
              
              {errorMessage && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 sticky top-8">
              <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-3">
                <FaShoppingCart className="text-green-600" />
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <img
                    src={getSearchParam('image', '/assets/file.svg')}
                    alt={getSearchParam('title', 'Product')}
                    className="w-16 h-16 object-contain rounded-lg border border-green-200 bg-white"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 text-lg">
                      {getSearchParam('title', 'Product')}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {getSearchParam('category', 'Category')}
                    </p>
                    <p className="text-green-700 font-medium">
                      Quantity: {quantity} {getSearchParam('unit', 'unit')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-green-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Price per {getSearchParam('unit', 'unit')}</span>
                  <span>₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
                <div className="border-t border-green-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-green-900">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Secure checkout powered by Stripe
                </div>
                {totalPrice >= 50 && (
                  <div className="flex items-center gap-2 text-green-600 text-xs mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    ✅ Minimum amount (₹50) met for online payment
                  </div>
                )}
                {totalPrice < 50 && (
                  <div className="flex items-center gap-2 text-orange-600 text-xs mt-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    ⚠️ Add ₹{50 - totalPrice} more for online payment
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutClient = ({ user }: { user: any }) => {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [switchingPayment, setSwitchingPayment] = useState(false);
  const searchParams = useSearchParams();

  const createCheckoutSession = async (selectedQuantity: number = 1) => {
    console.log('createCheckoutSession called with:', { selectedQuantity, paymentMethod });
    
    // Prevent Stripe session creation if COD is selected
    if (paymentMethod === 'cod') {
      console.log('COD selected, skipping Stripe session creation');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const primaryEmail = user.emailAddresses.find((email: any) => email.id === user.primaryEmailAddressId)?.emailAddress;
      if (!primaryEmail) {
        setError("Primary email address not found.");
        return;
      }

      const product = {
        title: searchParams?.get('title'),
        price: parseFloat(searchParams?.get('price') || '0'),
        image: searchParams?.get('image'),
        _id: searchParams?.get('productId'),
        unit: searchParams?.get('unit'),
        category: searchParams?.get('category'),
        sellerEmail: searchParams?.get('seller'),
      };

      console.log('Creating checkout session with:', { product, customerEmail: primaryEmail, quantity: selectedQuantity });
      console.log('Product price from URL:', searchParams?.get('price'));
      console.log('Parsed price:', parseFloat(searchParams?.get('price') || '0'));
      console.log('Selected quantity:', selectedQuantity);
      console.log('Expected total:', parseFloat(searchParams?.get('price') || '0') * selectedQuantity);

      const res = await axios.post('/api/create-checkout-session', {
        product,
        customerEmail: primaryEmail,
        quantity: selectedQuantity,
      });

      console.log('Checkout session response:', res.data);

      if (res.data.url) {
        setCheckoutUrl(res.data.url);
      } else {
        setError('Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      
      // Handle specific error cases
      if (error.response?.data?.code === 'AMOUNT_TOO_LOW') {
        const { minimumAmount, currentAmount } = error.response.data;
        const basePrice = parseFloat(searchParams?.get('price') || '0');
        const unitsNeeded = Math.ceil((minimumAmount - currentAmount) / basePrice);
        
        console.log('AMOUNT_TOO_LOW error details:', {
          minimumAmount,
          currentAmount,
          basePrice,
          quantity: selectedQuantity,
          calculatedTotal: basePrice * selectedQuantity,
          unitsNeeded
        });
        
        setError(`Minimum order amount is ₹${minimumAmount}. Your order total is ₹${currentAmount}. Add ${unitsNeeded} more ${searchParams?.get('unit') || 'unit'} to proceed with online payment, or choose Cash on Delivery.`);
      } else if (error.response?.data?.error) {
        console.log('Generic error response:', error.response.data);
        setError(error.response.data.error);
      } else {
        console.log('Unknown error:', error);
        setError('Failed to create checkout session. Please try again.');
      }
    } finally {
      setLoading(false);
      setSwitchingPayment(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Don't create Stripe session on initial load
      // Let user choose payment method first
      setLoading(false);
    }
  }, [user, searchParams]); // Only run once when user loads

  // Separate effect for payment method changes
  useEffect(() => {
    console.log('Payment method changed:', { paymentMethod, user: !!user, quantity });
    
    if (user && paymentMethod === 'online') {
      console.log('Creating Stripe session for online payment...');
      setSwitchingPayment(true);
      createCheckoutSession(quantity);
    } else if (paymentMethod === 'cod') {
      console.log('Switching to COD, clearing Stripe session...');
      setSwitchingPayment(false);
      setCheckoutUrl(null);
      setError(null);
    }
  }, [paymentMethod, quantity]); // Only run when payment method or quantity changes

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 100) {
      setQuantity(newQuantity);
      // Recreate checkout session with new quantity only if online payment is selected
      if (paymentMethod === 'online') {
        createCheckoutSession(newQuantity);
      }
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    // The useEffect will handle the session creation/clearing automatically
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-700 text-lg">Setting up checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">Checkout Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <CheckoutForm 
    user={user} 
    checkoutUrl={checkoutUrl} 
    quantity={quantity}
    onQuantityChange={handleQuantityChange}
    paymentMethod={paymentMethod}
    onPaymentMethodChange={handlePaymentMethodChange}
    switchingPayment={switchingPayment}
  />;
};

export default CheckoutClient;
