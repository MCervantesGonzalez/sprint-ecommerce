"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useProfile } from "@/hooks/useProfile";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Mail, X } from "lucide-react";

export function VerificationBanner() {
  const { isAuthenticated } = useAuthStore();
  const { data: profile } = useProfile();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isAuthenticated || profile?.email_verified || dismissed) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await api.post("/auth/resend-verification");
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-brand-primary/10 border-b border-brand-primary/30 px-3 sm:px-4 md:px-8 lg:px-12 py-2">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-brand-dark dark:text-brand-light">
          <Mail className="h-4 w-4 flex-shrink-0 text-brand-primary" />
          {sent ? (
            <span>Correo reenviado — revisa tu bandeja de entrada.</span>
          ) : (
            <span>
              Verifica tu correo para activar todos los beneficios de tu cuenta.
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!sent && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-brand-primary hover:text-brand-primary-hover"
              onClick={handleResend}
              disabled={sending}
            >
              {sending ? "Enviando..." : "Reenviar correo"}
            </Button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
