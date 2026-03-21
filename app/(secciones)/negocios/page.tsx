"use client";

import { useState, useCallback, useRef } from "react";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import DashboardLayout from "@/components/ui/layout/layout";
import {
  columns,
  Negocio,
  FILTER_CONFIG,
} from "@/features/negocios/types/negocios.constants";
import { FilterGeneral } from "@/components/shared/dataTable/FilterGeneral";
import { CrearNegocioModal } from "@/features/negocios/components/CrearNegocioModal";
import { VerNegocioModal } from "@/features/negocios/components/VerNegocioModal";
import { useApiQuery } from "@/hooks/useApi";
import { RiRestartLine } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { DeleteConfirmDialog } from "@/components/shared/modals/DeleteConfirmDialog";
import { NotificationDialog } from "@/components/shared/modals/NotificationDialog";

export default function NegociosPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isAddingNegocio, setIsAddingNegocio] = useState(false);
  const [selectedNegocio, setSelectedNegocio] = useState<any>(null);
  const resetFiltersRef = useRef<(() => void) | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ show: false, type: "success", title: "", message: "" });

  const [deleteDialog, setDeleteDialog] = useState<{
    show: boolean;
    id: string | null;
    name: string;
  }>({ show: false, id: null, name: "" });

  const { data, isLoading, error, refetch } = useApiQuery<Negocio[]>(
    ["negocios"],
    "/admin/Pharmacy/searchpharmacy",
  );

  // console.log(JSON.stringify(data, null, 2));

  const { mutate: deletePharmacy, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/Pharmacy/deletepharmacy/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["negocios"] });
      setNotification({
        show: true,
        type: "success",
        title: "Negocio Eliminado",
        message: "El negocio ha sido eliminado correctamente.",
      });
      setDeleteDialog({ show: false, id: null, name: "" });
    },
    onError: (err: any) => {
      setNotification({
        show: true,
        type: "error",
        title: "Error",
        message:
          err.response?.data?.message || "No se pudo eliminar el negocio.",
      });
    },
  });

  const handleDelete = (item: Negocio) => {
    setDeleteDialog({
      show: true,
      id: item.id || null,
      name: item.name,
    });
  };

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(newFilters)) return prev;
      return newFilters;
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-10">
        <DataTable
          data={data || []}
          loading={isLoading}
          error={error}
          columns={columns}
          onView={(item) => setSelectedNegocio(item)}
          // onEdit={(item: any) => console.log("Editando", item.name)}
          onDelete={handleDelete}
          filterFn={(item, filter, search) => {
            const s = search.toLowerCase();
            const matchesSearch =
              !search ||
              item.name.toLowerCase().includes(s) ||
              item.rif.toLowerCase().includes(s) ||
              (item.health_code &&
                item.health_code.toLowerCase().includes(s)) ||
              (item.name_group && item.name_group.toLowerCase().includes(s)) ||
              (item.active_modules &&
                item.active_modules.some((mod) =>
                  mod.toLowerCase().includes(s),
                ));

            const matchesGroup =
              !filter.id_group ||
              filter.id_group.length === 0 ||
              filter.id_group.includes(item.id_group);

            return matchesSearch && matchesGroup;
          }}
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
          emptyTitle="No se encontraron negocios"
          emptyDescription="Intenta ajustar los filtros o añade un nuevo negocio"
          actions={[
            {
              label: "Refrescar",
              icon: <RiRestartLine size={16} />,
              onClick: () => refetch(),
              className:
                "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
            },
            {
              label: "Añadir Negocio",
              onClick: () => setIsAddingNegocio(true),
            },
          ]}
        />

        <CrearNegocioModal
          isOpen={isAddingNegocio}
          onClose={() => setIsAddingNegocio(false)}
        />

        <VerNegocioModal
          isOpen={!!selectedNegocio}
          onClose={() => setSelectedNegocio(null)}
          data={selectedNegocio}
        />

        <DeleteConfirmDialog
          isOpen={deleteDialog.show}
          title="Eliminar Negocio"
          itemName={deleteDialog.name}
          onClose={() => setDeleteDialog({ show: false, id: null, name: "" })}
          onConfirm={() => deleteDialog.id && deletePharmacy(deleteDialog.id)}
          isLoading={isDeleting}
        />

        <NotificationDialog
          isOpen={notification.show}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        />
      </div>
    </DashboardLayout>
  );
}
