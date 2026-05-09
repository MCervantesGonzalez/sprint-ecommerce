"use client";

import { useState } from "react";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

const nextStatus: Record<string, string> = {
  PAID: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED",
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const { data, isLoading } = useAdminOrders(statusFilter);
  const updateStatus = useUpdateOrderStatus();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Órdenes</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!statusFilter ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter(undefined)}
        >
          Todas
        </Button>
        {Object.entries(statusLabels).map(([status, label]) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Tabla */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-4 font-medium">ID</th>
              <th className="text-left p-4 font-medium">Cliente</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Total</th>
              <th className="text-left p-4 font-medium">Fecha</th>
              <th className="text-left p-4 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((order: any) => (
              <tr
                key={order.id}
                className="border-b last:border-0 hover:bg-muted/30"
              >
                <td className="p-4 font-mono">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="p-4">
                  <p className="font-medium">{order.user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.user?.email}
                  </p>
                </td>
                <td className="p-4">
                  <Badge className={statusColors[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                </td>
                <td className="p-4 font-bold">
                  ${Number(order.total).toFixed(2)}
                </td>
                <td className="p-4 text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("es-MX")}
                </td>
                <td className="p-4">
                  {nextStatus[order.status] && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updateStatus.isPending}
                      onClick={() =>
                        updateStatus.mutate({
                          orderId: order.id,
                          status: nextStatus[order.status],
                        })
                      }
                    >
                      → {statusLabels[nextStatus[order.status]]}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        {data?.meta && (
          <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
            <span>{data.meta.total} órdenes en total</span>
            <span>
              Página {data.meta.page} de {data.meta.totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
