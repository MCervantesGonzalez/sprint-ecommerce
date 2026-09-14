"use client";

import { useState } from "react";
import {
  useAdminDesigns,
  useCreateDesign,
  useUpdateDesign,
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
import { Design } from "@/types";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const designCategories = [
  "POKEMON",
  "ANIME",
  "MUSICA",
  "YOGA",
  "FLORAL",
  "GEOMETRICO",
  "MINIMALISTA",
  "OTRO",
];

export default function AdminDesignsPage() {
  const { data: designs, isLoading } = useAdminDesigns();
  const createDesign = useCreateDesign();
  const updateDesign = useUpdateDesign();

  const [showModal, setShowModal] = useState(false);
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "OTRO",
  });
  const [file, setFile] = useState<File | null>(null);

  const openCreate = () => {
    setEditingDesign(null);
    setForm({ name: "", description: "", category: "OTRO" });
    setFile(null);
    setPreview(null);
    setShowModal(true);
  };

  const openEdit = (design: Design) => {
    setEditingDesign(design);
    setForm({
      name: design.name,
      description: design.description ?? "",
      category: design.category ?? "OTRO",
    });
    setFile(null);
    setPreview(design.image_url);
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      if (form.description) formData.append("description", form.description);
      if (file) formData.append("image", file);

      if (editingDesign) {
        await updateDesign.mutateAsync({
          id: editingDesign.id,
          data: formData,
          isFormData: true,
        });
      } else {
        if (!file) return;
        await createDesign.mutateAsync(formData);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar diseño:", error);
    }
  };

  const handleToggle = async (design: Design) => {
    try {
      await updateDesign.mutateAsync({
        id: design.id,
        data: {
          active: !design.active,
        },
      });
    } catch (error) {
      console.error("Error al actualizar diseño:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-3 sm:p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Diseños</h1>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo diseño
        </Button>
      </div>

      {!designs?.length ? (
        <div className="text-center py-12">
          <p className="text-sm sm:text-base text-muted-foreground">
            No hay diseños aún.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {designs.map((design: Design) => (
            <div
              key={design.id}
              className={`group border rounded-lg sm:rounded-xl overflow-hidden transition-all hover:shadow-lg ${
                !design.active ? "opacity-60" : ""
              }`}
            >
              <div className="relative w-full aspect-square bg-gray-100">
                <Image
                  src={design.image_url}
                  alt={design.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 sm:p-3 space-y-2">
                <div className="flex items-start justify-between gap-2 min-h-[2rem]">
                  <p className="font-medium text-xs sm:text-sm line-clamp-2 flex-1">
                    {design.name}
                  </p>
                  {!design.active && (
                    <Badge className="bg-gray-100 text-gray-600 text-xs shrink-0 whitespace-nowrap">
                      Inactivo
                    </Badge>
                  )}
                </div>
                {design.category && (
                  <Badge className="inline-block bg-blue-100 text-blue-800 text-xs">
                    {design.category}
                  </Badge>
                )}
                <div className="flex gap-1 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                    onClick={() => openEdit(design)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    <span className="hidden xs:inline">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                    onClick={() => handleToggle(design)}
                    title={design.active ? "Desactivar" : "Activar"}
                  >
                    {design.active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-background border w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editingDesign ? "Editar diseño" : "Nuevo diseño"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base">Nombre</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Diseño Floral"
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base">Categoría</Label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring"
              >
                {designCategories.map((cat) => (
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

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base">
                Descripción (opcional)
              </Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Ej: Patrón floral minimalista"
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base">
                Imagen{" "}
                <span className="text-muted-foreground text-xs sm:text-sm">
                  {editingDesign
                    ? "(opcional — deja vacío para mantener la actual)"
                    : "(requerido)"}
                </span>
              </Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs sm:text-sm text-muted-foreground file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80 cursor-pointer"
              />
              {preview && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <Button
              className="w-full text-sm sm:text-base h-9 sm:h-10"
              onClick={handleSubmit}
              disabled={
                createDesign.isPending ||
                updateDesign.isPending ||
                (!editingDesign && !file)
              }
            >
              {editingDesign ? "Guardar cambios" : "Crear diseño"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
