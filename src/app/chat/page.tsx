"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import ChatLayout from "../components/ChatLayout";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/app/components/SocketProvider";
import ChatSidebar from "../components/ChatSidebar";

function parseRoomId(roomId) {
  const [product, buyer, seller] = (roomId || '').split('--');
  return { product, buyer, seller };
}

// Mock data for demo
const mockChats = [
  {
    roomId: "6866d0bc941ddb9ed76ac415--testbuyer@example.com--agrotrade804@gmail.com",
    productTitle: "Apple",
    productImage: "/uploads/1751568540482-10998932.png",
    sellerEmail: "agrotrade804@gmail.com",
    lastMessage: "Hi, I'm interested in your Apple. Is it still available?",
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    roomId: "6866d22e941ddb9ed76ac422--anotherbuyer@example.com--agrotrade804@gmail.com",
    productTitle: "Mango",
    productImage: "/uploads/1751568909409-11479892.png",
    sellerEmail: "agrotrade804@gmail.com",
    lastMessage: "What's the best price you can offer for 5kg?",
    createdAt: new Date(Date.now() - 1800000)
  },
  {
    roomId: "6866d267941ddb9ed76ac431--thirdbuyer@example.com--agrotrade804@gmail.com",
    productTitle: "Banana",
    productImage: "/uploads/1751568974553-bananas-white-background.jpg",
    sellerEmail: "agrotrade804@gmail.com",
    lastMessage: "Do you have organic bananas?",
    createdAt: new Date(Date.now() - 900000)
  }
];

const mockMessages = {
  "6866d0bc941ddb9ed76ac415--testbuyer@example.com--agrotrade804@gmail.com": [
    { sender: "testbuyer@example.com", content: "Hi, I'm interested in your Apple. Is it still available?", createdAt: new Date(Date.now() - 3600000) },
    { sender: "agrotrade804@gmail.com", content: "Yes, it's available!", createdAt: new Date(Date.now() - 3500000) },
    { sender: "testbuyer@example.com", content: "Can you deliver 2kg?", createdAt: new Date(Date.now() - 3400000) },
  ],
  "6866d22e941ddb9ed76ac422--anotherbuyer@example.com--agrotrade804@gmail.com": [],
  "6866d267941ddb9ed76ac431--thirdbuyer@example.com--agrotrade804@gmail.com": [],
};

