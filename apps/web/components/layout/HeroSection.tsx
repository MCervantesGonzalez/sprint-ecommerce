import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full h-[85vh] min-h-[500px] flex items-end overflow-hidden">
      {/* Imagen de fondo — placeholder gris con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900" />

      {/* Overlay para legibilidad */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 w-full">
        <div className="max-w-xl space-y-4">
          <p className="text-sm font-medium text-white/70 uppercase tracking-widest">
            Diseños únicos para ti
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
            Personaliza
            <br />
            tu estilo
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Tazas, playeras, hoodies y más con los diseños que amas. Elige tu
            producto y hazlo tuyo.
          </p>
          <div className="flex gap-3 pt-2">
            <Button size="lg" asChild>
              <Link href="/#catalogo">Ver catálogo</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-black"
              asChild
            >
              <Link href="/designs">Ver diseños</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
