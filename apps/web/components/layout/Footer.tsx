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
      <div className="w-full px-3 sm:px-4 md:px-8 lg:px-12 py-6 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-8 md:gap-12">
          {/* Columna 1: Branding y Redes */}
          <div className="col-span-1 md:col-span-1 space-y-2 sm:space-y-4">
            <div className="flex gap-2 sm:gap-4">
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
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-4">
              Tienda
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/designs"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                >
                  Diseños
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-4">
              Ayuda
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                >
                  Envíos y Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Newsletter u Horarios */}
          <div className="flex flex-col gap-2 sm:gap-4">
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider mb-1 sm:mb-4">
              Pagos Seguros
            </h3>
            {/* El Kitsune como sello de garantía */}
            <div className="flex items-center gap-2 sm:gap-3">
              <LogoKitsune className="h-8 sm:h-10 w-auto text-primary" />
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[10px] font-bold uppercase text-muted-foreground leading-none">
                  Garantía
                </span>
                <span className="text-xs sm:text-xs font-bold">
                  SPRINT QUALITY
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Procesamos tus pagos de forma segura a través de{" "}
              <strong>Mercado Pago</strong>.
            </p>
            {/* Badges de métodos de pago */}
            <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4">
              {/* Badge Mercado Pago */}
              <div className="bg-white px-2 py-1 rounded-sm border flex items-center justify-center">
                <span className="text-[8px] sm:text-[10px] font-black text-[#009EE3]">
                  Mercado
                </span>
                <span className="text-[8px] sm:text-[10px] font-black text-[#111111] ml-0.5">
                  Pago
                </span>
              </div>

              {/* Badge VISA*/}
              <div className="bg-slate-800 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-slate-700 text-[8px] sm:text-[10px] font-bold flex items-center shadow-sm">
                VISA
              </div>

              {/* Badge MASTERCARD*/}
              <div className="bg-slate-800 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-slate-700 text-[8px] sm:text-[10px] font-bold flex items-center shadow-sm">
                MC
              </div>
            </div>
          </div>
        </div>

        {/* Barra inferior de Copyright */}
        <div className="border-t mt-6 sm:mt-12 pt-4 sm:pt-8 flex flex-col md:flex-row items-center justify-center md:justify-start gap-1.5 md:gap-3 text-center md:text-left">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Sprint. Todos los derechos reservados.
          </p>
          <span className="hidden md:inline text-muted-foreground text-xs">
            ·
          </span>
          <Link
            href="/privacy"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Aviso de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
