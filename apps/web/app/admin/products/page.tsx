"use client";

import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";

const categoryColors: Record<string, string> = {
  TAZA: "bg-blue-100 text-blue-800",
  PLAYERA: "bg-green-100 text-green-800",
  HOODIE: "bg-purple-100 text-purple-800",
  OTRO: "bg-gray-100 text-gray-800",
};

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos</h1>
        <p className="text-sm text-muted-foreground">
          {products?.length ?? 0} productos activos
        </p>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-4 font-medium">Producto</th>
              <th className="text-left p-4 font-medium">Categoría</th>
              <th className="text-left p-4 font-medium">Variantes</th>
              <th className="text-left p-4 font-medium">Stock total</th>
              <th className="text-left p-4 font-medium">Precio desde</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => {
              const totalStock = product.variants.reduce(
                (sum, v) => sum + v.stock,
                0,
              );
              const minPrice = product.variants.length
                ? Math.min(...product.variants.map((v) => v.base_price))
                : 0;

              return (
                <tr
                  key={product.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-48">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={categoryColors[product.category]}>
                      {product.category}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {product.variants.length} variante
                    {product.variants.length !== 1 ? "s" : ""}
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        totalStock === 0
                          ? "text-red-600 font-bold"
                          : totalStock <= 10
                            ? "text-orange-600 font-bold"
                            : "font-medium"
                      }
                    >
                      {totalStock}
                    </span>
                  </td>
                  <td className="p-4 font-bold">
                    ${Number(minPrice).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
