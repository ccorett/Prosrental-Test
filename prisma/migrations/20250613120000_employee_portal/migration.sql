-- CreateEnum
CREATE TYPE "StaffRoleCode" AS ENUM ('EMPLOYEE', 'DRIVER', 'MECHANIC', 'SUPERVISOR', 'MANAGER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'DISABLED', 'PENDING');
CREATE TYPE "EmployeeModule" AS ENUM ('DASHBOARD', 'EQUIPMENT_OPERATIONS', 'MAINTENANCE', 'INVENTORY', 'FLEET_DELIVERY', 'HR', 'SAFETY_COMPLIANCE', 'NOTIFICATIONS', 'PROFILE', 'ADMIN_MANAGEMENT');
CREATE TYPE "AssignedJobStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "DispatchStatus" AS ENUM ('SCHEDULED', 'DISPATCHED', 'DELIVERED', 'CANCELLED');
CREATE TYPE "ReturnStatus" AS ENUM ('PENDING', 'INSPECTED', 'COMPLETED');
CREATE TYPE "InspectionResult" AS ENUM ('PASSED', 'FAILED', 'PENDING');
CREATE TYPE "MaintenanceScheduleStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE');
CREATE TYPE "RepairTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE "PurchaseRequestStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ORDERED');
CREATE TYPE "DeliveryScheduleStatus" AS ENUM ('SCHEDULED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');
CREATE TYPE "FleetVehicleStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE');
CREATE TYPE "LeaveRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
CREATE TYPE "IncidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED');
CREATE TYPE "EmployeeReadStatus" AS ENUM ('READ', 'UNREAD');
CREATE TYPE "AuditActionType" AS ENUM ('ROLE_CHANGE', 'ACCOUNT_CREATED', 'ACCOUNT_DELETED', 'ACCOUNT_DISABLED', 'APPROVAL', 'EQUIPMENT_DISPATCH', 'EQUIPMENT_RETURN', 'MAINTENANCE_UPDATE', 'INVENTORY_CHANGE', 'SYSTEM_SETTING');

-- CreateTable
CREATE TABLE "employee_roles" (
    "id" TEXT NOT NULL,
    "code" "StaffRoleCode" NOT NULL,
    "label" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "employee_roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "employee_permissions" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "module" "EmployeeModule" NOT NULL,
    "can_view" BOOLEAN NOT NULL DEFAULT false,
    "can_create" BOOLEAN NOT NULL DEFAULT false,
    "can_edit" BOOLEAN NOT NULL DEFAULT false,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    "can_approve" BOOLEAN NOT NULL DEFAULT false,
    "can_override" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "employee_permissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "department" TEXT,
    "job_title" TEXT,
    "password_hash" TEXT NOT NULL,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "role_id" TEXT NOT NULL,
    "is_protected" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "employee_sessions" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "employee_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "assigned_jobs" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "AssignedJobStatus" NOT NULL DEFAULT 'PENDING',
    "due_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "assigned_jobs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "equipment_dispatches" (
    "id" TEXT NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "equipment_id" TEXT,
    "customer_name" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "driver_id" TEXT,
    "status" "DispatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "equipment_dispatches_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "equipment_returns" (
    "id" TEXT NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "equipment_id" TEXT,
    "customer_name" TEXT NOT NULL,
    "inspector_id" TEXT,
    "status" "ReturnStatus" NOT NULL DEFAULT 'PENDING',
    "returned_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "equipment_returns_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "equipment_inspections" (
    "id" TEXT NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "equipment_id" TEXT,
    "inspector_id" TEXT NOT NULL,
    "result" "InspectionResult" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "inspected_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "equipment_inspections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "maintenance_schedules" (
    "id" TEXT NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "equipment_id" TEXT,
    "assignee_id" TEXT,
    "task_type" TEXT NOT NULL,
    "status" "MaintenanceScheduleStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "maintenance_schedules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "repair_tickets" (
    "id" TEXT NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "equipment_id" TEXT,
    "assignee_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "RepairTicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "ServicePriority" NOT NULL DEFAULT 'MEDIUM',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "repair_tickets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity_on_hand" INTEGER NOT NULL,
    "reorder_level" INTEGER NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'unit',
    "location" TEXT,
    "availability_status" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "purchase_requests" (
    "id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "estimated_cost" DECIMAL(10,2) NOT NULL,
    "status" "PurchaseRequestStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "purchase_requests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "delivery_schedules" (
    "id" TEXT NOT NULL,
    "driver_id" TEXT,
    "customer_name" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "equipment_summary" TEXT NOT NULL,
    "status" "DeliveryScheduleStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "delivery_schedules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "fleet_vehicles" (
    "id" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "FleetVehicleStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_service_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "fleet_vehicles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "leave_requests" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "LeaveRequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "employee_documents" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "employee_documents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "incident_reports" (
    "id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "IncidentSeverity" NOT NULL DEFAULT 'MEDIUM',
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "location" TEXT,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "incident_reports_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "employee_notifications" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read_status" "EmployeeReadStatus" NOT NULL DEFAULT 'UNREAD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "employee_notifications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT,
    "action" "AuditActionType" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_roles_code_key" ON "employee_roles"("code");
CREATE UNIQUE INDEX "employee_permissions_role_id_module_key" ON "employee_permissions"("role_id", "module");
CREATE INDEX "employee_permissions_role_id_idx" ON "employee_permissions"("role_id");
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");
CREATE INDEX "employees_role_id_idx" ON "employees"("role_id");
CREATE INDEX "employees_status_idx" ON "employees"("status");
CREATE UNIQUE INDEX "employee_sessions_token_key" ON "employee_sessions"("token");
CREATE INDEX "employee_sessions_employee_id_idx" ON "employee_sessions"("employee_id");
CREATE INDEX "assigned_jobs_employee_id_idx" ON "assigned_jobs"("employee_id");
CREATE INDEX "assigned_jobs_status_idx" ON "assigned_jobs"("status");
CREATE INDEX "equipment_dispatches_driver_id_idx" ON "equipment_dispatches"("driver_id");
CREATE INDEX "equipment_dispatches_status_idx" ON "equipment_dispatches"("status");
CREATE INDEX "equipment_returns_inspector_id_idx" ON "equipment_returns"("inspector_id");
CREATE INDEX "equipment_returns_status_idx" ON "equipment_returns"("status");
CREATE INDEX "equipment_inspections_inspector_id_idx" ON "equipment_inspections"("inspector_id");
CREATE INDEX "maintenance_schedules_assignee_id_idx" ON "maintenance_schedules"("assignee_id");
CREATE INDEX "maintenance_schedules_status_idx" ON "maintenance_schedules"("status");
CREATE INDEX "repair_tickets_assignee_id_idx" ON "repair_tickets"("assignee_id");
CREATE INDEX "repair_tickets_status_idx" ON "repair_tickets"("status");
CREATE UNIQUE INDEX "inventory_items_sku_key" ON "inventory_items"("sku");
CREATE INDEX "inventory_items_category_idx" ON "inventory_items"("category");
CREATE INDEX "purchase_requests_requester_id_idx" ON "purchase_requests"("requester_id");
CREATE INDEX "purchase_requests_status_idx" ON "purchase_requests"("status");
CREATE INDEX "delivery_schedules_driver_id_idx" ON "delivery_schedules"("driver_id");
CREATE INDEX "delivery_schedules_status_idx" ON "delivery_schedules"("status");
CREATE UNIQUE INDEX "fleet_vehicles_plate_number_key" ON "fleet_vehicles"("plate_number");
CREATE INDEX "fleet_vehicles_status_idx" ON "fleet_vehicles"("status");
CREATE INDEX "leave_requests_employee_id_idx" ON "leave_requests"("employee_id");
CREATE INDEX "leave_requests_status_idx" ON "leave_requests"("status");
CREATE INDEX "employee_documents_employee_id_idx" ON "employee_documents"("employee_id");
CREATE INDEX "incident_reports_reporter_id_idx" ON "incident_reports"("reporter_id");
CREATE INDEX "incident_reports_status_idx" ON "incident_reports"("status");
CREATE INDEX "employee_notifications_employee_id_idx" ON "employee_notifications"("employee_id");
CREATE INDEX "employee_notifications_read_status_idx" ON "employee_notifications"("read_status");
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "employee_permissions" ADD CONSTRAINT "employee_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "employee_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employees" ADD CONSTRAINT "employees_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "employee_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "employee_sessions" ADD CONSTRAINT "employee_sessions_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "assigned_jobs" ADD CONSTRAINT "assigned_jobs_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "equipment_dispatches" ADD CONSTRAINT "equipment_dispatches_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "equipment_returns" ADD CONSTRAINT "equipment_returns_inspector_id_fkey" FOREIGN KEY ("inspector_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "equipment_inspections" ADD CONSTRAINT "equipment_inspections_inspector_id_fkey" FOREIGN KEY ("inspector_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "repair_tickets" ADD CONSTRAINT "repair_tickets_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "purchase_requests" ADD CONSTRAINT "purchase_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "delivery_schedules" ADD CONSTRAINT "delivery_schedules_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "incident_reports" ADD CONSTRAINT "incident_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employee_notifications" ADD CONSTRAINT "employee_notifications_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
