import { ProductList } from "@/components/products/ProductList";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Productos Personalizados
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Elige un producto, selecciona tu diseño favorito y recíbelo en casa.
          Tazas, playeras, hoodies y más.
        </p>
      </div>

      {/* Destacados */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">⭐ Los más elegidos</h2>
        </div>
        <FeaturedProducts />
      </div>

      {/* Catálogo completo */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Catálogo</h2>
          <p className="text-sm text-muted-foreground">Todos los productos</p>
        </div>
        <ProductList />
      </div>
    </div>
  );
}
