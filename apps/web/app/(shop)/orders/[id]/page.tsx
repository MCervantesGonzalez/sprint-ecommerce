"use client";

import { useParams } from "next/navigation";
import { useOrder } from "@/hooks/useOrders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard } from "lucide-react";

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

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 p-3 sm:p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12 px-3 sm:px-6">
        <p className="text-sm sm:text-base text-muted-foreground">
          Orden no encontrada.
        </p>
        <Button asChild className="mt-4">
          <Link href="/orders">Ver mis órdenes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h1 className="text-lg sm:text-2xl font-bold break-all">
              Orden #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <Badge className={statusColors[order.status]} variant="secondary">
              {statusLabels[order.status]}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="border rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold">Productos</h2>
        <div className="space-y-3 sm:space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                {item.design?.image_url ? (
                  <Image
                    src={item.design.image_url}
                    alt={item.design.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl">
                    ☕
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base">
                  {item.snapshot_name}
                </p>
                {item.design && (
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    Diseño: {item.design.name}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground">
                  x{item.quantity} — ${Number(item.unit_price).toFixed(2)} c/u
                </p>
              </div>
              <p className="font-bold text-sm sm:text-base whitespace-nowrap">
                ${(Number(item.unit_price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 sm:pt-4 flex justify-between font-bold text-base sm:text-lg">
          <span>Total</span>
          <span>${Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      {/* Info de envío */}
      <div className="border rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <h2 className="text-base sm:text-lg font-semibold">
            Dirección de envío
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {order.shipping_address}
        </p>
      </div>

      {/* Info de pago */}
      {order.mp_payment_id && (
        <div className="border rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <h2 className="text-base sm:text-lg font-semibold">Pago</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            ID de pago: {order.mp_payment_id}
          </p>
        </div>
      )}

      {/* Si está pendiente de pago */}
      {order.status === "PENDING" && order.mp_preference_id && (
        <div className="border rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 border-yellow-200 bg-yellow-50">
          <p className="text-xs sm:text-sm text-yellow-800 font-medium">
            Tu orden está pendiente de pago
          </p>
          <Button asChild className="w-full">
            <a
              href={
                "https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=" +
                order.mp_preference_id
              }
            >
              Completar pago
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
