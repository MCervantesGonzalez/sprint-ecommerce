const faqs = [
  {
    question: "¿Cuánto tiempo tarda mi pedido?",
    answer:
      "Los pedidos personalizados tienen un tiempo de producción de 3 a 5 días hábiles. Una vez enviado, el tiempo de entrega es de 2 a 4 días hábiles dependiendo de tu ubicación.",
  },
  {
    question: "¿Puedo cancelar o modificar mi pedido?",
    answer:
      "Puedes cancelar o modificar tu pedido dentro de las primeras 24 horas después de realizarlo. Una vez que el pedido entra en producción no es posible hacer cambios.",
  },
  {
    question: "¿Los colores del diseño son exactamente iguales a la pantalla?",
    answer:
      "Hacemos todo lo posible para que los colores sean fieles a la pantalla. Sin embargo, puede haber ligeras variaciones dependiendo de la calibración de tu monitor y el material del producto.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos pagos a través de MercadoPago, que incluye tarjetas de crédito y débito VISA y Mastercard, así como pagos en efectivo a través de OXXO.",
  },
  {
    question: "¿Hacen envíos a toda la república mexicana?",
    answer:
      "Sí, realizamos envíos a toda la república mexicana. El costo y tiempo de envío varía según tu ubicación.",
  },
  {
    question: "¿Qué pasa si mi producto llega dañado?",
    answer:
      "Si tu producto llega dañado, contáctanos dentro de los 3 días siguientes a la recepción con fotos del daño. Te enviaremos un reemplazo sin costo adicional.",
  },
  {
    question: "¿Puedo enviar mi propio diseño?",
    answer:
      "Por el momento solo trabajamos con los diseños de nuestro catálogo. Si tienes una propuesta de diseño puedes contactarnos y la evaluaremos para agregarla al catálogo.",
  },
  {
    question: "¿Los productos son lavables?",
    answer:
      "Sí. Las tazas son aptas para lavavajillas en la parte exterior. Las playeras y hoodies deben lavarse al revés en agua fría para preservar el diseño por más tiempo.",
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Preguntas Frecuentes
        </h1>
        <p className="text-muted-foreground text-lg">
          Resolvemos tus dudas más comunes
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-xl p-6 space-y-2">
            <h3 className="font-semibold">{faq.question}</h3>
            <p className="text-sm text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="text-center p-6 bg-muted/30 rounded-xl space-y-2">
        <p className="font-medium">¿No encontraste tu respuesta?</p>
        <p className="text-sm text-muted-foreground">
          Contáctanos directamente y te ayudamos.
        </p>
      </div>
    </div>
  );
}
