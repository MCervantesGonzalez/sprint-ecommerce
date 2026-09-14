"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import Image from "next/image";
import { Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const categoryColors: Record<string, string> = {
  TAZA: "bg-blue-100 text-blue-800",
  PLAYERA: "bg-green-100 text-green-800",
  HOODIE: "bg-purple-100 text-purple-800",
  OTRO: "bg-gray-100 text-gray-800",
};

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const activeVariants = product.variants.filter((v) => v.active);

  const minPrice = activeVariants.length
    ? Math.min(...activeVariants.map((v) => v.base_price))
    : 0;

  const minComparePrice = activeVariants.some((v) => v.compare_price)
    ? Math.min(
        ...activeVariants
          .filter((v) => v.compare_price)
          .map((v) => v.compare_price!),
      )
    : null;

  const hasDiscount = minComparePrice && minComparePrice > minPrice;

  const discountPercent = hasDiscount
    ? Math.round((1 - minPrice / minComparePrice) * 100)
    : null;

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  const displayImage =
    activeVariants.find((v) => v.image_url)?.image_url ?? product.image_url;

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow group">
      <CardContent className="pt-4 sm:pt-6 flex-1">
        {/* Imagen con botón de vista rápida */}
        <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-4 overflow-hidden relative">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-4xl">
              {product.category === "TAZA"
                ? "☕"
                : product.category === "PLAYERA"
                  ? "👕"
                  : product.category === "HOODIE"
                    ? "🧥"
                    : "🛍️"}
            </span>
          )}
          {/* Botón vista rápida */}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/90 text-foreground text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 whitespace-nowrap shadow"
            >
              <Eye className="h-3 w-3" />
              Vista rápida
            </button>
          )}
        </div>

        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-2">
              {product.name}
            </h3>
            <Badge className={categoryColors[product.category]}>
              {product.category}
            </Badge>
          </div>

          {product.description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Precio con oferta */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base sm:text-lg font-bold text-brand-primary">
              Desde ${minPrice.toFixed(2)}
            </p>
            {hasDiscount && (
              <>
                <p className="text-sm text-brand-medium line-through">
                  ${minComparePrice!.toFixed(2)}
                </p>
                <span className="text-xs font-bold bg-brand-primary text-white px-1.5 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            {totalStock > 0 ? `${totalStock} disponibles` : "Sin stock"}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/products/${product.id}`} className="w-full">
          <Button
            className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white"
            disabled={totalStock === 0}
          >
            {totalStock > 0 ? "Ver producto" : "Sin stock"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
