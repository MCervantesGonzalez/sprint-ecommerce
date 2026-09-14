"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAddresses, useCreateAddress } from "@/hooks/useAddresses";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MapPin } from "lucide-react";
import Image from "next/image";
import { Address } from "@/types";

interface NewAddressForm {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
}

interface GuestContactForm {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
}

const emptyForm: NewAddressForm = {
  street: "",
  neighborhood: "",
  city: "",
  state: "",
  zip_code: "",
};

const emptyGuestForm: GuestContactForm = {
  guest_name: "",
  guest_email: "",
  guest_phone: "",
};

function buildShippingAddress(a: {
  street: string;
  neighborhood?: string | null;
  city: string;
  state: string;
  zip_code: string;
}) {
  return [
    a.street,
    a.neighborhood ? `Col. ${a.neighborhood}` : null,
    a.city,
    a.state,
    `CP ${a.zip_code}`,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: cart, isLoading } = useCart();
  const { data: addresses, isLoading: loadingAddresses } = useAddresses();
  const createAddress = useCreateAddress();
  const { clearGuestCart } = useCartStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState<NewAddressForm>(emptyForm);
  const [guestForm, setGuestForm] = useState<GuestContactForm>(emptyGuestForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Preselecciona la dirección default (o la primera) cuando cargan — solo logueado
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!addresses?.length) {
      setShowNewForm(true);
      return;
    }
    if (!selectedId) {
      const def = addresses.find((a) => a.is_default) ?? addresses[0];
      setSelectedId(def.id);
    }
  }, [isAuthenticated, addresses, selectedId]);

  const validateAddressForm = () => {
    if (newForm.street.trim().length < 5) return "Ingresa la calle y número";
    if (newForm.city.trim().length < 2) return "Ingresa la ciudad";
    if (newForm.state.trim().length < 2) return "Ingresa el estado";
    if (newForm.zip_code.trim().length !== 5)
      return "El código postal debe tener 5 dígitos";
    return null;
  };

  const validateGuestForm = () => {
    if (guestForm.guest_name.trim().length < 2) return "Ingresa tu nombre";
    if (!/^\S+@\S+\.\S+$/.test(guestForm.guest_email))
      return "Ingresa un email válido";
    return null;
  };

  const handleSubmitLoggedIn = async () => {
    let shipping_address: string;

    if (showNewForm) {
      const validationError = validateAddressForm();
      if (validationError) {
        setError(validationError);
        return;
      }
      shipping_address = buildShippingAddress(newForm);
    } else {
      const selected = addresses?.find((a) => a.id === selectedId);
      if (!selected) {
        setError("Selecciona una dirección de envío");
        return;
      }
      shipping_address = buildShippingAddress(selected);
    }

    setSubmitting(true);
    try {
      if (showNewForm) {
        await createAddress.mutateAsync(newForm);
      }

      const orderRes = await api.post("/orders", { shipping_address });
      const order = orderRes.data;

      const prefRes = await api.post(`/payments/create-preference/${order.id}`);
      window.location.href = prefRes.data.init_point;
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al procesar el pedido");
      setSubmitting(false);
    }
  };

  const handleSubmitGuest = async () => {
    const guestError = validateGuestForm();
    if (guestError) {
      setError(guestError);
      return;
    }
    const addressError = validateAddressForm();
    if (addressError) {
      setError(addressError);
      return;
    }

    setSubmitting(true);
    try {
      const shipping_address = buildShippingAddress(newForm);

      const items = (cart?.items ?? []).map((item) => ({
        variantId: item.variant.id,
        designId: item.design?.id,
        quantity: item.quantity,
      }));

      const orderRes = await api.post("/orders/guest", {
        ...guestForm,
        shipping_address,
        items,
      });
      const order = orderRes.data;

      const prefRes = await api.post(
        `/payments/create-guest-preference/${order.id}`,
        { guest_email: guestForm.guest_email },
      );

      // El carrito local ya cumplió su propósito
      clearGuestCart();

      window.location.href = prefRes.data.init_point;
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al procesar el pedido");
      setSubmitting(false);
    }
  };

  const handleSubmit = () => {
    setError(null);
    if (isAuthenticated) {
      handleSubmitLoggedIn();
    } else {
      handleSubmitGuest();
    }
  };

  if (isLoading || (isAuthenticated && loadingAddresses)) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 p-3 sm:p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!cart?.items.length) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-8 p-3 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Formulario */}
        <div className="border rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          {error && (
            <div className="p-2 sm:p-3 text-xs sm:text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {!isAuthenticated && (
            <>
              <h2 className="text-lg sm:text-xl font-semibold">Tus datos</h2>
              <p className="text-xs text-muted-foreground -mt-2">
                Comprando como invitado —{" "}
                <a href="/login" className="text-brand-primary hover:underline">
                  inicia sesión
                </a>{" "}
                si ya tienes cuenta.
              </p>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm sm:text-base">Nombre completo</Label>
                <Input
                  placeholder="Juan Pérez"
                  className="text-sm sm:text-base h-9 sm:h-10"
                  value={guestForm.guest_name}
                  onChange={(e) =>
                    setGuestForm({ ...guestForm, guest_name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm sm:text-base">Email</Label>
                  <Input
                    type="email"
                    placeholder="juan@example.com"
                    className="text-sm sm:text-base h-9 sm:h-10"
                    value={guestForm.guest_email}
                    onChange={(e) =>
                      setGuestForm({
                        ...guestForm,
                        guest_email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm sm:text-base">
                    Teléfono{" "}
                    <span className="text-muted-foreground text-xs">
                      (opcional)
                    </span>
                  </Label>
                  <Input
                    placeholder="3311223344"
                    className="text-sm sm:text-base h-9 sm:h-10"
                    value={guestForm.guest_phone}
                    onChange={(e) =>
                      setGuestForm({
                        ...guestForm,
                        guest_phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}

          <h2 className="text-lg sm:text-xl font-semibold pt-2">
            Dirección de envío
          </h2>

          {/* Direcciones guardadas — solo logueado */}
          {isAuthenticated && !!addresses?.length && (
            <div className="space-y-2">
              {addresses.map((address: Address) => (
                <div
                  key={address.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedId(address.id);
                    setShowNewForm(false);
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (setSelectedId(address.id), setShowNewForm(false))
                  }
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    !showNewForm && selectedId === address.id
                      ? "border-brand-primary ring-1 ring-brand-primary"
                      : "hover:border-brand-primary border-border"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-medium flex-shrink-0" />
                    <p className="text-sm font-medium">
                      {address.label || "Dirección"}
                    </p>
                    {address.is_default && (
                      <span className="text-xs text-brand-primary font-medium">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    {address.street}
                    {address.neighborhood &&
                      `, Col. ${address.neighborhood}`}, {address.city},{" "}
                    {address.state}, CP {address.zip_code}
                  </p>
                </div>
              ))}

              <div
                role="button"
                tabIndex={0}
                onClick={() => setShowNewForm(true)}
                onKeyDown={(e) => e.key === "Enter" && setShowNewForm(true)}
                className={`cursor-pointer rounded-lg border p-3 flex items-center gap-2 transition-colors ${
                  showNewForm
                    ? "border-brand-primary ring-1 ring-brand-primary"
                    : "hover:border-brand-primary border-border"
                }`}
              >
                <Plus className="h-4 w-4 text-brand-medium" />
                <p className="text-sm font-medium">Usar una dirección nueva</p>
              </div>
            </div>
          )}

          {/* Formulario de dirección — invitado siempre, logueado si eligió "nueva" */}
          {(!isAuthenticated || showNewForm) && (
            <div className="space-y-3 sm:space-y-4 pt-2">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm sm:text-base">Calle y número</Label>
                <Input
                  placeholder="Ej: Av. Chapultepec 4563"
                  className="text-sm sm:text-base h-9 sm:h-10"
                  value={newForm.street}
                  onChange={(e) =>
                    setNewForm({ ...newForm, street: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm sm:text-base">
                  Colonia o barrio{" "}
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    (opcional)
                  </span>
                </Label>
                <Input
                  placeholder="Ej: Col. Americana"
                  className="text-sm sm:text-base h-9 sm:h-10"
                  value={newForm.neighborhood}
                  onChange={(e) =>
                    setNewForm({ ...newForm, neighborhood: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm sm:text-base">Ciudad</Label>
                  <Input
                    placeholder="Ej: Guadalajara"
                    className="text-sm sm:text-base h-9 sm:h-10"
                    value={newForm.city}
                    onChange={(e) =>
                      setNewForm({ ...newForm, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm sm:text-base">Estado</Label>
                  <Input
                    placeholder="Ej: Jalisco"
                    className="text-sm sm:text-base h-9 sm:h-10"
                    value={newForm.state}
                    onChange={(e) =>
                      setNewForm({ ...newForm, state: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm sm:text-base">Código Postal</Label>
                <Input
                  placeholder="Ej: 44160"
                  maxLength={5}
                  className="text-sm sm:text-base h-9 sm:h-10"
                  value={newForm.zip_code}
                  onChange={(e) =>
                    setNewForm({ ...newForm, zip_code: e.target.value })
                  }
                />
              </div>
              {isAuthenticated && (
                <p className="text-xs text-muted-foreground">
                  Esta dirección se guardará en tu perfil para la próxima vez.
                </p>
              )}
            </div>
          )}

          <Button
            className="w-full text-sm sm:text-base h-9 sm:h-10"
            size="lg"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Procesando..." : "Pagar con MercadoPago"}
          </Button>
        </div>

        {/* Resumen */}
        <div className="border rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 h-fit sticky top-24">
          <h2 className="text-lg sm:text-xl font-semibold">
            Resumen del pedido
          </h2>

          <div className="space-y-2 sm:space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-2 sm:gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.design?.image_url ? (
                    <Image
                      src={item.design.image_url}
                      alt={item.design.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg sm:text-xl">
                      ☕
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">
                    {item.variant.color} — {item.variant.size}
                  </p>
                  {item.design && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.design.name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    x{item.quantity}
                  </p>
                </div>
                <p className="font-medium text-xs sm:text-sm whitespace-nowrap">
                  $
                  {(Number(item.variant.base_price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 sm:pt-4 flex justify-between font-bold text-base sm:text-lg">
            <span>Total</span>
            <span>${Number(cart.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
