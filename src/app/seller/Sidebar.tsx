"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import CustomUserButton from "../components/CustomUserButton";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

const sidebarLinks = [
  { label: "Dashboard", href: "/seller" },
  { label: "Orders", href: "/seller/orders" },
  { label: "Products", href: "/seller/products" },
  { label: "Add Product", href: "/seller/add-product" },
  { label: "Chat", href: "/seller/chat" },
  { label: "Settings", href: "/seller/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  return (
    <aside className="w-56 bg-white border-r border-green-100 flex flex-col py-8 px-4 relative min-h-screen">
      <div className="text-2xl font-bold text-green-700 mb-8">Seller Portal</div>
      <nav className="flex flex-col gap-2">
        {sidebarLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded font-medium transition-colors duration-150 ${pathname === link.href ? "bg-green-100 text-green-700" : "text-green-800 hover:bg-green-50"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {/* Move Login/User button to bottom left */}
      {/* <SignedOut>
        <div className="fixed bottom-6 left-6 z-50">
          <SignInButton>
            <button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3 font-semibold shadow-lg transition-all text-lg">Login</button>
          </SignInButton>
        </div>
      </SignedOut> */}
      <SignedIn>
        <div className="fixed bottom-6 left-6 z-50">
          <CustomUserButton />
        </div>
      </SignedIn>
    </aside>
  );
} 