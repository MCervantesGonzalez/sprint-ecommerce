export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Aviso de Privacidad</h1>
        <p className="text-sm text-muted-foreground">
          Última actualización:{" "}
          {new Date().toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base text-muted-foreground">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            1. Responsable del tratamiento de datos
          </h2>
          <p>
            Sprint Custom, en adelante &quot;Sprint&quot;, es responsable del
            uso y protección de tus datos personales conforme a la Ley Federal
            de Protección de Datos Personales en Posesión de los Particulares
            (LFPDPPP).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            2. Datos que recopilamos
          </h2>
          <p>Recopilamos los siguientes datos cuando usas nuestro sitio:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Teléfono</li>
            <li>Dirección de envío</li>
            <li>
              Información de pago (procesada de forma segura por Mercado Pago;
              Sprint no almacena datos de tarjetas)
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            3. Finalidad del tratamiento
          </h2>
          <p>Tus datos se utilizan para:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Procesar y dar seguimiento a tus pedidos</li>
            <li>Gestionar tu cuenta y direcciones guardadas</li>
            <li>Enviarte notificaciones relacionadas con tu compra</li>
            <li>Brindarte soporte y atención al cliente</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            4. Derechos ARCO
          </h2>
          <p>
            Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte (derechos
            ARCO) al tratamiento de tus datos personales. Para ejercerlos,
            contáctanos a través de nuestra{" "}
            <a href="/contact" className="text-primary hover:underline">
              página de contacto
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            5. Uso de cookies
          </h2>
          <p>
            Utilizamos cookies esenciales para el funcionamiento del sitio
            (sesión, carrito de compras) y preferencias de visualización (modo
            oscuro/claro).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            6. Cambios a este aviso
          </h2>
          <p>
            Nos reservamos el derecho de actualizar este aviso de privacidad.
            Cualquier cambio será publicado en esta misma página.
          </p>
        </section>
      </div>
    </div>
  );
}
