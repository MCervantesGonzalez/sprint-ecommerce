"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
    .regex(/[a-z]/, "Debe incluir al menos una minúscula")
    .regex(/[0-9]/, "Debe incluir al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un carácter especial"),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setError("El enlace no es válido. Solicita uno nuevo.");
      return;
    }
    try {
      setError(null);
      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "El enlace expiró o no es válido. Solicita uno nuevo.",
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-3 sm:p-6">
      <Card className="w-full max-w-md border-0 sm:border">
        <CardHeader className="space-y-1 px-4 sm:px-6 pt-6 sm:pt-8">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Crea tu nueva contraseña
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Elige una contraseña segura para tu cuenta
          </CardDescription>
        </CardHeader>

        {success ? (
          <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
            <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl text-center">
              ✅ Contraseña actualizada. Redirigiendo a inicio de sesión...
            </div>
          </CardContent>
        ) : !token ? (
          <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8 space-y-4">
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl text-center">
              Este enlace no es válido. Solicita uno nuevo.
            </div>
            <Link
              href="/forgot-password"
              className="block text-center text-sm text-primary hover:underline"
            >
              Solicitar nuevo enlace
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
                <Label htmlFor="password" className="text-sm sm:text-base">
                  Nueva contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="text-sm sm:text-base h-9 sm:h-10"
                  {...register("password")}
                />
                {errors.password ? (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Mínimo 8 caracteres, con mayúscula, minúscula, número y
                    carácter especial
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-6 sm:pb-8 border-t border-border mt-2">
              <Button
                type="submit"
                className="w-full text-sm sm:text-base h-9 sm:h-10"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar nueva contraseña"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
