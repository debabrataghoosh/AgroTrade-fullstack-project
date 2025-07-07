"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

interface RoleSelectorProps {
  onRoleSet?: (role: string) => void;
  showCurrentRole?: boolean;
}

export default function RoleSelector({ onRoleSet, showCurrentRole = true }: RoleSelectorProps) {
  const { user, isLoaded } = useUser();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentRole = user?.publicMetadata?.role as string;

  const handleRoleSelect = async () => {
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      setSuccess("Role updated successfully!");
      onRoleSet?.(selectedRole);
      
      // Refresh the page to update the user context
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="text-green-600">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-green-800 mb-4">Select Your Role</h2>
      
      {showCurrentRole && currentRole && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            Current role: <span className="font-semibold capitalize">{currentRole}</span>
          </p>
        </div>
      )}

      <div className="space-y-3 mb-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="role"
            value="buyer"
            checked={selectedRole === "buyer"}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-green-600 focus:ring-green-500"
          />
          <div>
            <span className="font-medium text-gray-900">Buyer</span>
            <p className="text-sm text-gray-500">Purchase agricultural products</p>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="role"
            value="seller"
            checked={selectedRole === "seller"}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-green-600 focus:ring-green-500"
          />
          <div>
            <span className="font-medium text-gray-900">Seller</span>
            <p className="text-sm text-gray-500">Sell products and manage inventory</p>
          </div>
        </label>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <button
        onClick={handleRoleSelect}
        disabled={loading || !selectedRole}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Updating..." : "Set Role"}
      </button>
    </div>
  );
} 