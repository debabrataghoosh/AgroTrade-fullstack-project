import React from "react";

interface ChatLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function ChatLayout({ sidebar, children }: ChatLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-6xl flex h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Sidebar */}
        <aside className="w-full max-w-xs min-w-[320px] bg-white border-r border-gray-100 flex flex-col overflow-y-auto">
          {sidebar}
        </aside>
        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-gray-50 min-h-0 h-full">
          {children}
        </main>
      </div>
    </div>
  );
} 