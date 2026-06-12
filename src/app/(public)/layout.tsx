import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { CustomerPortalCta } from "@/components/portal/CustomerPortalCta";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNavbar />
      <main className="flex-1">{children}</main>
      <CustomerPortalCta />
      <SiteFooter />
    </>
  );
}
