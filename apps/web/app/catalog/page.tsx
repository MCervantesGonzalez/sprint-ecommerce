"use client";

import { Suspense } from "react";
import { ProductList } from "@/components/products/ProductList";

export default function CatalogoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Catálogo</h1>
        <p className="text-muted-foreground">
          Todos nuestros productos personalizados
        </p>
      </div>
      <Suspense
        fallback={
          <div className="text-muted-foreground">Cargando catálogo...</div>
        }
      >
        <ProductList />
      </Suspense>
    </div>
  );
}
