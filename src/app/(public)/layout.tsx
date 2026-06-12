import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { EmployeePortalCta } from "@/components/employee-portal/EmployeePortalCta";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNavbar />
      <main className="flex-1">{children}</main>
      <EmployeePortalCta />
      <SiteFooter />
    </>
  );
}
