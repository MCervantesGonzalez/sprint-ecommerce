"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { ProductFilters } from "./ProductFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types";

function ProductSkeleton() {
  return (
    <div className="flex flex-col space-y-2 sm:space-y-3">
      <Skeleton className="h-32 sm:h-40 md:h-48 w-full rounded-md" />
      <Skeleton className="h-3 sm:h-4 w-3/4" />
      <Skeleton className="h-3 sm:h-4 w-1/2" />
      <Skeleton className="h-8 sm:h-10 w-full" />
    </div>
  );
}

export function ProductList() {
  const searchParams = useSearchParams();

  const filters = {
    category: searchParams.get("category") ?? undefined,
    material: searchParams.get("material") ?? undefined,
  };

  const { data: products, isLoading, isError } = useProducts(filters);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );

  return (
    <div className="space-y-6">
      <ProductFilters />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Error al cargar los productos. Intenta de nuevo.
          </p>
        </div>
      ) : !products?.length ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No hay productos que coincidan con esos filtros.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>

          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        </>
      )}
    </div>
  );
}
