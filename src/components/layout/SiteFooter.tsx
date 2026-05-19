import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/data";

const EQUIPMENT = [
  "Pressure Washers",
  "Floor Scrubbers",
  "Sanitary Bins",
  "Power Tools",
  "Safety Gear",
] as const;
const RESOURCES = ["Project Planning", "Maintenance Specs", "Locations"] as const;
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
              Industry standards and professional service for equipment rental
              across construction, logistics, and power generation.
            </p>
            <p className="mt-4 space-y-1 text-sm">
              <a
                href={SITE.phoneHref}
                className="block font-medium text-foreground transition-colors hover:text-accent"
              >
                {SITE.phone}
              </a>
              <span className="block text-muted">{SITE.location}</span>
            </p>
          </div>

          <div>
            <h3 className="label-caps text-foreground">Equipment</h3>
            <ul className="mt-4 space-y-2.5">
              {EQUIPMENT.map((item) => (
                <li key={item}>
                  <Link
                    href="/equipment"
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label-caps text-foreground">Resources</h3>
            <ul className="mt-4 space-y-2.5">
              {RESOURCES.map((item) => (
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

        <p className="label-caps mt-12 border-t border-border pt-8 text-center text-muted">
          © {year} Pro Rentals Industrial. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
