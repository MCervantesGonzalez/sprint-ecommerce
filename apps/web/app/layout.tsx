import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sprint Ecommerce",
  description: "Tienda de productos personalizados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {/* Añadimos un contenedor flex que ocupe todo el alto */}
          <div className="relative flex min-h-screen flex-col">
            <Navbar />

            {/* 
               flex-1: Hace que el main crezca para llenar el espacio vacío.
               py-8: Mantiene la separación con navbar y footer.
            */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

            {/* El CartDrawer puede ir en cualquier lado mientras esté en el DOM */}
            <CartDrawer />

            <Footer />
          </div>
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
