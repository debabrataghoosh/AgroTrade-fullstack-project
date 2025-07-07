"use client";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function ChatButton({ productId, sellerEmail }: { productId: string, sellerEmail: string }) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  if (!isSignedIn) return null;
  const buyerEmail = user.primaryEmailAddress.emailAddress;
  const chatId = `${productId}--${buyerEmail}--${sellerEmail}`;
  return (
    <button
      className="border-2 border-green-400 text-green-700 px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-green-50 transition"
      onClick={() => router.push(`/chat?roomId=${encodeURIComponent(chatId)}`)}
    >
      Chat with Seller
    </button>
  );
} 