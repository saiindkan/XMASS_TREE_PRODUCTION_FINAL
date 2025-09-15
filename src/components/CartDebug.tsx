"use client";
import { useCart } from "@/context/CartContext";

export default function CartDebug() {
  const { cart, clearCartFromStorage } = useCart();

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-semibold text-sm mb-2">🔍 Cart Debug</h3>
      <div className="text-xs space-y-1">
        <div>Cart Length: {cart.length}</div>
        <div>Items: {JSON.stringify(cart, null, 2)}</div>
        <button
          onClick={clearCartFromStorage}
          className="mt-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
        >
          Clear Cart & Storage
        </button>
      </div>
    </div>
  );
}
