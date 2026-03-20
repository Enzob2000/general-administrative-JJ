"use client";

import { useState, useCallback, useRef } from "react";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import DashboardLayout from "@/components/ui/layout/layout";
import {
  columns,
  Usuario,
  FILTER_CONFIG,
} from "@/features/usuarios/types/usuarios.constants";
import { FilterGeneral } from "@/components/shared/dataTable/FilterGeneral";
import { useApiQuery } from "@/hooks/useApi";
import { RiRestartLine } from "react-icons/ri";
import { VerUsuarioModal } from "@/features/usuarios/components/VerUsuarioModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function UsuariosPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({});
  const resetFiltersRef = useRef<(() => void) | null>(null);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  // Consulta de datos
  const { data, isLoading, refetch } = useApiQuery<Usuario[]>(
    ["usuarios"],
    "/admin/Delivery/SearchDeliveries",
  );

  // console.log("Datos de usuarios (JSON):", JSON.stringify(data, null, 2));

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const url = `/admin/Delivery/UpdateDelivery?delivery_id=${id}&new_status=${status}`;

      return await api.put(url);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });

      console.log("Tabla actualizada");
    },

    onError: (err: any) => {
      console.error("Error en la API:", err.response?.data || err.message);
    },
  });

  const handleUpdateStatus = async (
    id: string,
    nextStatus: "Completed" | "Cancelled",
  ) => {
    try {
      // Esto dispara la petición PUT a /admin/Delivery/UpdateDelivery
      await updateStatus({ id, status: nextStatus });
    } catch (error) {
      throw error; // Importante para que el modal sepa que hubo un error
    }
  };

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(newFilters)) return prev;
      return newFilters;
    });
  }, []);

  return (
    <>
      <DashboardLayout>
        <div className="p-4 md:p-10">
          <DataTable
            data={data || []}
            loading={isLoading}
            columns={columns}
            searchLabel="Buscar usuario..."
            onView={(item) => setSelectedUser(item)}
            filterComponent={
              <FilterGeneral
                config={FILTER_CONFIG}
                onFilterChange={handleFilterChange}
                onResetRef={(fn) => {
                  resetFiltersRef.current = fn;
                }}
              />
            }
            externalFilters={filters}
            onResetFilters={() => resetFiltersRef.current?.()}
            emptyTitle="No hay usuarios registrados"
            emptyDescription="Intenta ajustar los filtros"
            actions={[
              {
                label: "Refrescar",
                icon: <RiRestartLine size={20} />,
                onClick: () => refetch(),
                className:
                  "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
              },
            ]}
          />
        </div>
      </DashboardLayout>

      <VerUsuarioModal
        isOpen={!!selectedUser}
        usuario={selectedUser}
        onClose={() => setSelectedUser(null)}
        onAction={handleUpdateStatus}
      />
    </>
  );
}
