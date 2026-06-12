"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/data";
import { PORTAL_PATH } from "@/lib/portal";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/equipment", label: "Browse Equipment" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="glass-nav sticky top-0 z-50 border-b border-border/80">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-foreground lg:text-xl"
          >
            Pro Rentals
          </Link>

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Main navigation"
          >
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors hover:text-accent ${
                    active ? "text-foreground" : "text-muted"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={SITE.phoneHref}
              target="_blank"
              rel="noopener noreferrer"
              className="label-caps text-muted transition-colors hover:text-foreground"
              title={`Message ${SITE.phone} on WhatsApp`}
            >
              {SITE.phone}
            </a>
            <Link
              href="/contact"
              className="label-caps text-muted transition-colors hover:text-foreground"
            >
              Request Quote
            </Link>
            <Link
              href={PORTAL_PATH}
              className={`rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-colors ${
                pathname === PORTAL_PATH
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-accent/40 text-foreground hover:border-accent hover:bg-accent/10"
              }`}
            >
              Customer Portal
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-border bg-surface-elevated/95 px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                  isActive(pathname, item.href)
                    ? "bg-background text-foreground"
                    : "text-muted hover:bg-background hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={SITE.phoneHref}
              target="_blank"
              rel="noopener noreferrer"
              className="label-caps px-3 py-3 text-accent"
            >
              {SITE.phone}
            </a>
            <p className="px-3 pb-1 text-sm text-muted">{SITE.location}</p>
            <Link
              href={PORTAL_PATH}
              className="mt-2 rounded-2xl border border-accent/40 px-4 py-3 text-center text-sm font-semibold text-foreground"
            >
              Customer Portal
            </Link>
            <Link
              href="/contact"
              className="rounded-lg px-3 py-3 text-base font-medium text-accent"
            >
              Request a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
