import { Suspense } from 'react';
import CheckoutClientPage from './client';
import { currentUser } from '@clerk/nextjs/server';
import Footer from '../components/Footer';

export default async function CheckoutPage() {
  const user = await currentUser();

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutClientPage user={JSON.parse(JSON.stringify(user))} />
      </Suspense>
      <Footer />
    </>
  );
}