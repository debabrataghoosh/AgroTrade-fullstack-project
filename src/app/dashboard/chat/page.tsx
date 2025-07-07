"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import ChatLayout from "@/app/components/ChatLayout";
import Image from "next/image";

// Mock data for testing UI (structure matches seller page)
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
    roomId: "6866d22e941ddb9ed76ac422--testbuyer@example.com--agrotrade804@gmail.com",
    productTitle: "Mango",
    productImage: "/uploads/1751568909409-11479892.png",
    sellerEmail: "agrotrade804@gmail.com",
    lastMessage: "What's the best price you can offer for 5kg?",
    createdAt: new Date(Date.now() - 1800000)
  },
  {
    roomId: "6866d267941ddb9ed76ac431--testbuyer@example.com--agrotrade804@gmail.com",
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
  "6866d22e941ddb9ed76ac422--testbuyer@example.com--agrotrade804@gmail.com": [],
  "6866d267941ddb9ed76ac431--testbuyer@example.com--agrotrade804@gmail.com": [],
};

export default function BuyerChatPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const [input, setInput] = useState("");
  const quickReplies = ["okay", "no problem", "please reply", "not interested", "make an offer"];

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    // Try to fetch real data first
    fetch(`/api/buyer-chats?buyerEmail=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setChats(data);
          setUseMockData(false);
        } else {
          setChats(mockChats);
          setUseMockData(true);
        }
      })
      .catch(() => {
        setChats(mockChats);
        setUseMockData(true);
      })
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, user]);

  // Filter chats by search
  const filteredChats = chats.filter(chat =>
    chat.productTitle.toLowerCase().includes(search.toLowerCase()) ||
    chat.sellerEmail.toLowerCase().includes(search.toLowerCase())
  );

  // Sidebar for chat list (matches seller page)
  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <h2 className="text-xl font-bold text-green-800">Inbox</h2>
        {useMockData && (
          <span className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-2 py-1 rounded-full text-xs">Demo</span>
        )}
      </div>
      <div className="p-4 border-b">
        <input
          type="text"
          className="w-full border border-green-200 rounded-full px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400 shadow"
          placeholder="Search by product or seller..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-gray-500 p-4">Loading chats...</div>
        ) : filteredChats.length === 0 ? (
          <div className="text-gray-400 p-4">No chats found.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredChats.map((chat) => (
              <li
                key={chat.roomId}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition bg-white hover:bg-green-50 ${selectedRoomId === chat.roomId ? "bg-green-100" : ""}`}
                onClick={() => setSelectedRoomId(chat.roomId)}
              >
                <Image
                  src={chat.productImage || "/assets/organic.png"}
                  alt={chat.productTitle}
                  width={48}
                  height={48}
                  className="rounded-xl border object-cover w-12 h-12"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-green-800 truncate">{chat.productTitle}</div>
                  <div className="text-xs text-gray-500 truncate">Seller: {chat.sellerEmail}</div>
                  <div className="text-xs text-gray-400 truncate">{chat.lastMessage}</div>
                </div>
                <div className="text-xs text-gray-400 ml-2 min-w-fit">{new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  // Main chat area with OLX-style UI (matches seller page)
  const selectedChat = chats.find((c) => c.roomId === selectedRoomId);
  const messages = selectedRoomId ? mockMessages[selectedRoomId] || [] : [];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setInput("");
  };

  const mainArea = (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Product info header */}
      {selectedChat && (
        <div className="flex items-center gap-4 border-b px-6 py-4 bg-white min-h-[80px]">
          <Image src={selectedChat.productImage || "/assets/organic.png"} alt={selectedChat.productTitle} width={48} height={48} className="rounded-xl border object-cover w-12 h-12" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-black text-lg truncate">{selectedChat.productTitle}</div>
            <div className="text-xs text-gray-700 truncate">Seller: {selectedChat.sellerEmail}</div>
          </div>
        </div>
      )}
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-white flex flex-col gap-2">
        {selectedRoomId && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4 text-gray-200"><rect x="8" y="16" width="48" height="32" rx="6" fill="#F3F4F6"/><rect x="16" y="24" width="32" height="4" rx="2" fill="#E5E7EB"/><rect x="16" y="32" width="20" height="4" rx="2" fill="#E5E7EB"/></svg>
            <div className="text-gray-400 text-lg font-medium">No messages yet. Start the conversation!</div>
          </div>
        )}
        {selectedRoomId && messages.length > 0 && (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === user?.primaryEmailAddress?.emailAddress ? "justify-end" : "justify-start"}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-xs text-black ${msg.sender === user?.primaryEmailAddress?.emailAddress ? "bg-blue-100" : "bg-gray-100"}`}>
                  <div className="text-sm">{msg.content}</div>
                  <div className="text-xs text-gray-500 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))}
          </>
        )}
        {!selectedRoomId && (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-lg bg-white">Select a chat to start messaging</div>
        )}
      </div>
      {/* Quick replies and input */}
      {selectedRoomId && (
        <div className="border-t bg-white px-6 py-4">
          <div className="mb-2 flex gap-2 flex-wrap">
            {quickReplies.map((txt) => (
              <button key={txt} className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-sm text-black hover:bg-blue-100" onClick={() => setInput(txt)}>{txt}</button>
            ))}
          </div>
          <form className="flex gap-2" onSubmit={handleSend}>
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 bg-white text-black placeholder-gray-400 border-gray-200"
              placeholder="Type a message"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!isSignedIn}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit" disabled={!input.trim() || !isSignedIn}>Send</button>
          </form>
        </div>
      )}
    </div>
  );

  return <ChatLayout sidebar={sidebar}>{mainArea}</ChatLayout>;
} 