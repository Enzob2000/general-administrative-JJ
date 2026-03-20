"use client";

import { useState, useCallback, useRef } from "react";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import DashboardLayout from "@/components/ui/layout/layout";
import {
  columns,
  Grupos,
  FILTER_CONFIG,
} from "@/features/grupos/types/grupos.constants";
import { FilterGeneral } from "@/components/shared/dataTable/FilterGeneral";
import { CrearGrupoModal } from "@/features/grupos/components/CrearGrupoModal";
import { useApiQuery } from "@/hooks/useApi";
import { RiRestartLine } from "react-icons/ri";
import { PharmacySubList } from "@/features/grupos/components/NegocioSubList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { DeleteConfirmDialog } from "@/components/shared/modals/DeleteConfirmDialog";
import { NotificationDialog } from "@/components/shared/modals/NotificationDialog";

export default function GruposPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({});
  const resetFiltersRef = useRef<(() => void) | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
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

  const { data, isLoading, error, refetch } = useApiQuery<Grupos[]>(
    ["grupos"],
    "/admin/PharmacyGroup/groupsPharmacy",
  );

  // console.log("Grupos: ", JSON.stringify(data, null, 2));

  const { mutate: deleteGroup, isPending: isDeleting } = useMutation({
    mutationFn: async (id_group: string) => {
      await api.delete(`/admin/PharmacyGroup/deletePharmacyGroup/${id_group}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      queryClient.invalidateQueries({ queryKey: ["filter-opts-name_group"] });
      resetFiltersRef.current?.();

      setNotification({
        show: true,
        type: "success",
        title: "Grupo Eliminado",
        message: "El grupo ha sido eliminado correctamente.",
      });
      setDeleteDialog({ show: false, id: null, name: "" });
    },
    onError: (err: any) => {
      setNotification({
        show: true,
        type: "error",
        title: "Error",
        message: err.response?.data?.message || "No se pudo eliminar el grupo.",
      });
    },
  });

  const handleDelete = (item: Grupos) => {
    setDeleteDialog({ show: true, id: item.id_group, name: item.name_group });
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
          // onEdit={(item) => console.log("Editando", item.name_group)}
          onDelete={handleDelete}
          expandableRowRender={(item) => (
            <PharmacySubList groupId={item.id_group} />
          )}
          searchLabel="Buscar grupo..."
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
          emptyTitle="No se encontraron grupos"
          emptyDescription="Intenta ajustar los filtros o crea un nuevo grupo"
          actions={[
            {
              label: "Refrescar",
              icon: <RiRestartLine size={20} />,
              onClick: () => refetch(),
              className:
                "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
            },
            {
              label: "Crear grupo",
              onClick: () => setIsCreatingGroup(true),
            },
          ]}
        />

        <CrearGrupoModal
          isOpen={isCreatingGroup}
          onClose={() => setIsCreatingGroup(false)}
        />

        <DeleteConfirmDialog
          isOpen={deleteDialog.show}
          title="Eliminar Grupo"
          itemName={deleteDialog.name}
          onClose={() => setDeleteDialog({ show: false, id: null, name: "" })}
          onConfirm={() => deleteDialog.id && deleteGroup(deleteDialog.id)}
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
