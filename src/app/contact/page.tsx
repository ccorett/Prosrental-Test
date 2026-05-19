import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { LinkButton } from "@/components/ui/Button";
import { SITE } from "@/lib/data";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Pro Rentals for quotes, availability, and equipment recommendations.",
};

export default function ContactPage() {
  const whatsappUrl = getWhatsAppUrl(
    SITE.whatsapp,
    "Hi Pro Rentals! I'd like to request a quote."
  );

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Get Your Project Moving"
        description="Reach out for availability, pricing, delivery options, or equipment recommendations."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <aside className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
              <p className="mt-4 text-muted leading-relaxed">
                Prefer to talk now? Call or message us on WhatsApp for the fastest
                response on popular equipment.
              </p>

              <ul className="mt-8 space-y-6">
                <li>
                  <a
                    href={SITE.phoneHref}
                    className="flex items-start gap-4 rounded-xl border border-border bg-surface-elevated p-4 transition-colors hover:border-accent/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent">
                      <Phone className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-muted">Phone</span>
                      <span className="text-foreground font-semibold">{SITE.phone}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 rounded-xl border border-border bg-surface-elevated p-4 transition-colors hover:border-[#25D366]/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/20 text-[#25D366]">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-muted">WhatsApp</span>
                      <span className="text-foreground font-semibold">Message us</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="flex items-start gap-4 rounded-xl border border-border bg-surface-elevated p-4 transition-colors hover:border-accent/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent">
                      <Mail className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-muted">Email</span>
                      <span className="text-foreground font-semibold">{SITE.email}</span>
                    </span>
                  </a>
                </li>
                <li className="flex items-start gap-4 rounded-xl border border-border bg-surface-elevated p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-muted">Location</span>
                    <span className="text-foreground">{SITE.location}</span>
                  </span>
                </li>
                <li className="flex items-start gap-4 rounded-xl border border-border bg-surface-elevated p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent">
                    <Clock className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-muted">Hours</span>
                    <span className="text-foreground">{SITE.hours}</span>
                  </span>
                </li>
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LinkButton href={SITE.phoneHref} className="flex-1">
                  <Phone className="h-5 w-5" />
                  Call Now
                </LinkButton>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>
              </div>
            </aside>

            <div className="rounded-2xl border border-border bg-surface-elevated p-6 sm:p-8 lg:col-span-3">
              <h2 className="text-xl font-semibold text-foreground">Request a Quote</h2>
              <p className="mt-2 text-sm text-muted">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
