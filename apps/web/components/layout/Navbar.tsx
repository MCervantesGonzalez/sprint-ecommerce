"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl">
            Sprint<span className="text-primary">Store</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Catálogo
            </Link>
            <Link
              href="/designs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Diseños
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>

            <Button size="sm" asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
