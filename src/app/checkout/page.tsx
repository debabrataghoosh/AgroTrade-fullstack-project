
import { Suspense } from 'react';
import CheckoutClientPage from './client';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutClientPage />
    </Suspense>
  );
}
