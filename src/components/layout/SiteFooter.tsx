import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/data";
import { PORTAL_PATH } from "@/lib/portal";

const EQUIPMENT_CATEGORIES = [
  { label: "DIY Tools", href: "/equipment?category=diy" },
  { label: "Construction Equipment", href: "/equipment?category=construction" },
  { label: "Cleaning Equipment", href: "/equipment?category=cleaning" },
  { label: "Landscaping Equipment", href: "/equipment?category=landscaping" },
  { label: "Access Equipment", href: "/equipment?category=access" },
  {
    label: "Sanitation & Hygiene Equipment",
    href: "/equipment?category=sanitation",
  },
  { label: "Event & Site Facilities", href: "/equipment?category=event" },
] as const;

const RESOURCES = [
  { label: "Customer Portal", href: PORTAL_PATH },
  { label: "Locations", href: "/contact" },
] as const;

const LEGAL = ["Terms of Service", "Privacy Policy", "Compliance"] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-canvas pt-14 pb-8">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <p className="text-lg font-bold text-foreground">Pro Rentals</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Professional equipment rentals for contractors, businesses,
              homeowners, and facility managers in Tobago.
            </p>
            <p className="mt-4 space-y-1 text-sm">
              <a
                href={SITE.phoneHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-medium text-foreground transition-colors hover:text-accent"
              >
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="block text-muted transition-colors hover:text-accent"
              >
                {SITE.email}
              </a>
              <span className="block text-muted">{SITE.location}</span>
            </p>
          </div>

          <div>
            <h3 className="label-caps text-foreground">Equipment Categories</h3>
            <ul className="mt-4 space-y-2.5">
              {EQUIPMENT_CATEGORIES.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label-caps text-foreground">Resources</h3>
            <ul className="mt-4 space-y-2.5">
              {RESOURCES.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`text-sm transition-colors hover:text-accent ${
                      item.label === "Customer Portal"
                        ? "font-semibold text-accent"
                        : "text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label-caps text-foreground">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              {LEGAL.map((item) => (
                <li key={item}>
                  <Link
                    href="/contact"
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <p className="label-caps text-muted">
            © {year} Pro Rentals Industrial. All rights reserved.
          </p>
          <Link
            href={PORTAL_PATH}
            className="inline-flex rounded-2xl border border-accent/40 bg-accent/10 px-6 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
          >
            Customer Portal
          </Link>
        </div>
      </Container>
    </footer>
  );
}