export default function ChatInboxPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [input, setInput] = useState("");
  const [useMockData, setUseMockData] = useState(false);
  const [newChatProduct, setNewChatProduct] = useState<any>(null);
  const [newChatLoading, setNewChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Unread'];
  const [readChats, setReadChats] = useState<string[]>([]);
  const [showOfferBox, setShowOfferBox] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const suggestedOffers = ["20000", "19000", "18000", "17000", "16000"];
  const socket = useSocket();

  // Auto-select chat if roomId is in query string
  useEffect(() => {
    const roomId = searchParams.get("roomId");
    if (roomId) setSelectedRoomId(roomId);
  }, [searchParams]);

  // If selectedRoomId is not in chats, fetch product info for new chat
  useEffect(() => {
    if (!selectedRoomId || chats.some(c => c.roomId === selectedRoomId)) {
      setNewChatProduct(null);
      return;
    }
    // Parse productId from roomId
    const [productId] = selectedRoomId.split("--");
    if (!productId) return;
    setNewChatLoading(true);
    fetch(`/api/products?id=${productId}`)
      .then(res => res.json())
      .then(data => setNewChatProduct(data))
      .catch(() => setNewChatProduct(null))
      .finally(() => setNewChatLoading(false));
  }, [selectedRoomId, chats]);

  // Helper to fetch chat list
  const fetchChats = async () => {
    if (!isLoaded || !isSignedIn) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/buyer-chats?buyerEmail=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setChats(data);
        setUseMockData(false);
      } else {
        setChats([]);
        setUseMockData(true);
      }
    } catch {
      setChats([]);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat list
  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedRoomId || !isSignedIn || !user) {
      setMessages([]);
      return;
    }
    setMessagesLoading(true);
    fetch(`/api/messages?roomId=${selectedRoomId}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(() => setMessages([]))
      .finally(() => setMessagesLoading(false));
  }, [selectedRoomId, isSignedIn, user]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter chats by search
  const filteredChats = chats.filter(chat =>
    chat.productTitle?.toLowerCase().includes(search.toLowerCase()) ||
    chat.sellerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  // When a chat is selected, mark it as read
  const handleSelectChat = (roomId: string) => {
    setSelectedRoomId(roomId);
    setReadChats((prev) => prev.includes(roomId) ? prev : [...prev, roomId]);
  };

  // Helper to determine if a chat is unread (last message not sent by current user and not opened)
  function isChatUnread(chat) {
    if (!user) return false;
    if (readChats.includes(chat.roomId)) return false; // Mark as read if opened
    if (chat.lastMessageSender) {
      return chat.lastMessageSender !== user.primaryEmailAddress.emailAddress;
    }
    return chat.lastMessage && chat.sellerEmail !== user.primaryEmailAddress.emailAddress;
  }

  // Filter chats by active filter (useMemo to update immediately when readChats changes)
  const chatsToShow = useMemo(() => {
    if (activeFilter === 'Unread') {
      return filteredChats.filter(isChatUnread);
    }
    return filteredChats;
  }, [activeFilter, filteredChats, readChats, user]);

  // Sidebar for chat list (now using ChatSidebar)
  const sidebar = (
    <ChatSidebar
      chats={chats}
      selectedRoomId={selectedRoomId}
      onSelectChat={handleSelectChat}
      searchPlaceholder="Search by product or seller..."
      loading={loading}
      useMockData={useMockData}
      filters={filters}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
      isChatUnread={isChatUnread}
    />
  );

  // Main chat area with OLX-style UI
  const selectedChat = chats.find((c) => c.roomId === selectedRoomId);
  const quickReplies = ["okay", "no problem", "please reply", "not interested", "make an offer"];

  // If this is a new chat (not in sidebar), show product info and allow sending first message
  const isNewChat = selectedRoomId && !selectedChat && newChatProduct;

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !selectedRoomId || !user || !socket) return;
    const { buyer, seller } = parseRoomId(selectedRoomId);
    const msg = {
      roomId: selectedRoomId,
      sender: user.primaryEmailAddress.emailAddress,
      content: input,
      createdAt: new Date().toISOString(),
      buyer,
      seller,
    };
    socket.emit("message", msg);
    setInput("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
      if (res.ok && isNewChat) {
        setTimeout(async () => {
          await fetchChats();
          setSelectedRoomId(selectedRoomId);
        }, 400);
      }
    } catch (err) {}
  };

  const sendOffer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!offerAmount.trim() || !selectedRoomId || !user || !socket) return;
    const { buyer, seller } = parseRoomId(selectedRoomId);
    const msg = {
      roomId: selectedRoomId,
      sender: user.primaryEmailAddress.emailAddress,
      content: `Offer: ₹${offerAmount}`,
      createdAt: new Date().toISOString(),
      buyer,
      seller,
    };
    socket.emit("message", msg);
    setOfferAmount("");
    setShowOfferBox(false);
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
    } catch {}
  };

  useEffect(() => {
    if (!selectedRoomId || !isSignedIn || !user || !socket) return;
    socket.emit("join", selectedRoomId);
    socket.emit("join", user.primaryEmailAddress.emailAddress);
    const messageListener = (msg) => {
      if (msg.roomId === selectedRoomId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("message", messageListener);
    return () => {
      socket.off("message", messageListener);
    };
  }, [selectedRoomId, isSignedIn, user, socket]);

  useEffect(() => {
    if (!isSignedIn || !user || !socket) return;
    socket.emit("join", user.primaryEmailAddress.emailAddress);
    const newMessageListener = (msg) => {
      if (msg.roomId === selectedRoomId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("new-message", newMessageListener);
    return () => {
      socket.off("new-message", newMessageListener);
    };
  }, [selectedRoomId, isSignedIn, user, socket]);

  const mainArea = (
    <div className="flex flex-col h-full w-full bg-white border-l border-gray-100 rounded-r-2xl p-0">
      {/* Product info header */}
      {selectedChat && (
        <div className="flex items-center gap-4 border-b px-8 py-3 bg-white min-h-[64px] relative rounded-tr-2xl">
          <Image src={selectedChat.productImage || "/assets/organic.png"} alt={selectedChat.productTitle} width={48} height={48} className="rounded-xl border object-cover w-12 h-12" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-black text-lg truncate">{selectedChat.productTitle}</div>
            <div className="text-xs text-gray-700 truncate">Seller: {selectedChat.sellerEmail}</div>
          </div>
          {/* Three-dot menu in header */}
          <button className="ml-2 p-1 rounded-full hover:bg-gray-100 absolute right-4 top-4">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="4" cy="10" r="1.5" fill="#888"/><circle cx="10" cy="10" r="1.5" fill="#888"/><circle cx="16" cy="10" r="1.5" fill="#888"/></svg>
          </button>
        </div>
      )}
      {/* New chat box for product if not in sidebar */}
      {isNewChat && (
        <div className="flex items-center gap-4 border-b px-8 py-3 bg-white min-h-[64px] rounded-tr-2xl">
          <Image src={newChatProduct.image || "/assets/organic.png"} alt={newChatProduct.title} width={48} height={48} className="rounded-xl border object-cover w-12 h-12" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-black text-lg truncate">{newChatProduct.title}</div>
            <div className="text-xs text-gray-700 truncate">Seller: {newChatProduct.seller?.email}</div>
          </div>
        </div>
      )}
      {/* Date separator (e.g., YESTERDAY) */}
      {messages.length > 0 && (
        <div className="flex items-center justify-center my-2">
          <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">YESTERDAY</span>
        </div>
      )}
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-8 py-4 bg-white flex flex-col gap-3">
        {selectedRoomId && messagesLoading && (
          <div className="text-gray-500">Loading messages...</div>
        )}
        {selectedRoomId && !messagesLoading && messages.length === 0 && !isNewChat && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4 text-gray-200"><rect x="8" y="16" width="48" height="32" rx="6" fill="#F3F4F6"/><rect x="16" y="24" width="32" height="4" rx="2" fill="#E5E7EB"/><rect x="16" y="32" width="20" height="4" rx="2" fill="#E5E7EB"/></svg>
            <div className="text-gray-400 text-lg font-medium">No messages yet. Start the conversation!</div>
          </div>
        )}
        {/* New chat: show blank state for messages */}
        {isNewChat && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4 text-gray-200"><rect x="8" y="16" width="48" height="32" rx="6" fill="#F3F4F6"/><rect x="16" y="24" width="32" height="4" rx="2" fill="#E5E7EB"/><rect x="16" y="32" width="20" height="4" rx="2" fill="#E5E7EB"/></svg>
            <div className="text-gray-400 text-lg font-medium">No messages yet. Start the conversation!</div>
          </div>
        )}
        {selectedRoomId && !messagesLoading && messages.length > 0 && (
          <>
            {messages.map((msg, i) => {
              const senderEmail = typeof msg.sender === 'string' ? msg.sender : msg.sender?.email;
              const isCurrentUser = senderEmail === user?.primaryEmailAddress?.emailAddress;
              return (
                <div key={i} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}>
                  <div className={`px-5 py-3 rounded-2xl max-w-xs text-black ${isCurrentUser ? "bg-green-100" : "bg-gray-100"}`}>
                    <div className="text-sm">{msg.content}</div>
                    <div className="text-xs text-gray-500 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
        {!selectedRoomId && (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-lg bg-white">Select a chat to start messaging</div>
        )}
      </div>
      {/* Offer Box UI */}
      {showOfferBox && (
        <div className="border-t border-b bg-white px-8 py-6 flex flex-col gap-4 items-center">
          <div className="w-full flex flex-wrap gap-2 mb-2">
            {suggestedOffers.map((amt) => (
              <button key={amt} className="px-4 py-2 bg-gray-100 rounded-full border border-gray-200 text-base font-medium hover:bg-green-100" onClick={() => setOfferAmount(amt)}>
                ₹ {amt}
              </button>
            ))}
          </div>
          <form className="w-full flex gap-2 items-center" onSubmit={sendOffer}>
            <input
              type="number"
              className="flex-1 border rounded-lg px-4 py-3 text-lg bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Enter your offer (₹)"
              value={offerAmount}
              onChange={e => setOfferAmount(e.target.value)}
              min={0}
            />
            <button type="submit" className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all duration-150">Send</button>
            <button type="button" className="ml-2 text-gray-500 hover:text-red-500" onClick={() => setShowOfferBox(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
      {/* Quick replies and input */}
      <div className="border-t bg-white px-8 py-3 flex flex-col gap-2 rounded-br-2xl">
        <div className="mb-1 flex gap-2 flex-wrap">
          {quickReplies.map((txt) => (
            <button key={txt} className="px-4 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-sm text-black hover:bg-green-100 transition-all duration-150" onClick={() => setInput(txt)} disabled={!selectedRoomId}>{txt}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {/* Attachment icon */}
          <button className="p-2 rounded-full hover:bg-gray-100" disabled>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M17.657 11.657l-6.364 6.364a4 4 0 01-5.657-5.657l8.485-8.485a2 2 0 112.828 2.828l-8.485 8.485a.5.5 0 01-.707-.707l8.485-8.485" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <form className="flex-1 flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 bg-white text-black placeholder-gray-400 border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Type a message"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!isSignedIn || !selectedRoomId}
              style={{ minHeight: 0 }}
            />
            {/* Circular send button */}
            <button className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg hover:bg-green-600 transition-all duration-150" type="submit" disabled={!input.trim() || !isSignedIn || !selectedRoomId}>
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M3 10l13-5-5 13-2-6-6-2z" fill="currentColor"/></svg>
            </button>
          </form>
          {/* Make Offer button */}
          <button className="ml-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm text-black flex items-center gap-2 hover:bg-green-100 transition-all duration-150" type="button" onClick={() => setShowOfferBox(true)} disabled={!selectedRoomId}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            MAKE OFFER
          </button>
        </div>
      </div>
    </div>
  );

  return <ChatLayout sidebar={sidebar}>{mainArea}</ChatLayout>;
} 