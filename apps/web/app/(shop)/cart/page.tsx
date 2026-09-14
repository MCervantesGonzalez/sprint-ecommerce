"use client";

import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
  useClearCart,
} from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const removeItem = useRemoveCartItem();
  const updateItem = useUpdateCartItem();
  const clearCart = useClearCart();

  if (isLoading) {
    return (
      <div className="space-y-4 p-3 sm:p-6">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!cart?.items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-24 gap-4 px-3 sm:px-6">
        <ShoppingBag className="h-12 sm:h-16 w-12 sm:w-16 text-muted-foreground" />
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          Tu carrito está vacío
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground text-center">
          Agrega productos para continuar
        </p>
        <Button asChild>
          <Link href="/">Ver productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-8 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Mi carrito</h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive w-full sm:w-auto justify-center sm:justify-start"
          onClick={() => clearCart.mutate()}
        >
          Vaciar carrito
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg sm:rounded-xl"
            >
              {/* Imagen */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                {item.design?.image_url ? (
                  <Image
                    src={item.design.image_url}
                    alt={item.design.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    ☕
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base truncate">
                  {item.variant.color} — {item.variant.size}
                </p>
                {item.design && (
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    Diseño: {item.design.name}
                  </p>
                )}
                <p className="font-bold text-sm sm:text-base">
                  ${(item.variant.base_price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Controles */}
              <div className="flex flex-col items-end justify-between gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 text-destructive"
                  onClick={() => removeItem.mutate(item.id)}
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>

                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() =>
                      updateItem.mutate({
                        itemId: item.id,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() =>
                      updateItem.mutate({
                        itemId: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 sticky top-24">
            <h2 className="text-lg sm:text-xl font-semibold">Resumen</h2>

            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-muted-foreground truncate">
                    {item.variant.color} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(item.variant.base_price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 sm:pt-4 flex justify-between font-bold text-base sm:text-lg">
              <span>Total</span>
              <span>${Number(cart.total).toFixed(2)}</span>
            </div>

            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout">Proceder al pago</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
