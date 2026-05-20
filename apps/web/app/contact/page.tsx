"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const contactSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().email("Email inválido"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    // Por ahora simulamos el envío
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSent(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-8 py-4 sm:py-8 px-3 sm:px-6">
      <div className="text-center space-y-2 sm:space-y-4">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
          Contacto
        </h1>
        <p className="text-sm sm:text-lg text-muted-foreground">
          Estamos aquí para ayudarte
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {/* Info de contacto */}
        <div className="space-y-3 sm:space-y-6">
          <div className="border rounded-lg sm:rounded-xl p-3 sm:p-5 space-y-1 sm:space-y-2">
            <p className="text-xl sm:text-2xl">💬</p>
            <p className="font-semibold text-sm sm:text-base">WhatsApp</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Respuesta en menos de 2 horas
            </p>
            <a
              href="https://wa.me/5630605063"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-primary hover:underline"
            >
              Enviar mensaje
            </a>
          </div>

          <div className="border rounded-lg sm:rounded-xl p-3 sm:p-5 space-y-1 sm:space-y-2">
            <p className="text-xl sm:text-2xl">📧</p>
            <p className="font-semibold text-sm sm:text-base">Email</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Respuesta en menos de 24 horas
            </p>
            <a
              href="mailto:sprintpromocionales@gmail.com"
              className="text-xs sm:text-sm text-primary hover:underline"
            >
              sprintpromocionales@gmail.com
            </a>
          </div>

          <div className="border rounded-lg sm:rounded-xl p-3 sm:p-5 space-y-1 sm:space-y-2">
            <p className="text-xl sm:text-2xl">🕒</p>
            <p className="font-semibold text-sm sm:text-base">
              Horario de atención
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Lunes a Viernes: 9am — 6pm
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sábados: 10am — 2pm
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="border rounded-lg sm:rounded-xl p-3 sm:p-6">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 sm:gap-4 py-6 sm:py-8">
              <p className="text-3xl sm:text-4xl">✅</p>
              <p className="font-semibold text-base sm:text-lg">
                ¡Mensaje enviado!
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                Te responderemos a la brevedad.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 sm:space-y-4"
            >
              <h2 className="text-base sm:text-lg font-semibold">
                Envíanos un mensaje
              </h2>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">
                  Nombre
                </Label>
                <Input
                  id="name"
                  placeholder="Tu nombre"
                  className="text-sm sm:text-base h-9 sm:h-10"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name?.message}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="text-sm sm:text-base h-9 sm:h-10"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">
                    {errors.email?.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="message" className="text-sm sm:text-base">
                  Mensaje
                </Label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 resize-none"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-red-500">
                    {errors.message?.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full text-sm sm:text-base h-9 sm:h-10"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
