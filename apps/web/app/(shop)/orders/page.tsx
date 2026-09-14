"use client";

import { useMyOrders } from "@/hooks/useOrders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

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

export default function OrdersPage() {
  const { data: orders, isLoading } = useMyOrders();

  if (isLoading) {
    return (
      <div className="space-y-4 p-3 sm:p-6">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-24 gap-4 px-3 sm:px-6">
        <ShoppingBag className="h-12 sm:h-16 w-12 sm:w-16 text-muted-foreground" />
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          No tienes órdenes aún
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground text-center">
          Cuando realices una compra aparecerá aquí
        </p>
        <Button asChild>
          <Link href="/">Ver productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 p-3 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Mis órdenes</h1>

      <div className="space-y-3 sm:space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <div className="border rounded-lg sm:rounded-xl p-3 sm:p-5 hover:border-primary transition-colors space-y-2 sm:space-y-3 cursor-pointer">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-xs sm:text-sm text-muted-foreground">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <Badge
                  className={statusColors[order.status]}
                  variant="secondary"
                >
                  {statusLabels[order.status]}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {order.items.length} producto
                  {order.items.length !== 1 ? "s" : ""}
                </p>
                <p className="font-bold text-base sm:text-lg">
                  ${Number(order.total).toFixed(2)}
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
