export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-8 py-4 sm:py-8 px-3 sm:px-6">
      <div className="text-center space-y-2 sm:space-y-4">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
          Envíos y Devoluciones
        </h1>
        <p className="text-sm sm:text-lg text-muted-foreground">
          Todo lo que necesitas saber sobre tu pedido
        </p>
      </div>

      {/* Envíos */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-2xl font-semibold">Envíos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          <div className="border rounded-lg sm:rounded-xl p-3 sm:p-5 space-y-1 sm:space-y-2 text-center">
            <p className="text-2xl sm:text-3xl">📦</p>
            <p className="font-semibold text-xs sm:text-base">
              Tiempo de producción
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              3 a 5 días hábiles
            </p>
          </div>
          <div className="border rounded-lg sm:rounded-xl p-3 sm:p-5 space-y-1 sm:space-y-2 text-center">
            <p className="text-2xl sm:text-3xl">🚚</p>
            <p className="font-semibold text-xs sm:text-base">
              Tiempo de entrega
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              2 a 4 días hábiles
            </p>
          </div>
          <div className="border rounded-lg sm:rounded-xl p-3 sm:p-5 space-y-1 sm:space-y-2 text-center">
            <p className="text-2xl sm:text-3xl">🇲🇽</p>
            <p className="font-semibold text-xs sm:text-base">Cobertura</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Toda la república mexicana
            </p>
          </div>
        </div>

        <div className="border rounded-lg sm:rounded-xl p-3 sm:p-6 space-y-2 sm:space-y-3">
          <h3 className="font-semibold text-sm sm:text-base">
            ¿Cómo rastrear mi pedido?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Una vez que tu pedido sea enviado recibirás un correo electrónico
            con el número de guía para rastrear tu paquete.
          </p>
        </div>
      </div>

      {/* Devoluciones */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-2xl font-semibold">Devoluciones</h2>

        <div className="border rounded-lg sm:rounded-xl p-3 sm:p-6 space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="font-semibold text-sm sm:text-base">
              ¿Cuándo aplica una devolución?
            </h3>
            <ul className="text-xs sm:text-sm text-muted-foreground space-y-0.5 sm:space-y-1 list-disc list-inside">
              <li>Producto dañado al momento de la entrega</li>
              <li>Producto incorrecto recibido</li>
              <li>Defecto de impresión o producción</li>
            </ul>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="font-semibold text-sm sm:text-base">
              ¿Cuándo NO aplica una devolución?
            </h3>
            <ul className="text-xs sm:text-sm text-muted-foreground space-y-0.5 sm:space-y-1 list-disc list-inside">
              <li>Cambio de opinión después de la compra</li>
              <li>Daño causado por mal uso del producto</li>
              <li>Más de 3 días después de recibir el pedido</li>
            </ul>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="font-semibold text-sm sm:text-base">
              ¿Cómo solicitar una devolución?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
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
