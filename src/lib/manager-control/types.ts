import type {
  BookingRequestStatus,
  CustomerStatus,
  InvoiceStatus,
  QuoteStatus,
  RentalStatus,
} from "@prisma/client";

export type ManagerDashboardSummary = {
  pendingBookings: number;
  activeRentals: number;
  upcomingReturns: number;
  outstandingInvoices: number;
  openMaintenance: number;
  lowStockAlerts: number;
  equipmentUtilizationPct: number;
  pendingQuotes: number;
  openServiceRequests: number;
  staffActiveJobs: number;
  staffCompletedJobs: number;
};

export type ManagerCustomerRow = {
  id: string;
  fullName: string;
  email: string;
  companyName: string | null;
  status: CustomerStatus;
  bookingCount: number;
  rentalCount: number;
  createdAt: string;
};

export type ManagerEmployeeRow = {
  id: string;
  fullName: string;
  email: string;
  roleLabel: string;
  roleCode: string;
  status: string;
  department: string | null;
  jobCount: number;
};

export type ManagerBookingRow = {
  id: string;
  customerName: string;
  equipmentName: string;
  equipmentId: string;
  rentalStartDate: string;
  rentalEndDate: string;
  deliveryRequired: boolean;
  requestStatus: BookingRequestStatus;
  notes: string | null;
  createdAt: string;
};

export type ManagerQuoteRow = {
  id: string;
  quoteNumber: string;
  customerName: string;
  equipmentRequested: string;
  estimatedTotal: number;
  status: QuoteStatus;
  validUntil: string;
};

export type ManagerInvoiceRow = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
};

export type ManagerRentalRow = {
  id: string;
  customerName: string;
  equipmentName: string;
  status: RentalStatus;
  rentalStartDate: string;
  rentalEndDate: string;
};

export type RevenueReport = {
  totalRevenue: number;
  outstandingTotal: number;
  revenueByMonth: { month: string; total: number }[];
  revenueByCategory: { category: string; total: number }[];
};

export type UtilizationReport = {
  mostRented: { name: string; count: number }[];
  underused: { name: string; count: number }[];
  maintenanceFrequency: { name: string; count: number }[];
};

export type ActivityReport = {
  activeCustomers: number;
  quoteConversions: number;
  assignedJobs: number;
  completedJobs: number;
};
