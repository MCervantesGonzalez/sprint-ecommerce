"use client";

import { useCartStore } from "@/store/cartStore";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";
import { useAuthStore } from "@/store/authStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function CartDrawer() {
  const { isOpen, closeCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { data: cart, isLoading } = useCart();
  const removeItem = useRemoveCartItem();
  const updateItem = useUpdateCartItem();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Mi carrito</SheetTitle>
        </SheetHeader>

        {/* No autenticado */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              Inicia sesión para ver tu carrito
            </p>
            <Button asChild onClick={closeCart}>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex-1 space-y-4 py-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !cart?.items.length ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Tu carrito está vacío</p>
            <Button variant="outline" onClick={closeCart} asChild>
              <Link href="/">Ver productos</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {/* Imagen del diseño o placeholder */}
                  <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                    {item.design?.image_url ? (
                      <Image
                        src={item.design.image_url}
                        alt={item.design.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        ☕
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.variant.color} — {item.variant.size}
                    </p>
                    {item.design && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.design.name}
                      </p>
                    )}
                    <p className="text-sm font-bold">
                      ${(item.variant.base_price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Cantidad y eliminar */}
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeItem.mutate(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateItem.mutate({
                            itemId: item.id,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateItem.mutate({
                            itemId: item.id,
                            quantity: item.quantity + 1,
                          })
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con total */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${Number(cart.total ?? 0).toFixed(2)}</span>
              </div>
              <Button className="w-full" asChild onClick={closeCart}>
                <Link href="/cart">Ir al carrito</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
