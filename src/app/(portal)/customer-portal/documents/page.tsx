import { PortalDataTable } from "@/components/portal/app/PortalDataTable";
import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { requireCustomer } from "@/lib/auth/session";
import { formatEnumLabel } from "@/lib/portal/labels";
import { formatPortalDate } from "@/lib/portal/format";
import { getCustomerDocuments } from "@/lib/portal/queries";

export const metadata = { title: "Documents" };

export default async function DocumentsPage() {
  const customer = await requireCustomer();
  const documents = await getCustomerDocuments(customer.id);

  return (
    <div>
      <PortalPageHeader
        title="Document Centre"
        description="Rental agreements, safety documents, and equipment manuals."
      />
      <PortalDataTable
        rows={documents}
        emptyMessage="No documents available yet."
        columns={[
          { key: "title", header: "Title", render: (r) => r.title },
          {
            key: "type",
            header: "Type",
            render: (r) => formatEnumLabel(r.documentType),
          },
          {
            key: "equipment",
            header: "Equipment",
            render: (r) => r.equipmentName ?? "—",
          },
          {
            key: "date",
            header: "Added",
            render: (r) => formatPortalDate(r.createdAt),
          },
          {
            key: "file",
            header: "File",
            render: (r) => (
              <a
                href={r.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:text-accent-hover"
              >
                View
              </a>
            ),
          },
        ]}
      />
    </div>
  );
}
