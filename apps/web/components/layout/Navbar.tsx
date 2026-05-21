"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Moon,
  Sun,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "next-themes";
import { LogoNavbar } from "@/components/layout/icons/brands/NavbarLogo";
import { useProfile } from "@/hooks/useProfile";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { data: profile } = useProfile();
  const { openCart } = useCartStore();
  const { data: cart } = useCart();

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      {/* Contenedor fluido para extrema izquierda/derecha */}
      <div className="w-full px-3 sm:px-4 md:px-8 lg:px-12">
        <div className="flex items-center h-16 sm:h-20 gap-3 sm:gap-8">
          {/* 1. LOGO EXTREMA IZQUIERDA */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <LogoNavbar className="h-8 sm:h-12 w-auto" />
            </Link>
          </div>

          {/* 2. LINKS DE NAVEGACIÓN */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/"
              className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Catálogo
            </Link>
            <Link
              href="/designs"
              className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Diseños
            </Link>
          </div>

          {/* 3. ESPACIADOR (Push al final) */}
          <div className="flex-grow" />

          {/* 4. ACCIONES EXTREMA DERECHA */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* Theme toggle siempre visible */}
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openCart}
                  className="relative hover:bg-accent h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>

                {/* Dashboard si es Admin */}
                {user?.role === "ADMIN" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title="Panel de control"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <Link href="/admin/dashboard">
                      <LayoutDashboard className="h-4 sm:h-5 w-4 sm:w-5" />
                    </Link>
                  </Button>
                )}

                {/* Info de Usuario */}
                {/* <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50 border border-transparent">
                  <User className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
                  <span className="hidden lg:block text-xs font-medium text-muted-foreground">
                    {user?.name}
                  </span>
                </div> */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                >
                  {profile?.avatar_url ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden relative">
                      <Image
                        src={profile.avatar_url}
                        alt={user?.name ?? ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="hidden md:block text-muted-foreground text-sm">
                    {user?.name}
                  </span>
                </Link>

                {/* Logout */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="ml-1 sm:ml-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3"
                >
                  <LogOut className="h-3 sm:h-4 w-3 sm:w-4 mr-0 sm:mr-2" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </>
            ) : (
              <>
                {/* Carrito para usuarios no logueados  */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openCart}
                  className="relative h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden sm:flex font-semibold text-xs sm:text-sm h-8 sm:h-10"
                >
                  <Link href="/login">Iniciar sesión</Link>
                </Button>

                <Button
                  size="sm"
                  asChild
                  className="font-semibold text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-6 shadow-md"
                >
                  <Link href="/register">Registrarse</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
