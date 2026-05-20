"use client";

import { useState } from "react";
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useCreateVariant,
  useUpdateVariant,
} from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product, ProductVariant } from "@/types";
import { Plus, Pencil, Package, EyeOff, Eye } from "lucide-react";

const categories = ["TAZA", "PLAYERA", "HOODIE", "OTRO"];

const categoryColors: Record<string, string> = {
  TAZA: "bg-blue-100 text-blue-800",
  PLAYERA: "bg-green-100 text-green-800",
  HOODIE: "bg-purple-100 text-purple-800",
  OTRO: "bg-gray-100 text-gray-800",
};

export default function AdminProductsPage() {
  const { data: products, isLoading } = useAdminProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const createVariant = useCreateVariant();
  const updateVariant = useUpdateVariant();

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

  const openCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", category: "TAZA", description: "" });
    setShowProductModal(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      description: product.description ?? "",
    });
    setShowProductModal(true);
  };

  const openCreateVariant = (productId: string) => {
    setEditingVariant(null);
    setSelectedProductId(productId);
    setVariantForm({ size: "", color: "", stock: 0, base_price: 0 });
    setShowVariantModal(true);
  };

  const openEditVariant = (productId: string, variant: ProductVariant) => {
    setEditingVariant(variant);
    setSelectedProductId(productId);
    setVariantForm({
      size: variant.size,
      color: variant.color,
      stock: variant.stock,
      base_price: variant.base_price,
    });
    setShowVariantModal(true);
  };

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

  const handleToggleProduct = async (product: Product) => {
    await updateProduct.mutateAsync({
      id: product.id,
      data: { active: !product.active },
    });
  };

  const handleToggleVariant = async (
    productId: string,
    variant: ProductVariant,
  ) => {
    await updateVariant.mutateAsync({
      productId,
      variantId: variant.id,
      data: { active: !variant.active },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Button onClick={openCreateProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo producto
        </Button>
      </div>

      <div className="space-y-4">
        {products?.map((product: Product) => (
          <div
            key={product.id}
            className={`border rounded-xl p-6 space-y-4 transition-opacity ${
              !product.active ? "opacity-60" : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{product.name}</p>
                    {!product.active && (
                      <Badge className="bg-gray-100 text-gray-600 text-xs">
                        Inactivo
                      </Badge>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-xs text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={categoryColors[product.category]}>
                  {product.category}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditProduct(product)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleProduct(product)}
                  title={product.active ? "Desactivar" : "Activar"}
                >
                  {product.active ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Variantes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Variantes ({product.variants.length})
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openCreateVariant(product.id)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Agregar variante
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`flex items-center justify-between p-3 bg-muted/30 rounded-lg ${
                      !variant.active ? "opacity-50" : ""
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {variant.color} — {variant.size}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {variant.stock} | $
                        {Number(variant.base_price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditVariant(product.id, variant)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleToggleVariant(product.id, variant)}
                        title={variant.active ? "Desactivar" : "Activar"}
                      >
                        {variant.active ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Producto */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="bg-background border">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar producto" : "Nuevo producto"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                placeholder="Ej: Taza Clásica"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <select
                value={productForm.category}
                onChange={(e) =>
                  setProductForm({ ...productForm, category: e.target.value })
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring text-foreground"
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-background text-foreground"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Descripción (opcional)</Label>
              <Input
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
                placeholder="Ej: Taza de cerámica 11oz"
              />
            </div>
            <Button
              className="w-full"
              onClick={handleProductSubmit}
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              {editingProduct ? "Guardar cambios" : "Crear producto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Variante */}
      <Dialog open={showVariantModal} onOpenChange={setShowVariantModal}>
        <DialogContent className="bg-background border">
          <DialogHeader>
            <DialogTitle>
              {editingVariant ? "Editar variante" : "Nueva variante"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  value={variantForm.color}
                  onChange={(e) =>
                    setVariantForm({ ...variantForm, color: e.target.value })
                  }
                  placeholder="Ej: Blanco"
                />
              </div>
              <div className="space-y-2">
                <Label>Talla/Tamaño</Label>
                <Input
                  value={variantForm.size}
                  onChange={(e) =>
                    setVariantForm({ ...variantForm, size: e.target.value })
                  }
                  placeholder="Ej: 11oz"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  min={0}
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
                <Label>Precio base</Label>
                <Input
                  type="number"
                  min={0}
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
            <Button
              className="w-full"
              onClick={handleVariantSubmit}
              disabled={createVariant.isPending || updateVariant.isPending}
            >
              {editingVariant ? "Guardar cambios" : "Crear variante"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
