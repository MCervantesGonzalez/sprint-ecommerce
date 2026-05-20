"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProduct, useProductDesigns } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/authStore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductVariant, ProductDesign } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading: loadingProduct } = useProduct(id);
  const { data: designs, isLoading: loadingDesigns } = useProductDesigns(id);
  const addToCart = useAddToCart();
  const { isAuthenticated } = useAuthStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedDesign, setSelectedDesign] = useState<ProductDesign | null>(
    null,
  );

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!selectedVariant) return;

    addToCart.mutate({
      variantId: selectedVariant.id,
      designId: selectedDesign?.design.id,
      quantity: 1,
    });
  };

  const totalPrice = selectedVariant
    ? selectedVariant.base_price + (selectedDesign?.extra_price ?? 0)
    : null;

  if (loadingProduct) {
    return (
      <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          <Skeleton className="h-64 sm:h-80 w-full rounded-md" />
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12 px-3 sm:px-0">
        <p className="text-sm sm:text-base text-muted-foreground">
          Producto no encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8 px-3 sm:px-0">
      {/* Header */}
      <div className="space-y-1 sm:space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-3xl font-bold">{product.name}</h1>
          <Badge className="text-xs sm:text-sm">{product.category}</Badge>
        </div>
        {product.description && (
          <p className="text-xs sm:text-base text-muted-foreground">
            {product.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {/* Imagen placeholder */}
        <div className="w-full h-64 sm:h-80 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-6xl sm:text-8xl">
            {product.category === "TAZA"
              ? "☕"
              : product.category === "PLAYERA"
                ? "👕"
                : product.category === "HOODIE"
                  ? "🧥"
                  : "🛍️"}
          </span>
        </div>

        {/* Variantes + Acción */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Variantes disponibles
            </h2>
            <div className="space-y-1.5 sm:space-y-2">
              {product.variants
                .filter((v) => v.active)
                .map((variant) => (
                  <div
                    key={variant.id}
                    role="button"
                    tabIndex={0}
                    className={`cursor-pointer rounded-lg sm:rounded-xl border p-3 sm:p-4 flex items-center justify-between transition-colors text-sm sm:text-base ${
                      selectedVariant?.id === variant.id
                        ? "border-primary ring-1 ring-primary"
                        : "hover:border-primary border-border"
                    }`}
                    onClick={() => setSelectedVariant(variant)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setSelectedVariant(variant)
                    }
                  >
                    <div className="space-y-0.5 sm:space-y-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm">
                        {variant.color} — {variant.size}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {variant.stock}
                      </p>
                    </div>
                    <p className="font-bold text-sm sm:text-lg whitespace-nowrap">
                      ${variant.base_price}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Precio total y botón */}
          <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t">
            {totalPrice !== null && (
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-base text-muted-foreground">
                  Precio total
                </span>
                <span className="text-xl sm:text-2xl font-bold">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            )}

            <Button
              className="w-full text-sm sm:text-base h-9 sm:h-10"
              size="lg"
              disabled={!selectedVariant || addToCart.isPending}
              onClick={handleAddToCart}
            >
              {addToCart.isPending
                ? "Agregando..."
                : !selectedVariant
                  ? "Selecciona una variante"
                  : "Agregar al carrito"}
            </Button>

            {!isAuthenticated && (
              <p className="text-xs text-center text-muted-foreground">
                Necesitas iniciar sesión para agregar al carrito
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Diseños disponibles */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-2xl font-semibold">
          Diseños disponibles
        </h2>
        {loadingDesigns ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-md" />
            ))}
          </div>
        ) : !designs?.length ? (
          <p className="text-xs sm:text-base text-muted-foreground">
            No hay diseños disponibles para este producto.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {designs.map((pd) => (
              <div
                key={pd.id}
                role="button"
                tabIndex={0}
                className={`cursor-pointer rounded-lg sm:rounded-xl border transition-colors ${
                  selectedDesign?.id === pd.id
                    ? "border-primary ring-1 ring-primary"
                    : "hover:border-primary border-border"
                }`}
                onClick={() =>
                  setSelectedDesign(selectedDesign?.id === pd.id ? null : pd)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  setSelectedDesign(selectedDesign?.id === pd.id ? null : pd)
                }
              >
                <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
                  <div className="relative w-full h-28 sm:h-32 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={pd.design.image_url}
                      alt={pd.design.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="font-medium text-xs sm:text-sm truncate">
                    {pd.design.name}
                  </p>
                  {pd.extra_price > 0 && (
                    <p className="text-xs text-muted-foreground">
                      +${pd.extra_price}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
