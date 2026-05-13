"use client";

import { useState } from "react";
import { useDesigns } from "@/hooks/useDesigns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Design } from "@/types";

const categories = [
  { value: "POKEMON", label: "Pokémon" },
  { value: "ANIME", label: "Anime" },
  { value: "MUSICA", label: "Música" },
  { value: "YOGA", label: "Yoga" },
  { value: "FLORAL", label: "Floral" },
  { value: "GEOMETRICO", label: "Geométrico" },
  { value: "MINIMALISTA", label: "Minimalista" },
  { value: "OTRO", label: "Otro" },
];

const PAGE_SIZE = 12;

export default function DesignsPage() {
  const { data: designs, isLoading } = useDesigns();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  const filtered = selectedCategory
    ? designs?.filter((d) => d.category === selectedCategory)
    : null; // ← null cuando no hay categoría seleccionada

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setVisible(PAGE_SIZE);
  };

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
          Elige el diseño perfecto para personalizar tu producto.
        </p>
      </div>

      {/* Filtros por categoría */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Estado inicial — sin categoría seleccionada */}
      {!selectedCategory && (
        <div className="text-center py-24 space-y-4">
          <p className="text-4xl">🎨</p>
          <p className="text-xl font-semibold">Explora nuestros diseños</p>
          <p className="text-muted-foreground">
            Selecciona una categoría para ver los diseños disponibles
          </p>
        </div>
      )}

      {/* Con categoría seleccionada */}
      {selectedCategory && (
        <>
          <p className="text-sm text-muted-foreground">
            {filtered?.length ?? 0} diseño{filtered?.length !== 1 ? "s" : ""} en{" "}
            {categories.find((c) => c.value === selectedCategory)?.label}
          </p>

          {!filtered?.length ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay diseños en esta categoría aún.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {filtered.slice(0, visible).map((design) => (
                  <div
                    key={design.id}
                    role="button"
                    tabIndex={0}
                    className="group border rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedDesign(design)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setSelectedDesign(design)
                    }
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

              {/* Ver más */}
              {visible < (filtered?.length ?? 0) && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  >
                    Ver más diseños ({filtered.length - visible} restantes)
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Modal de diseño */}
      <Dialog
        open={!!selectedDesign}
        onOpenChange={() => setSelectedDesign(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDesign?.name}</DialogTitle>
          </DialogHeader>
          {selectedDesign && (
            <div className="space-y-4">
              <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden">
                <Image
                  src={selectedDesign.image_url}
                  alt={selectedDesign.name}
                  fill
                  className="object-contain"
                />
              </div>
              {selectedDesign.description && (
                <p className="text-sm text-muted-foreground">
                  {selectedDesign.description}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
