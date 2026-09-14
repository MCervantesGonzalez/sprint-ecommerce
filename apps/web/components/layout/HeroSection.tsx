import Image from "next/image";

export function HeroSection() {
  return (
    <section className="w-full">
      {/* Banner — el diseño ya incluye título, subtítulo e íconos */}
      <div className="relative w-full aspect-[8000/3334]">
        <Image
          src="/images/hero-banner.jpg"
          alt="Sprint Custom — Artículos personalizados: playeras, tazas, gorras y más"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
