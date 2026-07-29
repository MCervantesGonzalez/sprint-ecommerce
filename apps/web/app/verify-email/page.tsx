"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Este enlace no es válido.");
      return;
    }

    api
      .post("/auth/verify-email", { token })
      .then(() => {
        setStatus("success");
        setMessage("Tu correo fue verificado correctamente.");
        // Refresca el perfil para que el banner desaparezca sin recargar
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "El enlace expiró o no es válido.",
        );
      });
  }, [token, queryClient]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-3 sm:p-6">
      <Card className="w-full max-w-md border-0 sm:border">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            Verificación de correo
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4 pb-8">
          {status === "loading" && (
            <p className="text-muted-foreground">Verificando...</p>
          )}
          {status === "success" && (
            <>
              <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl">
                ✅ {message}
              </div>
              <Button asChild className="w-full">
                <Link href="/">Ir al inicio</Link>
              </Button>
            </>
          )}
          {status === "error" && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
