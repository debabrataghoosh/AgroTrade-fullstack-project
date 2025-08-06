"use client";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function ChatButton({ 
  productId, 
  sellerEmail, 
  className = "border-2 border-green-400 text-green-700 px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-green-50 transition",
  icon = false
}: { 
  productId: string, 
  sellerEmail: string,
  className?: string,
  icon?: boolean
}) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  if (!isSignedIn || !user?.primaryEmailAddress) return null;
  const buyerEmail = user.primaryEmailAddress.emailAddress;
  const chatId = `${productId}--${buyerEmail}--${sellerEmail}`;
  return (
    <button
      className={className}
      onClick={() => router.push(`/chat?roomId=${encodeURIComponent(chatId)}`)}
    >
      {icon && (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )}
      Chat with Seller
    </button>
  );
} 