"use client";

import { useDesigns } from "@/hooks/useDesigns";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function DesignsPage() {
  const { data: designs, isLoading } = useDesigns();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Catálogo de Diseños
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Elige el diseño perfecto para personalizar tu producto. Cada diseño
          puede aplicarse a diferentes productos.
        </p>
      </div>

      {/* Grid de diseños */}
      {!designs?.length ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No hay diseños disponibles por el momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {designs.map((design) => (
            <div
              key={design.id}
              className="group border rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all"
            >
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={design.image_url}
                  alt={design.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 space-y-1">
                <p className="font-semibold text-sm">{design.name}</p>
                {design.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {design.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
