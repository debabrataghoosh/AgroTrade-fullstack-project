import { Suspense } from 'react';
import ChatClientPage from './client';

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatClientPage />
    </Suspense>
  );
}