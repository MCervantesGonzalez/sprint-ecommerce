import { ProductList } from "@/components/products/ProductList";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-end"></div>
      {/* Hero */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Productos Personalizados
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Elige un producto, selecciona tu diseño favorito y recíbelo en casa.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Catálogo</h2>
      </div>
      {/* Lista de productos */}
      <ProductList />
    </div>
  );
}
