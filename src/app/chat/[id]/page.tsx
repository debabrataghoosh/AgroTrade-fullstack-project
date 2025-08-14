"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import io, { Socket } from "socket.io-client";
import React from "react";

let socket: Socket;

interface Message {
  roomId: string;
  sender: string;
  content: string;
  createdAt: string;
  buyer: string;
  seller: string;
}

interface Product {
  _id: string;
  title: string;
  image: string;
  price: number;
  seller?: { name: string; email: string; role: string };
}

function parseRoomId(roomId: string) {
  const [product, buyer, seller] = (roomId || '').split('--');
  return { product, buyer, seller };
}

export default function ChatPage() {
  const params = useParams();
  const id = params?.id as string; // id = chat room id (e.g., productId--buyerEmail--sellerEmail)
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Parse productId, sellerEmail from roomId
  const { product: productId, seller: sellerEmail } = parseRoomId(id);

  // Fetch product details
  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products?id=${productId}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(() => setProduct(null));
  }, [productId]);

  // Connect to socket and join room
  useEffect(() => {
    if (!id || !isSignedIn || !user || !user.primaryEmailAddress) return;
    if (!socket) {
      socket = io("https://agrotrade-socket-server.onrender.com");
    }
    socket.emit("join", id);
    // Also join notification room for this user
    socket.emit("join", user.primaryEmailAddress.emailAddress);
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    fetchMessages();
    return () => {
      socket.off("message");
    };
  }, [id, isSignedIn, user]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/messages?roomId=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
          console.log(`Loaded ${data.length} messages for room: ${id}`);
        } else {
          console.error('Invalid messages data:', data);
          setError("Invalid message data received.");
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to load messages:', res.status, errorData);
        setError(`Failed to load messages: ${res.status}`);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError("Failed to load messages. Please try again.");
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || !user?.primaryEmailAddress) return;
    setError("");
    const { buyer, seller } = parseRoomId(id);
    const msg: Message = {
      roomId: id,
      sender: user.primaryEmailAddress.emailAddress,
      content: input,
      createdAt: new Date().toISOString(),
      buyer,
      seller,
    };
    socket.emit("message", msg);
    setInput("");
    // Save to DB
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
      
      if (res.ok) {
        const savedMessage = await res.json();
        console.log('Message saved successfully:', savedMessage);
        // Add the saved message to local state if needed
        setMessages(prev => [...prev, savedMessage]);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to send message:', res.status, errorData);
        setError(`Failed to send message: ${errorData.error || res.status}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <button
        className="mb-4 text-green-700 hover:underline flex items-center gap-1"
        onClick={() => router.back()}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to chats
      </button>
      <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-0 flex flex-col min-h-[500px]">
        {/* Header with actual product and seller info */}
        <div className="p-4 border-b flex items-center gap-4 bg-white min-h-[80px] rounded-t-2xl">
          {product?.image && (
            <img src={product.image} className="w-12 h-12 rounded-full object-cover" alt={product.title} />
          )}
          <div>
            <div className="font-semibold">
              {product?.title || "Loading..."}
            </div>
            <div className="text-xs text-gray-500">
              Seller: {product?.seller?.name || sellerEmail || "-"}
            </div>
          </div>
          <div className="ml-auto text-lg font-bold">
            {product ? `₹ ${product.price}` : ""}
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {loading ? (
            <div className="text-gray-500">Loading messages...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : messages.length === 0 ? (
            <div className="text-gray-400">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`mb-2 flex ${msg.sender === user?.primaryEmailAddress?.emailAddress ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-xs ${msg.sender === user?.primaryEmailAddress?.emailAddress ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-700'}`}>
                  <div className="text-sm">{msg.content}</div>
                  <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input Area */}
        <div className="p-4 border-t bg-white rounded-b-2xl">
          <div className="mb-2 flex gap-2 flex-wrap">
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setInput("okay")}>okay</button>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setInput("no problem")}>no problem</button>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setInput("please reply")}>please reply</button>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setInput("not interested")}>not interested</button>
            <button className="px-3 py-1 bg-blue-200 rounded" onClick={() => setInput("make an offer")}>make an offer</button>
          </div>
          <form className="flex gap-2" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              placeholder="Type a message"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!isSignedIn}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit" disabled={!input.trim() || !isSignedIn}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}