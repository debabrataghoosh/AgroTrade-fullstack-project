"use client";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaHome, FaShoppingBag, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';
import { Suspense, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const sessionId = searchParams?.get('session_id');
  const paymentMethod = searchParams?.get('payment_method');
  const [orderStatus, setOrderStatus] = useState<'checking' | 'exists' | 'created' | 'failed'>('checking');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId && user) {
      checkAndCreateOrder();
    }
  }, [sessionId, user]);

  const checkAndCreateOrder = async () => {
    try {
      // First, check if order already exists
      const primaryEmail = user?.emailAddresses.find((email: any) => email.id === user.primaryEmailAddressId)?.emailAddress;
      
      if (!primaryEmail) {
        setOrderStatus('failed');
        return;
      }

      // Check if order exists
      const existingOrders = await axios.get(`/api/orders?userEmail=${encodeURIComponent(primaryEmail)}`);
      
      // Look for order with this session ID
      const existingOrder = existingOrders.data.find((order: any) => order.stripeSessionId === sessionId);
      
      if (existingOrder) {
        setOrderStatus('exists');
        setOrderId(existingOrder._id);
        return;
      }

      // If order doesn't exist, try to create it from session data
      // This is a backup in case webhook failed
      try {
        const orderData = {
          userEmail: primaryEmail,
          items: [
            {
              productId: searchParams?.get('productId') || '',
              title: searchParams?.get('title') || 'Product',
              image: searchParams?.get('image') || '',
              price: parseFloat(searchParams?.get('price') || '0'),
              quantity: parseInt(searchParams?.get('quantity') || '1'),
              unit: searchParams?.get('unit') || 'kg',
              category: searchParams?.get('category') || '',
              seller: searchParams?.get('seller') || '',
            }
          ],
          address: {
            name: 'Address will be collected later',
            phone: 'Phone will be collected later',
            address: 'Address will be collected later',
            city: 'City will be collected later',
            state: 'State will be collected later',
            pincode: 'Pincode will be collected later',
          },
          status: 'Placed',
          stripeSessionId: sessionId,
          paymentMethod: 'online',
          paymentStatus: 'paid',
          totalAmount: parseFloat(searchParams?.get('price') || '0') * parseInt(searchParams?.get('quantity') || '1'),
        };

        const response = await axios.post('/api/orders', orderData);
        setOrderStatus('created');
        setOrderId(response.data._id);
        
        console.log('Backup order created:', response.data);
      } catch (createError) {
        console.error('Failed to create backup order:', createError);
        setOrderStatus('failed');
      }
    } catch (error) {
      console.error('Error checking order status:', error);
      setOrderStatus('failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <FaCheckCircle className="text-6xl text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Payment Successful!
        </h1>
        
        {paymentMethod === 'cod' ? (
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully! You will pay on delivery.
          </p>
        ) : (
          <p className="text-gray-600 mb-6">
            Thank you for your purchase! Your payment has been processed successfully.
          </p>
        )}

        {/* Order Status */}
        {orderStatus === 'checking' && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-blue-700">Verifying your order...</p>
          </div>
        )}

        {orderStatus === 'exists' && (
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-700">✅ Order confirmed in our system</p>
            <p className="text-xs text-green-600 mt-1">Order ID: {orderId}</p>
          </div>
        )}

        {orderStatus === 'created' && (
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-700">✅ Order created successfully</p>
            <p className="text-xs text-green-600 mt-1">Order ID: {orderId}</p>
          </div>
        )}

        {orderStatus === 'failed' && (
          <div className="bg-yellow-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 justify-center text-yellow-700 mb-2">
              <FaExclamationTriangle />
              <span className="text-sm font-semibold">Order Status Unknown</span>
            </div>
            <p className="text-xs text-yellow-600">
              Your payment was successful, but we couldn't verify the order. 
              Please contact support with your session ID: {sessionId}
            </p>
          </div>
        )}

        {/* Order Details */}
        {sessionId && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-2">Payment Reference</p>
            <p className="font-mono text-sm text-gray-700 break-all">
              {sessionId}
            </p>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• You'll receive an email confirmation shortly</li>
            <li>• The seller will contact you for delivery details</li>
            <li>• Track your order in your dashboard</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <FaHome />
            Continue Shopping
          </Link>
          
          <Link
            href="/orders"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <FaShoppingBag />
            View Orders
          </Link>
          
          <Link
            href="/chat"
            className="w-full bg-blue-100 text-blue-700 py-3 px-6 rounded-xl font-semibold hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
          >
            <FaEnvelope />
            Chat with Seller
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team or chat with your seller directly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
