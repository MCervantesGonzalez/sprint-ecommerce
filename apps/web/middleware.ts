import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/register"];
const authRoutes = ["/login", "/register"];
const adminRoutes = ["/admin"];
const protectedRoutes = ["/cart", "/orders", "/checkout", "/orders"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Leer token desde las cookies (Zustand persist usa localStorage,
  // leemos el storage desde la cookie que configuraremos)
  const authStorage = request.cookies.get("auth-storage")?.value;

  let token: string | null = null;
  let role: string | null = null;

  if (authStorage) {
    try {
      const parsed = JSON.parse(decodeURIComponent(authStorage));
      token = parsed?.state?.token ?? null;
      role = parsed?.state?.user?.role ?? null;
    } catch {
      token = null;
    }
  }

  const isAuthenticated = !!token;

  // Si está autenticado e intenta ir a login/register → redirigir a home
  if (isAuthenticated && authRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si no está autenticado e intenta ir a rutas protegidas → redirigir a login
  if (!isAuthenticated && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si no es ADMIN e intenta ir a rutas de admin → redirigir a home
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
