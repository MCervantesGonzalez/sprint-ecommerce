"use client";

import { useAdminDashboard } from "@/hooks/useAdmin";
import { StatCard } from "@/components/admin/StatCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
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

export default function DashboardPage() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Órdenes totales"
          value={data?.orders.total ?? 0}
          icon={ShoppingBag}
          color="text-blue-500"
        />
        <StatCard
          title="Ingresos totales"
          value={`$${Number(data?.revenue.total ?? 0).toFixed(2)}`}
          description="Solo órdenes pagadas"
          icon={DollarSign}
          color="text-green-500"
        />
        <StatCard
          title="Órdenes pagadas"
          value={data?.orders.byStatus.PAID ?? 0}
          icon={TrendingUp}
          color="text-purple-500"
        />
        <StatCard
          title="Stock bajo"
          value={data?.lowStockCount ?? 0}
          description="Variantes con stock ≤ 5"
          icon={AlertTriangle}
          color="text-orange-500"
        />
      </div>

      {/* Órdenes por status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Órdenes por status</h2>
          <div className="space-y-2">
            {data?.orders.byStatus &&
              Object.entries(data.orders.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <Badge className={statusColors[status]}>
                    {statusLabels[status]}
                  </Badge>
                  <span className="font-semibold">{count as number}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Órdenes recientes */}
        <div className="border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Órdenes recientes</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-primary hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {data?.recentOrders.map((order: any) => (
              <Link key={order.id} href={`/admin/orders`}>
                <div className="flex items-center justify-between py-2 border-b last:border-0 hover:opacity-70 transition-opacity">
                  <div>
                    <p className="text-sm font-medium">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.user?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                    <p className="text-sm font-bold mt-1">
                      ${Number(order.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
