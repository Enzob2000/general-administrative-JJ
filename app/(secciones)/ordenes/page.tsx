"use client";
import { useState, useCallback, useRef } from "react";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import DashboardLayout from "@/components/ui/layout/layout";
import {
  COLUMNS,
  Ordenes,
  FILTER_CONFIG,
} from "@/features/ordenes/types/ordenes.constants";
import { FilterGeneral } from "@/components/shared/dataTable/FilterGeneral";
import { OrdenesDetailModal } from "@/features/ordenes/components/OrdenesDetailModal";
import { CrearGrupoModal } from "@/features/grupos/components/CrearGrupoModal";
import { CrearNegocioModal } from "@/features/negocios/components/CrearNegocioModal";
import { useApiQuery } from "@/hooks/useApi";
import { RiRestartLine } from "react-icons/ri";

export default function OrdenesPage() {
  const handleEdit = (item: any) => console.log("Editando:", item.id);
  const handleDelete = (item: any) => confirm(`¿Eliminar ${item.id}?`);

  const [selectedOrder, setSelectedOrder] = useState<Ordenes | null>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isAddingNegocio, setIsAddingNegocio] = useState(false);

  const { data, isLoading, error, refetch } = useApiQuery<Ordenes[]>(
    ["ordenes"],
    "/admin/Orders/SearchOrders",
  );

  // console.log(JSON.stringify(data, null, 2));

  // --- Estado de Filtros Genericos ---
  const [filters, setFilters] = useState({});
  const resetFiltersRef = useRef<(() => void) | null>(null);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(newFilters)) {
        return prev;
      }
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
          columns={COLUMNS}
          itemsPerPage={10}
          // onEdit={handleEdit}
          // onDelete={handleDelete}
          onView={setSelectedOrder}
          // Pasar componente de filtros generico
          filterComponent={
            <FilterGeneral
              config={FILTER_CONFIG}
              data={data || []}
              onFilterChange={handleFilterChange}
              onResetRef={(fn) => {
                resetFiltersRef.current = fn;
              }}
            />
          }
          // Re-render cuando cambien los filtros
          externalFilters={filters}
          onResetFilters={() => resetFiltersRef.current?.()}
          searchLabel="Buscar orden..."
          emptyTitle="No se encontraron órdenes"
          emptyDescription="Prueba ajustando el rango de fechas o los filtros"
          // Botones
          actions={[
            {
              label: "Refrescar",
              icon: <RiRestartLine size={20} />,
              onClick: () => refetch(),
              className:
                "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
            },
            // {
            //   label: "Crear Grupo",
            //   onClick: () => setIsAddingGroup(true),
            // },
            // {
            //   label: "Añadir Farmacia",
            //   onClick: () => setIsAddingPharmacy(true),
            // },
          ]}
        />

        {/* Modal de Detalles */}
        <OrdenesDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />

        {/* Modal Crear Grupo */}
        <CrearGrupoModal
          isOpen={isAddingGroup}
          onClose={() => setIsAddingGroup(false)}
        />

        {/* Modal Añadir Negocio */}
        <CrearNegocioModal
          isOpen={isAddingNegocio}
          onClose={() => setIsAddingNegocio(false)}
        />
      </div>
    </DashboardLayout>
  );
}
