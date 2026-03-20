"use client";

import { useState } from "react";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import DashboardLayout from "@/components/ui/layout/layout";
import {
  columns,
  FILTER_CONFIG,
  Admin,
} from "@/features/usuarios/types/admin.constants";
import { CrearAdminModal } from "@/features/usuarios/components/CrearAdminModal";
import { useApiQuery } from "@/hooks/useApi";
import { RiUserAddLine, RiRestartLine } from "react-icons/ri";

export default function AdminsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const { data, isLoading, error, refetch } = useApiQuery<Admin[]>(
    ["admins"],
    "/admin/User/listadmins", // Ejemplo de endpoint
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-10">
        <DataTable
          data={data || []}
          loading={isLoading}
          error={error}
          columns={columns}
          emptyTitle="No hay administradores"
          actions={[
            {
              label: "Refrescar",
              icon: <RiRestartLine size={16} />,
              onClick: () => refetch(),
              className: "bg-white text-gray-600 border border-gray-200",
            },
            {
              label: "Nuevo Admin",
              icon: <RiUserAddLine size={16} />,
              onClick: () => setIsAdding(true),
            },
          ]}
        />

        <CrearAdminModal isOpen={isAdding} onClose={() => setIsAdding(false)} />
      </div>
    </DashboardLayout>
  );
}
