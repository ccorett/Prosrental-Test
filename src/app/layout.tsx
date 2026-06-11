import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { CustomerPortalCta } from "@/components/portal/CustomerPortalCta";
import { SITE } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Professional Equipment Rentals`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Pro Rentals — equipment rental storefront in Plymouth, Tobago. Browse inventory, estimate costs, and request quotes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-foreground antialiased">
        <SiteNavbar />
        <main className="flex-1">{children}</main>
        <CustomerPortalCta />
        <SiteFooter />
      </body>
    </html>
  );
}
