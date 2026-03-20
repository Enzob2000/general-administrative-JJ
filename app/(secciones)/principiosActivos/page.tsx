"use client";

import { useState, useCallback, useRef } from "react";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import DashboardLayout from "@/components/ui/layout/layout";
import {
  MOCK_PRINCIPIOS,
  columns,
  PrincipioActivo,
  FILTER_CONFIG,
} from "@/features/principiosActivos/types/principiosActivos.constans";
import { FilterGeneral } from "@/components/shared/dataTable/FilterGeneral";
import { useApiQuery } from "@/hooks/useApi";
import { RiRestartLine, RiFilterOffLine, RiAddLine } from "react-icons/ri";
import { CrearPrincipioActivoModal } from "@/features/principiosActivos/components/CrearPrincipioActivoModal";

export default function PrincipiosPage() {
  const [filters, setFilters] = useState({});
  const resetFiltersRef = useRef<(() => void) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useApiQuery<PrincipioActivo[]>(
    ["principios-activos"],
    "ActivePrinciple/all",
  );

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
            data={data || MOCK_PRINCIPIOS}
            loading={isLoading}
            columns={columns}
            onEdit={(item) => console.log("Editando principio", item.id)}
            onDelete={(item) => confirm(`¿Eliminar principio: ${item.nombre}?`)}
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
            searchLabel="Buscar principio..."
            emptyTitle="No hay principios registrados"
            emptyDescription="Comienza agregando uno nuevo al sistema"
            actions={[
              {
                label: "Crear Nuevo",
                icon: <RiAddLine size={20} />,
                onClick: () => setIsModalOpen(true),
                className:
                  "bg-indigo-600 text-white hover:bg-indigo-700 font-semibold",
              },
              {
                label: "Refrescar",
                icon: <RiRestartLine size={20} />,
                onClick: () => refetch(),
                className:
                  "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
              },
            ]}
          />
        </div>
      </DashboardLayout>

      <CrearPrincipioActivoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </>
  );
}
