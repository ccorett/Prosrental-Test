import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { CATEGORIES, NAV_LINKS, SITE } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-bold text-background shadow-md shadow-accent/25">
                PR
              </span>
              <span className="text-lg font-bold text-foreground">{SITE.name}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Professional equipment rentals for contractors, businesses, and
              homeowners. Cleaning, DIY, construction, and facility equipment.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Categories
            </h3>
            <ul className="mt-4 space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={cat.href}
                    className="text-sm text-muted transition-colors duration-200 hover:text-secondary"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={SITE.phoneHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-muted transition-colors duration-200 hover:text-accent"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-start gap-2 text-sm text-muted transition-colors duration-200 hover:text-accent"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>
                  {SITE.address}
                  <br />
                  {SITE.city}
                </span>
              </li>
            </ul>
            <LinkButton href="/contact" variant="outline" size="sm" className="mt-6 hover-lift">
              Contact Us
            </LinkButton>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted">{SITE.hours}</p>
        </div>
      </div>
    </footer>
  );
}
