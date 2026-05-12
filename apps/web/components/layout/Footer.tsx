import Link from "next/link";
import { LogoKitsune } from "@/components/layout/icons/brands/KitsuneLogo";
import { LogoSprint } from "./icons/brands/SprintLogo";
import { FacebookIcon } from "./icons/social/FacebookIcon";
import { InstagramIcon } from "./icons/social/InstagramIcon";
import { TiktokIcon } from "./icons/social/TiktokIcon";
import { YoutubeIcon } from "./icons/social/YoutubeIcon";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="w-full px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Columna 1: Branding y Redes */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/SprintPromocionales"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FacebookIcon />
              </Link>
              <Link
                href="https://www.instagram.com/sprintpromocionales"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <InstagramIcon />
              </Link>
              <Link
                href="https://www.tiktok.com/@sprint_promocionales"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <TiktokIcon />
              </Link>
              <Link
                href="https://www.youtube.com/@Sprint_Promocionales"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <YoutubeIcon />
              </Link>
            </div>
            <LogoSprint />
          </div>

          {/* Columna 2: Tienda */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
              Tienda
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/designs"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Diseños
                </Link>
              </li>
              <li>
                <Link
                  href="/new"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Novedades
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
              Ayuda
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Envíos y Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Newsletter u Horarios */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
              Pagos Seguros
            </h3>
            {/* El Kitsune como sello de garantía */}
            <div className="flex items-center gap-3">
              <LogoKitsune className="h-10 w-auto text-primary" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-muted-foreground leading-none">
                  Garantía
                </span>
                <span className="text-xs font-bold">SPRINT QUALITY</span>
              </div>
            </div>
            <p className="text-sm" text-muted-foreground>
              Procesamos tus pagos de forma segura a través de{" "}
              <strong>Mercado Pago</strong>.
            </p>
            {/* Badges de métodos de pago */}
            <div className="flex flex-wrap gap-3 pt-4">
              {/* Badge Mercado Pago */}
              <div className="bg-white px-2 py-1 rounded-sm border flex items-center justify-center">
                <span className="text-[10px] font-black text-[#009EE3]">
                  Mercado
                </span>
                <span className="text-[10px] font-black text-[#111111] ml-0.5">
                  Pago
                </span>
              </div>

              {/* Badge VISA*/}
              <div className="bg-slate-800 text-white px-3 py-1.5 rounded-md border border-slate-700 text-[10px] font-bold flex items-center shadow-sm">
                VISA
              </div>

              {/* Badge MASTERCARD*/}
              <div className="bg-slate-800 text-white px-3 py-1.5 rounded-md border border-slate-700 text-[10px] font-bold flex items-center shadow-sm">
                MASTER CARD
              </div>
            </div>
          </div>
        </div>

        {/* Barra inferior de Copyright */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Sprint. Todos los derechos reservados.
          </p>
          <div className="flex gap-6"></div>
        </div>
      </div>
    </footer>
  );
}
