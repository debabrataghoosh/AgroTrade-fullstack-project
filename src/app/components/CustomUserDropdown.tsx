"use client";
import { useState, useRef, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function CustomUserDropdown() {
  const { user, isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isSignedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 focus:outline-none"
        onClick={() => setOpen((o) => !o)}
      >
        <img
          src={user.imageUrl}
          alt={user.fullName || user.username || "User"}
          className="w-8 h-8 rounded-full border"
        />
        <span className="font-medium text-gray-800">{user.fullName || user.username || "User"}</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-50 py-2">
          <div className="py-1">
            <Link href="/dashboard/profile" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Manage Account</Link>
            {!(pathname && pathname.startsWith('/seller')) && (
              <>
                <Link href="/seller/orders" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Orders</Link>
                <Link href="/seller/chat" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Chat</Link>
                <Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Wishlist</Link>
              </>
            )}
            <div className="border-t my-2" />
            <SignOutButton>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Sign Out</button>
            </SignOutButton>
          </div>
        </div>
      )}
    </div>
  );
} 