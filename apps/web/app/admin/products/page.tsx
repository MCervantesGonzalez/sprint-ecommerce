"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCreateVariant,
  useUpdateVariant,
  useDeleteVariant,
} from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product, ProductVariant } from "@/types";
import { Plus, Pencil, Package } from "lucide-react";

const categories = ["TAZA", "PLAYERA", "HOODIE", "OTRO"];

const categoryColors: Record<string, string> = {
  TAZA: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  PLAYERA:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  HOODIE:
    "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
  OTRO: "bg-muted text-muted-foreground border-border",
};

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createVariant = useCreateVariant();
  const updateVariant = useUpdateVariant();
  const deleteVariant = useDeleteVariant();

  const [showProductModal, setShowProductModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const [productForm, setProductForm] = useState({
    name: "",
    category: "TAZA",
    description: "",
  });
  const [variantForm, setVariantForm] = useState({
    size: "",
    color: "",
    stock: 0,
    base_price: 0,
  });

  const handleProductSubmit = async () => {
    if (editingProduct) {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        data: productForm,
      });
    } else {
      await createProduct.mutateAsync(productForm);
    }
    setShowProductModal(false);
  };

  const handleVariantSubmit = async () => {
    if (editingVariant) {
      await updateVariant.mutateAsync({
        productId: selectedProductId,
        variantId: editingVariant.id,
        data: variantForm,
      });
    } else {
      await createVariant.mutateAsync({
        productId: selectedProductId,
        data: variantForm,
      });
    }
    setShowVariantModal(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-6">
        <Skeleton className="h-10 w-64" />
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6 pb-20 text-foreground">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Productos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona el catálogo y disponibilidad.
          </p>
        </div>
        <Button onClick={() => setShowProductModal(true)} className="font-bold">
          <Plus className="h-5 w-5 mr-2" />
          Nuevo producto
        </Button>
      </div>

      <div className="grid gap-8">
        {products?.map((product) => {
          const isProductInactive = product.active === false;

          return (
            <div
              key={product.id}
              className={`border rounded-2xl p-6 transition-all duration-200 ${
                isProductInactive
                  ? "bg-muted/40 border-dashed border-border opacity-70 shadow-none"
                  : "bg-card shadow-sm border-border hover:shadow-md"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isProductInactive
                        ? "bg-muted text-muted-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2
                        className={`text-xl font-bold ${isProductInactive ? "text-muted-foreground" : "text-card-foreground"}`}
                      >
                        {product.name}
                      </h2>
                      <Badge
                        variant="outline"
                        className={`${categoryColors[product.category]} border font-semibold`}
                      >
                        {product.category}
                      </Badge>
                      {isProductInactive && (
                        <Badge
                          variant="destructive"
                          className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] uppercase font-black"
                        >
                          Inactivo
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-muted/20 md:bg-transparent p-2 rounded-xl border border-border md:border-none">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(product);
                      setShowProductModal(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </Button>
                  <div className="h-6 w-[1px] bg-border mx-1 hidden md:block" />

                  <div className="flex items-center gap-3 px-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        isProductInactive
                          ? "text-muted-foreground"
                          : "text-blue-500"
                      }`}
                    >
                      {isProductInactive ? "OFF" : "ON"}
                    </span>
                    <Switch
                      checked={!isProductInactive}
                      onCheckedChange={(checked) => {
                        if (checked)
                          updateProduct.mutate({
                            id: product.id,
                            data: { active: true },
                          });
                        else if (confirm("¿Desactivar producto?"))
                          deleteProduct.mutate(product.id);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Variantes Disponibles
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setShowVariantModal(true);
                    }}
                    className="text-primary hover:text-primary/80"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Nueva Variante
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.variants.map((variant) => {
                    const isInactive = variant.active === false;
                    return (
                      <div
                        key={variant.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          isInactive
                            ? "bg-muted/30 border-dashed border-border opacity-60 shadow-none"
                            : "bg-background border-border shadow-sm hover:border-primary/40"
                        }`}
                      >
                        <div className="space-y-1">
                          <p
                            className={`font-bold text-sm ${isInactive ? "text-muted-foreground" : "text-foreground"}`}
                          >
                            {variant.color}{" "}
                            <span className="mx-1 text-muted">|</span>{" "}
                            {variant.size}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Stock:{" "}
                            <b className="text-foreground/80">
                              {variant.stock}
                            </b>{" "}
                            | Precio:{" "}
                            <b className="text-foreground/80">
                              ${Number(variant.base_price).toFixed(2)}
                            </b>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setSelectedProductId(product.id);
                              setEditingVariant(variant);
                              setShowVariantModal(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-black uppercase ${isInactive ? "text-muted-foreground" : "text-primary"}`}
                            >
                              {isInactive ? "OFF" : "ON"}
                            </span>
                            <Switch
                              className="scale-75"
                              checked={!isInactive}
                              onCheckedChange={(checked) => {
                                if (checked)
                                  updateVariant.mutate({
                                    productId: product.id,
                                    variantId: variant.id,
                                    data: { active: true },
                                  });
                                else if (confirm("¿Desactivar variante?"))
                                  deleteVariant.mutate({
                                    productId: product.id,
                                    variantId: variant.id,
                                  });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modales */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <select
                value={productForm.category}
                onChange={(e) =>
                  setProductForm({ ...productForm, category: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <Button className="w-full font-bold" onClick={handleProductSubmit}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVariantModal} onOpenChange={setShowVariantModal}>
        <DialogContent className="bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle>
              {editingVariant ? "Editar Variante" : "Nueva Variante"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  value={variantForm.color}
                  onChange={(e) =>
                    setVariantForm({ ...variantForm, color: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Talla</Label>
                <Input
                  value={variantForm.size}
                  onChange={(e) =>
                    setVariantForm({ ...variantForm, size: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={variantForm.stock}
                  onChange={(e) =>
                    setVariantForm({
                      ...variantForm,
                      stock: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Precio</Label>
                <Input
                  type="number"
                  value={variantForm.base_price}
                  onChange={(e) =>
                    setVariantForm({
                      ...variantForm,
                      base_price: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <Button className="w-full font-bold" onClick={handleVariantSubmit}>
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
