import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Technique {
  name: string;
  description: string;
  products: string[];
}

const TECHNIQUES: Technique[] = [
  {
    name: "Sublimación",
    description:
      "Tinta que se fusiona directamente con la fibra del material mediante calor, logrando un acabado suave al tacto, de alta durabilidad y a todo color.",
    products: ["Tazas", "Cilindros", "Playeras blancas de poliéster"],
  },
  {
    name: "DTF Textil",
    description:
      "Impresión directa a film que se transfiere con calor sobre la prenda. Ideal para diseños detallados y a color en prendas de algodón o poliéster.",
    products: ["Prendas de algodón", "Prendas de poliéster"],
  },
  {
    name: "Vinil Textil",
    description:
      "Vinil de corte aplicado con calor, perfecto para diseños de colores sólidos, números y nombres con acabado mate o brillante duradero.",
    products: ["Prendas de algodón", "Prendas de poliéster"],
  },
  {
    name: "DTF UV",
    description:
      "Impresión UV de alta resistencia para superficies sólidas y rígidas, con excelente adherencia y acabado resistente a rayones.",
    products: ["Todo tipo de superficies sólidas"],
  },
];

export default function PersonalizationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Técnicas de personalización
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Elegimos la técnica según el producto y el tipo de diseño, para
          garantizar el mejor acabado y durabilidad en cada pieza.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {TECHNIQUES.map((technique) => (
          <Card key={technique.name}>
            <CardContent className="p-5 sm:p-6 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-brand-primary">
                {technique.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {technique.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {technique.products.map((product) => (
                  <Badge key={product} variant="secondary">
                    {product}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center space-y-3 pt-4">
        <p className="text-muted-foreground">
          ¿Ya sabes qué quieres personalizar?
        </p>
        <Button
          size="lg"
          className="bg-brand-primary hover:bg-brand-primary-hover text-white"
          asChild
        >
          <Link href="/custom-order">Solicitar mi diseño</Link>
        </Button>
      </div>
    </div>
  );
}
