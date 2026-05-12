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
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:bg-[#20BA5A] transition-colors"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsappIcon />
    </Link>
  );
}
