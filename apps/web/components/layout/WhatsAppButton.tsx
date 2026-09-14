import Link from "next/link";
import { WhatsappIcon } from "./icons/social/WhatsappIcon";

const WHATSAPP_NUMBER = "5630605063";
const WHATSAPP_MESSAGE =
  "Hola, tengo una pregunta sobre un producto de Sprint.";

export function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] shadow-lg hover:bg-[#20BA5A] transition-colors"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsappIcon />
    </Link>
  );
}
