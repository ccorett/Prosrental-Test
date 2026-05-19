"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { NAV_LINKS, SITE } from "@/lib/data";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/80 bg-background/95 shadow-lg shadow-black/20 backdrop-blur-md"
          : "border-transparent bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-bold text-background shadow-md shadow-accent/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-accent/50">
            PR
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-accent-muted text-accent"
                    : "text-muted hover:bg-surface-elevated hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-all duration-200 hover:bg-surface-elevated hover:text-foreground"
          >
            <Phone className="h-4 w-4 text-secondary" aria-hidden />
            <span className="hidden md:inline">{SITE.phone}</span>
          </a>
          <LinkButton href="/equipment" size="sm" className="hover-lift">
            View Equipment
          </LinkButton>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-foreground transition-colors hover:bg-surface-elevated lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface lg:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    active
                      ? "bg-accent-muted text-accent"
                      : "text-muted hover:bg-surface-elevated hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={SITE.phoneHref}
              className="mt-2 inline-flex items-center gap-2 rounded-lg px-4 py-3 text-base font-semibold text-secondary"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>
            <LinkButton href="/equipment" className="mt-2 w-full" size="lg">
              View Equipment
            </LinkButton>
          </nav>
        </div>
      )}
    </header>
  );
}
