"use client";

import { useParams } from "next/navigation";
import { useProduct, useProductDesigns } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading: loadingProduct } = useProduct(id);
  const { data: designs, isLoading: loadingDesigns } = useProductDesigns(id);

  if (loadingProduct) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-80 w-full rounded-md" />
          <div className="space-y-4">
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
      <div className="text-center py-12">
        <p className="text-muted-foreground">Producto no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <Badge>{product.category}</Badge>
        </div>
        {product.description && (
          <p className="text-muted-foreground">{product.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen placeholder */}
        <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-8xl">
            {product.category === "TAZA"
              ? "☕"
              : product.category === "PLAYERA"
                ? "👕"
                : product.category === "HOODIE"
                  ? "🧥"
                  : "🛍️"}
          </span>
        </div>

        {/* Variantes */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Variantes disponibles
            </h2>
            <div className="space-y-2">
              {product.variants
                .filter((v) => v.active)
                .map((variant) => (
                  <Card
                    key={variant.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {variant.color} — {variant.size}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {variant.stock}
                        </p>
                      </div>
                      <p className="font-bold text-lg">${variant.base_price}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Diseños disponibles */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Diseños disponibles</h2>
        {loadingDesigns ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-md" />
            ))}
          </div>
        ) : !designs?.length ? (
          <p className="text-muted-foreground">
            No hay diseños disponibles para este producto.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {designs.map((pd) => (
              <Card
                key={pd.id}
                className="cursor-pointer hover:border-primary transition-colors"
              >
                <CardContent className="p-3 space-y-2">
                  <div className="relative w-full h-32 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={pd.design.image_url}
                      alt={pd.design.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="font-medium text-sm">{pd.design.name}</p>
                  {pd.extra_price > 0 && (
                    <p className="text-xs text-muted-foreground">
                      +${pd.extra_price}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
