"use client";

import { useState } from "react";
import { useProductDesigns } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Product, ProductVariant, ProductDesign } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: designs } = useProductDesigns(product?.id ?? "");
  const addToCart = useAddToCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedDesign, setSelectedDesign] = useState<ProductDesign | null>(
    null,
  );

  const totalPrice = selectedVariant
    ? selectedVariant.base_price + (selectedDesign?.extra_price ?? 0)
    : null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      onClose();
      router.push("/login");
      return;
    }
    if (!selectedVariant) return;
    addToCart.mutate({
      variantId: selectedVariant.id,
      designId: selectedDesign?.design.id,
      quantity: 1,
    });
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagen */}
          <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                {product.category === "TAZA"
                  ? "☕"
                  : product.category === "PLAYERA"
                    ? "👕"
                    : product.category === "HOODIE"
                      ? "🧥"
                      : "🛍️"}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            {product.description && (
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Variantes */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Variante</p>
              <div className="space-y-2">
                {product.variants
                  .filter((v) => v.active)
                  .map((variant) => (
                    <div
                      key={variant.id}
                      role="button"
                      tabIndex={0}
                      className={`cursor-pointer rounded-lg border p-3 flex items-center justify-between transition-colors ${
                        selectedVariant?.id === variant.id
                          ? "border-brand-primary ring-1 ring-brand-primary"
                          : "hover:border-brand-primary border-border"
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setSelectedVariant(variant)
                      }
                    >
                      <span className="text-sm">
                        {variant.color} — {variant.size}
                      </span>
                      <div className="flex items-center gap-2">
                        {variant.compare_price &&
                          variant.compare_price > variant.base_price && (
                            <span className="text-xs text-brand-medium line-through">
                              ${variant.compare_price}
                            </span>
                          )}
                        <span className="font-bold text-sm">
                          ${variant.base_price}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Diseños */}
            {designs && designs.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Diseño{" "}
                  <span className="text-muted-foreground font-normal">
                    (opcional)
                  </span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {designs.slice(0, 6).map((pd) => (
                    <div
                      key={pd.id}
                      role="button"
                      tabIndex={0}
                      className={`cursor-pointer rounded-lg border overflow-hidden transition-colors ${
                        selectedDesign?.id === pd.id
                          ? "border-brand-primary ring-1 ring-brand-primary"
                          : "hover:border-brand-primary border-border"
                      }`}
                      onClick={() =>
                        setSelectedDesign(
                          selectedDesign?.id === pd.id ? null : pd,
                        )
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        setSelectedDesign(
                          selectedDesign?.id === pd.id ? null : pd,
                        )
                      }
                    >
                      <div className="relative w-full h-16 bg-gray-100">
                        <Image
                          src={pd.design.image_url}
                          alt={pd.design.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs p-1 truncate text-center">
                        {pd.design.name}
                      </p>
                    </div>
                  ))}
                </div>
                {designs.length > 6 && (
                  <Link
                    href={`/products/${product.id}`}
                    className="text-xs text-brand-primary hover:underline"
                    onClick={onClose}
                  >
                    Ver todos los diseños ({designs.length})
                  </Link>
                )}
              </div>
            )}

            {/* Precio y botón */}
            <div className="space-y-3 pt-2 border-t">
              {totalPrice !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Precio total
                  </span>
                  <span className="text-xl font-bold">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              )}

              <Button
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white"
                disabled={!selectedVariant || addToCart.isPending}
                onClick={handleAddToCart}
              >
                {addToCart.isPending
                  ? "Agregando..."
                  : !selectedVariant
                    ? "Selecciona una variante"
                    : "Agregar al carrito"}
              </Button>

              <Link
                href={`/products/${product.id}`}
                className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={onClose}
              >
                Ver página completa →
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
