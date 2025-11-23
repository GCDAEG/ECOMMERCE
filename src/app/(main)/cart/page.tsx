"use client";

import React from "react";
import { useStore } from "@/lib/stores/useStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const cart = useStore((s) => s.cart);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const user = useStore((s) => s.user);

  // Calcular total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-3">Debes iniciar sesión</h2>
        <p className="text-gray-600 mb-4 max-w-sm">
          Para ver tu carrito primero debes iniciar sesión o registrarte.
        </p>
        <Link
          href="/auth/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Tu carrito</h1>

      {/* Si el carrito está vacío */}
      {cart.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío.</p>
          <Link href="/products" className="text-blue-600 underline text-lg">
            Ver productos
          </Link>
        </div>
      )}

      {/* Lista de items */}
      <div className="space-y-6">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b pb-4">
            {/* Imagen */}
            <div className="w-20 h-20 bg-gray-100 relative rounded-md overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="font-medium">{item.name}</h2>
              <p className="text-sm text-gray-500">
                ${item.price} x {item.quantity}
              </p>
              <p className="font-semibold">
                Total: ${item.price * item.quantity}
              </p>
            </div>

            {/* Botón eliminar */}
            <button
              onClick={() => removeFromCart(item.id)}
              className="p-2 text-red-500 hover:bg-red-100 rounded-md"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Barra final con total */}
      {cart.length > 0 && (
        <div className="mt-10 border-t pt-6 flex justify-between items-center">
          <p className="text-2xl font-semibold">Total: ${total}</p>

          <Link
            href="/checkout"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
          >
            Finalizar compra
          </Link>
        </div>
      )}
    </div>
  );
}
