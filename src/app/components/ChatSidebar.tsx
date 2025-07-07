import React, { useState } from "react";
import Image from "next/image";

interface ChatSidebarProps {
  chats: any[];
  selectedRoomId: string | null;
  onSelectChat: (roomId: string) => void;
  searchPlaceholder?: string;
  loading?: boolean;
  useMockData?: boolean;
  filters?: string[];
  activeFilter?: string;
  setActiveFilter?: (f: string) => void;
  isChatUnread?: (chat: any) => boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  selectedRoomId,
  onSelectChat,
  searchPlaceholder = "Search...",
  loading = false,
  useMockData = false,
  filters,
  activeFilter,
  setActiveFilter,
  isChatUnread,
}) => {
  const [search, setSearch] = useState("");
  const filteredChats = chats.filter(chat =>
    chat.productTitle?.toLowerCase().includes(search.toLowerCase()) ||
    (chat.sellerEmail?.toLowerCase?.() || chat.buyerEmail?.toLowerCase?.() || "").includes(search.toLowerCase())
  );
  // If filters are provided, allow filtering (e.g. All/Unread)
  let chatsToShow = filteredChats;
  if (filters && activeFilter && setActiveFilter && isChatUnread) {
    chatsToShow = activeFilter === 'Unread' ? filteredChats.filter(isChatUnread) : filteredChats;
  }
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-green-800 tracking-tight">Inbox</h2>
        {useMockData && (
          <span className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-2 py-1 rounded-full text-xs">Demo</span>
        )}
      </div>
      {filters && activeFilter && setActiveFilter && isChatUnread && (
        <div className="flex gap-2 px-6 py-2 border-b bg-gray-50 border-gray-100">
          {filters.map(f => (
            <button
              key={f}
              className={`px-4 py-1 rounded-full text-xs font-semibold border transition-all duration-150 shadow-sm ${activeFilter === f ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      )}
      <div className="px-6 py-3 border-b border-gray-100 bg-white">
        <input
          type="text"
          className="w-full border border-gray-200 rounded-full px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm bg-gray-50 placeholder-gray-400"
          placeholder={searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        {loading ? (
          <div className="text-gray-500 p-6">Loading chats...</div>
        ) : chatsToShow.length === 0 ? (
          <div className="text-gray-400 p-6">No chats found.</div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {chatsToShow.map((chat) => (
              <li
                key={chat.roomId}
                className={`flex items-center gap-3 px-6 py-4 cursor-pointer transition bg-white hover:bg-green-50 rounded-xl my-2 shadow-sm border border-transparent ${selectedRoomId === chat.roomId ? "bg-green-100 border-green-200" : ""}`}
                onClick={() => onSelectChat(chat.roomId)}
              >
                <Image
                  src={chat.productImage || "/assets/organic.png"}
                  alt={chat.productTitle}
                  width={48}
                  height={48}
                  className="rounded-xl border object-cover w-12 h-12 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-green-800 truncate text-base">{chat.productTitle}</div>
                  {chat.sellerEmail && <div className="text-xs text-gray-500 truncate">Seller: {chat.sellerEmail}</div>}
                  {chat.buyerEmail && <div className="text-xs text-gray-500 truncate">Buyer: {chat.buyerEmail}</div>}
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
};

export default ChatSidebar; 