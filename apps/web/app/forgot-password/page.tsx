"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setError(null);
      await api.post("/auth/forgot-password", data);
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al procesar la solicitud");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-3 sm:p-6">
      <Card className="w-full max-w-md border-0 sm:border">
        <CardHeader className="space-y-1 px-4 sm:px-6 pt-6 sm:pt-8">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Recupera tu contraseña
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Ingresa tu correo y te enviaremos un enlace para restablecerla
          </CardDescription>
        </CardHeader>

        {sent ? (
          <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
            <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl text-center">
              Si el correo está registrado, te llegará un enlace de recuperación
              en unos minutos. Revisa también tu carpeta de spam.
            </div>
            <Link
              href="/login"
              className="block text-center text-sm text-primary hover:underline mt-4"
            >
              Volver a iniciar sesión
            </Link>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6 pb-2">
              {error && (
                <div className="p-2 sm:p-3 text-xs sm:text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@example.com"
                  className="text-sm sm:text-base h-9 sm:h-10"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-6 sm:pb-8 border-t border-border mt-2">
              <Button
                type="submit"
                className="w-full text-sm sm:text-base h-9 sm:h-10"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar enlace"}
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Volver a iniciar sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
