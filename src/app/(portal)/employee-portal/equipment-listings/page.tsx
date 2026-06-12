import { EmployeePageHeader } from "@/components/employee-portal/app/EmployeePageHeader";
import { EquipmentListingsManager } from "@/components/employee-portal/listings/EquipmentListingsManager";
import { requireEquipmentListingEditor } from "@/lib/access/guards";
import {
  getAllEquipmentListings,
  getListingManagementCategories,
  getStockDashboardStats,
  getStockMovements,
} from "@/lib/employee-portal/listing-queries";
import { canAccessModule } from "@/lib/employee-portal/permissions";

export const metadata = { title: "Equipment Listings" };
export const dynamic = "force-dynamic";

export default async function EquipmentListingsPage() {
  const employee = await requireEquipmentListingEditor();

  const [listings, categories, stats, movements, canEdit, canCreate, canDelete] =
    await Promise.all([
      getAllEquipmentListings(),
      getListingManagementCategories(),
      getStockDashboardStats(),
      getStockMovements(),
      canAccessModule(employee, "EQUIPMENT_LISTINGS", "edit"),
      canAccessModule(employee, "EQUIPMENT_LISTINGS", "create"),
      canAccessModule(employee, "EQUIPMENT_LISTINGS", "delete"),
    ]);

  return (
    <div className="space-y-8">
      <EmployeePageHeader
        title="Equipment Listings"
        description="Manage catalogue listings, stock levels, and auto-calculated availability."
      />
      <EquipmentListingsManager
        listings={listings}
        categories={categories}
        stats={stats}
        movements={movements}
        canEdit={canEdit}
        canCreate={canCreate}
        canDelete={canDelete}
      />
    </div>
  );
}
