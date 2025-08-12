import { Suspense } from 'react';
import ProductsClientPage from './client';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsClientPage />
    </Suspense>
  );
}