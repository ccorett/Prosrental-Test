"use client";

import { MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/data";
import { getWhatsAppUrl } from "@/lib/utils";

export function FloatingActions() {
  const whatsappUrl = getWhatsAppUrl(
    SITE.whatsapp,
    "Hi Pro Rentals! I'd like to inquire about equipment rental."
  );

  return (
    <aside
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
      aria-label="Quick contact actions"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href={SITE.phoneHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-background shadow-lg shadow-accent/30 transition-all duration-300 hover:scale-110 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/50"
        aria-label={`Message ${SITE.phone} on WhatsApp`}
      >
        <Phone className="h-6 w-6" />
      </a>
    </aside>
  );
}
