"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/hooks/useCart";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const checkoutSchema = z.object({
  street: z.string().min(5, "Ingresa la calle y número"),
  neighborhood: z.string().optional(),
  city: z.string().min(2, "Ingresa la ciudad"),
  state: z.string().min(2, "Ingresa el estado"),
  zip_code: z
    .string()
    .min(5, "Ingresa el código postal")
    .max(5, "El código postal debe tener 5 dígitos"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    try {
      setError(null);

      // Concatenar dirección estructurada
      const shipping_address = [
        data.street,
        data.neighborhood ? `Col. ${data.neighborhood}` : null,
        data.city,
        data.state,
        `CP ${data.zip_code}`,
      ]
        .filter(Boolean)
        .join(", ");

      // 1. Crear la orden
      const orderRes = await api.post("/orders", { shipping_address });
      const order = orderRes.data;

      // 2. Crear preferencia de pago
      const prefRes = await api.post(`/payments/create-preference/${order.id}`);
      const { init_point } = prefRes.data;

      // 3. Redirigir a MercadoPago
      window.location.href = init_point;
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al procesar el pedido");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
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
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Dirección de envío</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            {/* Calle y número */}
            <div className="space-y-2">
              <Label htmlFor="street">Calle y número</Label>
              <Input
                id="street"
                placeholder="Ej: Av. Chapultepec 4563"
                {...register("street")}
              />
              {errors.street && (
                <p className="text-xs text-red-500">{errors.street.message}</p>
              )}
            </div>

            {/* Colonia */}
            <div className="space-y-2">
              <Label htmlFor="neighborhood">
                Colonia o barrio{" "}
                <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="neighborhood"
                placeholder="Ej: Col. Americana"
                {...register("neighborhood")}
              />
            </div>

            {/* Ciudad y Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  placeholder="Ej: Guadalajara"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  placeholder="Ej: Jalisco"
                  {...register("state")}
                />
                {errors.state && (
                  <p className="text-xs text-red-500">{errors.state.message}</p>
                )}
              </div>
            </div>

            {/* Código Postal */}
            <div className="space-y-2">
              <Label htmlFor="zip_code">Código Postal</Label>
              <Input
                id="zip_code"
                placeholder="Ej: 44160"
                maxLength={5}
                {...register("zip_code")}
              />
              {errors.zip_code && (
                <p className="text-xs text-red-500">
                  {errors.zip_code.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Pagar con MercadoPago"}
            </Button>
          </form>
        </div>

        {/* Resumen */}
        <div className="border rounded-xl p-6 space-y-4 h-fit sticky top-24">
          <h2 className="text-xl font-semibold">Resumen del pedido</h2>

          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.design?.image_url ? (
                    <Image
                      src={item.design.image_url}
                      alt={item.design.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      ☕
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {item.variant.color} — {item.variant.size}
                  </p>
                  {item.design && (
                    <p className="text-xs text-muted-foreground">
                      {item.design.name}
                    </p>
                  )}
                  <p className="text-sm">x{item.quantity}</p>
                </div>
                <p className="font-medium">
                  ${(item.variant.base_price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${Number(cart.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
