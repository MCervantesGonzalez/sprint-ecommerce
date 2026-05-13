export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Envíos y Devoluciones
        </h1>
        <p className="text-muted-foreground text-lg">
          Todo lo que necesitas saber sobre tu pedido
        </p>
      </div>

      {/* Envíos */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Envíos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded-xl p-5 space-y-2 text-center">
            <p className="text-3xl">📦</p>
            <p className="font-semibold">Tiempo de producción</p>
            <p className="text-sm text-muted-foreground">3 a 5 días hábiles</p>
          </div>
          <div className="border rounded-xl p-5 space-y-2 text-center">
            <p className="text-3xl">🚚</p>
            <p className="font-semibold">Tiempo de entrega</p>
            <p className="text-sm text-muted-foreground">2 a 4 días hábiles</p>
          </div>
          <div className="border rounded-xl p-5 space-y-2 text-center">
            <p className="text-3xl">🇲🇽</p>
            <p className="font-semibold">Cobertura</p>
            <p className="text-sm text-muted-foreground">
              Toda la república mexicana
            </p>
          </div>
        </div>

        <div className="border rounded-xl p-6 space-y-3">
          <h3 className="font-semibold">¿Cómo rastrear mi pedido?</h3>
          <p className="text-sm text-muted-foreground">
            Una vez que tu pedido sea enviado recibirás un correo electrónico
            con el número de guía para rastrear tu paquete.
          </p>
        </div>
      </div>

      {/* Devoluciones */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Devoluciones</h2>

        <div className="border rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">¿Cuándo aplica una devolución?</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Producto dañado al momento de la entrega</li>
              <li>Producto incorrecto recibido</li>
              <li>Defecto de impresión o producción</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">¿Cuándo NO aplica una devolución?</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Cambio de opinión después de la compra</li>
              <li>Daño causado por mal uso del producto</li>
              <li>Más de 3 días después de recibir el pedido</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">¿Cómo solicitar una devolución?</h3>
            <p className="text-sm text-muted-foreground">
              Contáctanos por WhatsApp o correo electrónico dentro de los 3 días
              siguientes a la recepción con fotos del producto y tu número de
              orden. Te responderemos en menos de 24 horas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
