"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useCreateVariant,
  useUpdateVariant,
} from "@/hooks/useAdmin";
import { useDesigns } from "@/hooks/useDesigns";
import { useProductDesigns } from "@/hooks/useProducts";
import { api } from "@/lib/api";
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
import Image from "next/image";
import { Product, ProductVariant } from "@/types";
import { Plus, Pencil, Package, EyeOff, Eye, Palette, X } from "lucide-react";

const categories = ["TAZA", "PLAYERA", "HOODIE", "OTRO"];
const materials = ["ALGODON", "POLIESTER", "CERAMICA", "ALUMINIO", "OTRO"];

const categoryColors: Record<string, string> = {
  TAZA: "bg-blue-100 text-blue-800",
  PLAYERA: "bg-green-100 text-green-800",
  HOODIE: "bg-purple-100 text-purple-800",
  OTRO: "bg-gray-100 text-gray-800",
};

export default function AdminProductsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { data: products, isLoading } = useAdminProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const createVariant = useCreateVariant();
  const updateVariant = useUpdateVariant();

  const [showProductModal, setShowProductModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showDesignsModal, setShowDesignsModal] = useState(false);
  const [designProduct, setDesignProduct] = useState<Product | null>(null);
  const [designSearch, setDesignSearch] = useState("");
  const [extraPriceDrafts, setExtraPriceDrafts] = useState<
    Record<string, number>
  >({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const queryClient = useQueryClient();
  const { data: allDesigns } = useDesigns();
  const { data: assignedDesigns } = useProductDesigns(designProduct?.id ?? "");

  const assignDesign = useMutation({
    mutationFn: async ({
      productId,
      designId,
      extra_price,
    }: {
      productId: string;
      designId: string;
      extra_price?: number;
    }) => {
      const { data } = await api.post(`/designs/product/${productId}`, {
        designId,
        extra_price,
      });
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.productId, "designs"],
      });
    },
  });

  const removeDesign = useMutation({
    mutationFn: async ({
      productId,
      designId,
    }: {
      productId: string;
      designId: string;
    }) => {
      await api.delete(`/designs/product/${productId}/design/${designId}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.productId, "designs"],
      });
    },
  });

  const openDesignsModal = (product: Product) => {
    setDesignProduct(product);
    setExtraPriceDrafts({});
    setDesignSearch("");
    setShowDesignsModal(true);
  };

  const [productForm, setProductForm] = useState({
    name: "",
    category: "TAZA",
    material: "OTRO",
    description: "",
    featured: false,
  });

  const [variantForm, setVariantForm] = useState({
    size: "",
    color: "",
    stock: 0,
    base_price: 0,
    compare_price: 0,
  });

  const openCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "TAZA",
      material: "OTRO",
      description: "",
      featured: false,
    });
    setFile(null);
    setPreview(null);
    setShowProductModal(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      material: product.material ?? "OTRO",
      description: product.description ?? "",
      featured: product.featured ?? false,
    });
    setFile(null);
    setPreview(product.image_url ?? null);
    setShowProductModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const openCreateVariant = (productId: string) => {
    setEditingVariant(null);
    setSelectedProductId(productId);
    setVariantForm({
      size: "",
      color: "",
      stock: 0,
      base_price: 0,
      compare_price: 0,
    });
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
      compare_price: variant.compare_price ?? 0,
    });
    setShowVariantModal(true);
  };

  const handleProductSubmit = async () => {
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("category", productForm.category);
    formData.append("material", productForm.material);
    if (productForm.description)
      formData.append("description", productForm.description);
    formData.append("featured", String(productForm.featured));
    if (file) formData.append("image", file);

    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, formData });
    } else {
      await createProduct.mutateAsync(formData);
    }
    setShowProductModal(false);
  };

  const handleVariantSubmit = async () => {
    const data = {
      size: variantForm.size,
      color: variantForm.color,
      stock: variantForm.stock,
      base_price: variantForm.base_price,
      compare_price:
        variantForm.compare_price > 0 ? variantForm.compare_price : null,
    };

    if (editingVariant) {
      await updateVariant.mutateAsync({
        productId: selectedProductId,
        variantId: editingVariant.id,
        data,
      });
    } else {
      await createVariant.mutateAsync({
        productId: selectedProductId,
        data,
      });
    }
    setShowVariantModal(false);
  };

  const handleToggleProduct = async (product: Product) => {
    const formData = new FormData();
    formData.append("active", String(!product.active));

    await updateProduct.mutateAsync({
      id: product.id,
      formData,
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
                  onClick={() => openDesignsModal(product)}
                >
                  <Palette className="h-3 w-3 mr-1" />
                  Diseños
                </Button>
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
              <Label>Material</Label>
              <select
                value={productForm.material}
                onChange={(e) =>
                  setProductForm({ ...productForm, material: e.target.value })
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring text-foreground"
              >
                {materials.map((mat) => (
                  <option
                    key={mat}
                    value={mat}
                    className="bg-background text-foreground"
                  >
                    {mat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>
                Imagen{" "}
                <span className="text-muted-foreground text-xs">
                  {editingProduct ? "(opcional)" : "(opcional)"}
                </span>
              </Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80 cursor-pointer"
              />
              {preview && (
                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
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

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={productForm.featured}
              onChange={(e) =>
                setProductForm({ ...productForm, featured: e.target.checked })
              }
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="featured">Producto destacado ⭐</Label>
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
            <div className="space-y-2">
              <Label>
                Precio antes de oferta{" "}
                <span className="text-xs text-muted-foreground">
                  (opcional)
                </span>
              </Label>
              <Input
                type="number"
                min={0}
                value={variantForm.compare_price}
                onChange={(e) =>
                  setVariantForm({
                    ...variantForm,
                    compare_price: Number(e.target.value),
                  })
                }
                placeholder="Ej: 200.00"
              />
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
      {/* Modal Diseños */}
      <Dialog open={showDesignsModal} onOpenChange={setShowDesignsModal}>
        <DialogContent className="bg-background border w-full sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Diseños de {designProduct?.name}</DialogTitle>
          </DialogHeader>

          {!allDesigns?.length ? (
            <p className="text-sm text-muted-foreground">
              No hay diseños creados aún.
            </p>
          ) : (
            <>
              <Input
                placeholder="Buscar diseño por nombre..."
                value={designSearch}
                onChange={(e) => setDesignSearch(e.target.value)}
                className="mb-1"
              />

              {(() => {
                const filtered = allDesigns
                  .filter((d) =>
                    d.name
                      .toLowerCase()
                      .includes(designSearch.toLowerCase().trim()),
                  )
                  .sort((a, b) => {
                    const aAssigned = assignedDesigns?.some(
                      (pd) => pd.design.id === a.id,
                    );
                    const bAssigned = assignedDesigns?.some(
                      (pd) => pd.design.id === b.id,
                    );
                    return aAssigned === bAssigned ? 0 : aAssigned ? -1 : 1;
                  });

                if (!filtered.length) {
                  return (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      Ningún diseño coincide con &quot;{designSearch}&quot;.
                    </p>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filtered.map((design) => {
                      const assigned = assignedDesigns?.find(
                        (pd) => pd.design.id === design.id,
                      );

                      return (
                        <div
                          key={design.id}
                          className={`border rounded-lg p-3 space-y-2 ${
                            assigned ? "border-brand-primary" : "border-border"
                          }`}
                        >
                          <div className="flex gap-2">
                            <div className="relative h-14 w-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={design.image_url}
                                alt={design.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {design.name}
                              </p>
                              {assigned && (
                                <p className="text-xs text-brand-primary">
                                  Asignado — extra: $
                                  {Number(assigned.extra_price).toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>

                          {assigned ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-red-600 hover:text-red-700"
                              disabled={removeDesign.isPending}
                              onClick={() =>
                                designProduct &&
                                removeDesign.mutate({
                                  productId: designProduct.id,
                                  designId: design.id,
                                })
                              }
                            >
                              <X className="h-3 w-3 mr-1" />
                              Quitar
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                min={0}
                                placeholder="Extra $"
                                className="h-8 text-xs flex-1 min-w-0"
                                value={extraPriceDrafts[design.id] ?? ""}
                                onChange={(e) =>
                                  setExtraPriceDrafts({
                                    ...extraPriceDrafts,
                                    [design.id]: Number(e.target.value),
                                  })
                                }
                              />
                              <Button
                                size="sm"
                                className="h-8 flex-shrink-0"
                                disabled={assignDesign.isPending}
                                onClick={() =>
                                  designProduct &&
                                  assignDesign.mutate({
                                    productId: designProduct.id,
                                    designId: design.id,
                                    extra_price:
                                      extraPriceDrafts[design.id] || undefined,
                                  })
                                }
                              >
                                Asignar
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
