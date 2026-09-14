import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion, Palette, Ruler, Send } from "lucide-react";

const STEPS = [
  {
    icon: Palette,
    title: "Elige tu técnica",
    description:
      "Sublimación, DTF textil, vinil textil o DTF UV — según el producto y material que quieras personalizar.",
  },
  {
    icon: Ruler,
    title: "Comparte tu idea",
    description:
      "Mándanos tu diseño, logo o referencia. Si no tienes uno listo, te ayudamos a crearlo desde cero.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Cotización y ajustes",
    description:
      "Te confirmamos tiempos, precio y detalles del acabado antes de producir tu pedido.",
  },
  {
    icon: Send,
    title: "Producción y entrega",
    description:
      "Una vez aprobado el diseño, lo producimos y coordinamos el envío a todo México.",
  },
];

export default function CustomOrderPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Solicita tu producto personalizado
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          ¿Tienes una idea que no está en el catálogo? Así de fácil es pedir
          algo hecho a tu manera.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {STEPS.map((step, index) => (
          <div key={step.title} className="flex gap-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <step.icon className="h-5 w-5 text-brand-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-brand-medium">
                Paso {index + 1}
              </p>
              <h2 className="font-bold">{step.title}</h2>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-dark/5 rounded-xl p-6 sm:p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">¿Listo para empezar?</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Contáctanos y cuéntanos qué tienes en mente — te asesoramos según el
          material y la técnica que mejor le quede a tu idea.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            size="lg"
            className="bg-brand-primary hover:bg-brand-primary-hover text-white"
            asChild
          >
            <Link href="/contact">Contáctanos</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/personalization">Ver técnicas disponibles</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
