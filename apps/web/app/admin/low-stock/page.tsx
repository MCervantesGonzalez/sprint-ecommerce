"use client";

import { useState } from "react";
import { useLowStock } from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export default function LowStockPage() {
  const [threshold, setThreshold] = useState(10);
  const { data, isLoading } = useLowStock(threshold);

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Stock bajo</h1>
        <div className="flex items-center gap-3">
          <Label htmlFor="threshold" className="text-sm">
            Umbral
          </Label>
          <Input
            id="threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-20"
            min={0}
          />
        </div>
      </div>

      {/* Resumen */}
      <div className="flex items-center gap-2 p-4 bg-orange-50 border border-orange-200 rounded-xl">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <p className="text-sm text-orange-800">
          <span className="font-bold">{data?.total ?? 0}</span> variantes con
          stock igual o menor a <span className="font-bold">{threshold}</span>{" "}
          unidades
        </p>
      </div>

      {/* Tabla */}
      {!data?.data.length ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No hay variantes con stock bajo para este umbral.
          </p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-medium">Producto</th>
                <th className="text-left p-4 font-medium">Variante</th>
                <th className="text-left p-4 font-medium">Stock</th>
                <th className="text-left p-4 font-medium">Precio</th>
                <th className="text-left p-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((variant: any) => (
                <tr
                  key={variant.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="p-4 font-medium">
                    {variant.product?.name ?? "—"}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {variant.color} — {variant.size}
                  </td>
                  <td className="p-4">
                    <span
                      className={`font-bold ${
                        variant.stock === 0
                          ? "text-red-600"
                          : variant.stock <= 5
                            ? "text-orange-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {variant.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    ${Number(variant.base_price).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <Badge
                      className={
                        variant.stock === 0
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    >
                      {variant.stock === 0 ? "Sin stock" : "Stock bajo"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
