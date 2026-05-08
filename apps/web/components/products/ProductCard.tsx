"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const categoryColors: Record<string, string> = {
  TAZA: "bg-blue-100 text-blue-800",
  PLAYERA: "bg-green-100 text-green-800",
  HOODIE: "bg-purple-100 text-purple-800",
  OTRO: "bg-gray-100 text-gray-800",
};

export function ProductCard({ product }: ProductCardProps) {
  const minPrice = product.variants.length
    ? Math.min(...product.variants.map((v) => v.base_price))
    : 0;

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardContent className="pt-6 flex-1">
        {/* Imagen placeholder */}
        <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center mb-4">
          <span className="text-4xl">
            {product.category === "TAZA"
              ? "☕"
              : product.category === "PLAYERA"
                ? "👕"
                : product.category === "HOODIE"
                  ? "🧥"
                  : "🛍️"}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <Badge className={categoryColors[product.category]}>
              {product.category}
            </Badge>
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}

          <p className="text-lg font-bold text-primary">
            Desde ${minPrice.toFixed(2)}
          </p>

          <p className="text-xs text-muted-foreground">
            {totalStock > 0 ? `${totalStock} disponibles` : "Sin stock"}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/products/${product.id}`} className="w-full">
          <Button className="w-full" disabled={totalStock === 0}>
            {totalStock > 0 ? "Ver producto" : "Sin stock"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
