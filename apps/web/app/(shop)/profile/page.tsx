"use client";

import { useState, useRef } from "react";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/hooks/useAddresses";

import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useMyOrders } from "@/hooks/useOrders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Address } from "@/types";
import {
  Camera,
  User,
  Package,
  Phone,
  Mail,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  PROCESSING: "En proceso",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const { data: orders } = useMyOrders();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: addresses } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    zip_code: "",
  });

  const openCreateAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      label: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      zip_code: "",
    });
    setShowAddressModal(true);
  };

  const openEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label ?? "",
      street: address.street,
      neighborhood: address.neighborhood ?? "",
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
    });
    setShowAddressModal(true);
  };

  const handleAddressSubmit = async () => {
    if (editingAddress) {
      await updateAddress.mutateAsync({
        id: editingAddress.id,
        data: addressForm,
      });
    } else {
      await createAddress.mutateAsync(addressForm);
    }
    setShowAddressModal(false);
  };

  const handleSetDefault = async (id: string) => {
    await updateAddress.mutateAsync({ id, data: { is_default: true } });
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm("¿Eliminar esta dirección?")) {
      await deleteAddress.mutateAsync(id);
    }
  };

  const handleEditStart = () => {
    setForm({
      name: profile?.name ?? "",
      phone: profile?.phone ?? "",
    });
    setEditing(true);
    setSuccess(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (!editing) {
      // Si no está en modo edición, subir avatar inmediatamente
      const formData = new FormData();
      formData.append("avatar", f);
      updateProfile.mutate(formData);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (form.name) formData.append("name", form.name);
    if (form.phone) formData.append("phone", form.phone);
    if (file) formData.append("avatar", file);

    await updateProfile.mutateAsync(formData);
    setEditing(false);
    setFile(null);
    setPreview(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const avatarSrc = preview ?? profile?.avatar_url;
  const initials = profile?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-8">
        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      {/* Avatar y nombre */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div
            className="h-28 w-28 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-background shadow-lg cursor-pointer"
            onClick={handleAvatarClick}
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={profile?.name ?? "Avatar"}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-muted-foreground">
                {initials}
              </span>
            )}
          </div>
          <button
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/80 transition-colors"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold">{profile?.name}</h1>
          <p className="text-muted-foreground">{profile?.email}</p>
          {profile?.role === "ADMIN" && (
            <Badge className="mt-1 bg-primary text-primary-foreground">
              Admin
            </Badge>
          )}
        </div>
      </div>

      {/* Mensaje de éxito */}
      {success && (
        <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl text-center">
          ✅ Perfil actualizado correctamente
        </div>
      )}

      {/* Info del perfil */}
      <div className="border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Información personal
          </h2>
          {!editing ? (
            <Button variant="outline" size="sm" onClick={handleEditStart}>
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setFile(null);
                  setPreview(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre completo</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="3311223344"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profile?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profile?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {profile?.phone ?? "No registrado"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Direcciones guardadas */}
      <div className="border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Direcciones guardadas
          </h2>
          <Button variant="outline" size="sm" onClick={openCreateAddress}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>

        {!addresses?.length ? (
          <p className="text-sm text-muted-foreground">
            No tienes direcciones guardadas.
          </p>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-start justify-between gap-3 p-3 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      {address.label || "Dirección"}
                    </p>
                    {address.is_default && (
                      <Badge className="bg-brand-primary text-white text-xs">
                        Predeterminada
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {address.street}
                    {address.neighborhood &&
                      `, Col. ${address.neighborhood}`}, {address.city},{" "}
                    {address.state}, CP {address.zip_code}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!address.is_default && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="Marcar como predeterminada"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      <Star className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => openEditAddress(address)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial de compras */}
      <div className="border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Historial de compras
          </h2>
          <Link href="/orders">
            <Button variant="ghost" size="sm">
              Ver todas
            </Button>
          </Link>
        </div>

        {!orders?.length ? (
          <p className="text-sm text-muted-foreground">
            No tienes compras aún.
          </p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="flex items-center justify-between py-2 border-b last:border-0 hover:opacity-70 transition-opacity">
                  <div>
                    <p className="text-sm font-medium">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                    <p className="font-bold text-sm">
                      ${Number(order.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* Modal de dirección */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="bg-background border">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Editar dirección" : "Nueva dirección"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Etiqueta{" "}
                <span className="text-muted-foreground text-xs">
                  (opcional)
                </span>
              </Label>
              <Input
                value={addressForm.label}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, label: e.target.value })
                }
                placeholder="Ej: Casa, Trabajo"
              />
            </div>
            <div className="space-y-2">
              <Label>Calle y número</Label>
              <Input
                value={addressForm.street}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, street: e.target.value })
                }
                placeholder="Ej: Av. Chapultepec 4563"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Colonia{" "}
                <span className="text-muted-foreground text-xs">
                  (opcional)
                </span>
              </Label>
              <Input
                value={addressForm.neighborhood}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    neighborhood: e.target.value,
                  })
                }
                placeholder="Ej: Americana"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ciudad</Label>
                <Input
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                  placeholder="Ej: Guadalajara"
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, state: e.target.value })
                  }
                  placeholder="Ej: Jalisco"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Código Postal</Label>
              <Input
                value={addressForm.zip_code}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    zip_code: e.target.value,
                  })
                }
                maxLength={5}
                placeholder="Ej: 44160"
              />
            </div>
            <Button
              className="w-full"
              onClick={handleAddressSubmit}
              disabled={createAddress.isPending || updateAddress.isPending}
            >
              {editingAddress ? "Guardar cambios" : "Agregar dirección"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
