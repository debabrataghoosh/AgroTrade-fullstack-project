import RoleProtection from '@/app/components/RoleProtection';

export default function SellerPage() {
  return (
    <RoleProtection allowedRoles={["seller"]} redirectTo="/">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-2 text-green-800">Welcome to your Seller Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/seller/orders" className="p-6 bg-white rounded shadow hover:shadow-lg border border-green-100 transition font-semibold text-green-700">View Orders</a>
          <a href="/seller/products" className="p-6 bg-white rounded shadow hover:shadow-lg border border-green-100 transition font-semibold text-green-700">Manage Products</a>
          <a href="/seller/add-product" className="p-6 bg-white rounded shadow hover:shadow-lg border border-green-100 transition font-semibold text-green-700">Add Product</a>
          <a href="/seller/chat" className="p-6 bg-white rounded shadow hover:shadow-lg border border-green-100 transition font-semibold text-green-700">Chat with Buyers</a>
        </div>
      </div>
    </RoleProtection>
  );
} 