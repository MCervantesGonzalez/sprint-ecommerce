"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Order } from "@/types";

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  PROCESSING: "En proceso",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError(null);
    setOrder(null);
    setLoading(true);
    try {
      const { data } = await api.get("/orders/track", {
        params: { orderId: orderId.trim(), email: email.trim() },
      });
      setOrder(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "No encontramos una orden con esos datos",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Rastrea tu pedido</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Ingresa el número de orden y el correo con el que compraste
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {error && (
            <div className="p-2 sm:p-3 text-xs sm:text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-1.5 sm:space-y-2">
            <Label>Número de orden</Label>
            <Input
              placeholder="e39343d9-4e60-46b0-..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="juan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSearch}
            disabled={loading || !orderId || !email}
          >
            {loading ? "Buscando..." : "Buscar pedido"}
          </Button>
        </CardContent>
      </Card>

      {order && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Orden #{order.id.slice(0, 8).toUpperCase()}
              </CardTitle>
              <Badge className={statusColors[order.status]}>
                {statusLabels[order.status]}
              </Badge>
            </div>
            <CardDescription>
              {new Date(order.created_at).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm border-b pb-2 last:border-0"
                >
                  <span>
                    {item.snapshot_name} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Dirección de envío:</strong> {order.shipping_address}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
