"use client";
import React from "react";
import RoleProtection from "../components/RoleProtection";
import Sidebar from "./Sidebar";

// <title>Seller Portal</title>
// <meta name="viewport" content="width=device-width, initial-scale=1" />

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtection allowedRoles={["seller"]} redirectTo="/dashboard">
      <div className="min-h-screen flex bg-white">
        <Sidebar />
        <main className="flex-1 flex flex-col p-8 bg-white">{children}</main>
      </div>
    </RoleProtection>
  );
} 