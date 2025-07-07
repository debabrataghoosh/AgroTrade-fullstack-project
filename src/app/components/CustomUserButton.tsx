"use client";
import { useState, useRef, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function CustomUserButton() {
  const { user, isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropUp, setDropUp] = useState(false);
  const [dropRight, setDropRight] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    function checkDropDirection() {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        // If there's not enough space below, open upwards
        setDropUp(rect.bottom + 250 > window.innerHeight);
        // If there's not enough space to the right, align right
        setDropRight(rect.left + 224 > window.innerWidth); // 224px = w-56
      }
    }
    checkDropDirection();
    window.addEventListener('resize', checkDropDirection);
    return () => window.removeEventListener('resize', checkDropDirection);
  }, [open]);

  if (!isSignedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        ref={buttonRef}
      >
        <img
          src={user.imageUrl}
          alt={user.fullName || user.username || "User"}
          className="w-10 h-10 rounded-full border"
        />
      </button>
      {open && (
        <div
          className={`absolute ${dropRight ? 'right-0' : 'left-0'} ${dropUp ? 'bottom-12 mb-2' : 'mt-2'} w-56 bg-white border rounded shadow-lg z-50 py-2`}
          style={{ minWidth: '14rem' }}
        >
          <div className="px-4 py-2 text-gray-800 font-semibold border-b">{user.fullName || user.username || "User"}<div className="text-xs text-gray-500">{user.primaryEmailAddress?.emailAddress}</div></div>
          <Link href="/dashboard/profile" className="block px-4 py-2 hover:bg-gray-100 text-gray-800 flex items-center gap-2">
            <span>⚙️</span> Manage Account
          </Link>
          <Link href="/dashboard/orders" className="block px-4 py-2 hover:bg-gray-100 text-gray-800 flex items-center gap-2">
            <span>🛒</span> Orders
          </Link>
          <Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-100 text-gray-800 flex items-center gap-2">
            <span>❤️</span> Wishlist
          </Link>
          <Link href={user.publicMetadata?.role === "seller" ? "/seller/chat" : "/chat"} className="block px-4 py-2 hover:bg-gray-100 text-gray-800 flex items-center gap-2">
            <span>💬</span> Chat
          </Link>
          <div className="border-t my-2" />
          <SignOutButton>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2">🚪 Sign Out</button>
          </SignOutButton>
        </div>
      )}
    </div>
  );
} 