"use client";
import { Truck, ShieldCheck, Star } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Envíos a todo México",
    description: "Entrega en 5-7 días hábiles",
  },
  {
    icon: ShieldCheck,
    title: "Compra protegida",
    description: "Pagos seguros con MercadoPago",
  },
  {
    icon: Star,
    title: "Diseños exclusivos",
    description: "Catálogo único y en constante crecimiento",
  },
];

export function BenefitsBar() {
  return (
    <div className="border-y bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="flex flex-col items-center text-center gap-2"
              >
                <Icon className="h-6 w-6 text-primary" />
                <p className="font-semibold text-sm">{benefit.title}</p>
                <p className="text-xs text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
