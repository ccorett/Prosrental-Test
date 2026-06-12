import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { QuoteRequestFormLoader } from "@/components/forms/QuoteRequestFormLoader";
import { PageHero } from "@/components/sections/PageHero";
import { LinkButton } from "@/components/ui/Button";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { SITE } from "@/lib/data";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Pro Rentals in Plymouth, Tobago. Request a quote, call 868 734 9490, or email info@prorentals.co",
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
        description="Request a quote, check availability, or speak with our team in Plymouth, Tobago."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <aside className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Call, email, or submit a quote request. We respond within 24 hours on
                equipment inquiries and rental quotes.
              </p>

              <MapPlaceholder location={SITE.location} className="mt-8 aspect-[4/3] w-full" />

              <ul className="mt-8 space-y-4">
                <li>
                  <a
                    href={SITE.phoneHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 rounded-xl border border-border bg-surface-elevated p-4 transition-colors hover:border-accent/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent">
                      <Phone className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-muted">Phone</span>
                      <span className="font-semibold text-foreground">{SITE.phone}</span>
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
                      <span className="font-semibold text-foreground">{SITE.email}</span>
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
                <LinkButton href="/contact#quote-form" className="flex-1">
                  Request a Quote
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

            <div
              id="quote-form"
              className="scroll-mt-24 rounded-2xl border border-border bg-surface-elevated p-6 sm:p-8 lg:col-span-3"
            >
              <h2 className="text-xl font-semibold text-foreground">Request a Quote</h2>
              <p className="mt-2 text-sm text-muted">
                Equipment inquiry and quote requests use the same form—prefill from inventory
                when you click Inquire on any item.
              </p>
              <div className="mt-8">
                <Suspense
                  fallback={
                    <p className="text-sm text-muted">Loading quote form...</p>
                  }
                >
                  <QuoteRequestFormLoader />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
