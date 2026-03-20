"use client";

import { useState } from "react";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import { PlanPrecio } from "../types/precios.types";
import { VerPlanModal } from "./VerPlanModal";
import { RiPriceTag3Line, RiTeamLine } from "react-icons/ri";

const MOCK_PLANS: PlanPrecio[] = [
  {
    id: "1",
    nombre: "Básico",
    precio: 29.99,
    periodo: "mensual",
    modulos_incluidos: ["Farmacias", "Inventario"],
    descripcion: "Ideal para farmacias pequeñas empezando la digitalización.",
    estado: "activo",
    grupos_count: 12,
  },
  {
    id: "2",
    nombre: "Premium",
    precio: 89.99,
    periodo: "anual",
    modulos_incluidos: [
      "Farmacias",
      "Inventario",
      "Facturación",
      "Reportes",
      "Logística",
    ],
    descripcion: "Plan completo para grupos de farmacias con logística propia.",
    estado: "activo",
    grupos_count: 5,
  },
  {
    id: "3",
    nombre: "Enterprise",
    precio: 199.99,
    periodo: "mensual",
    modulos_incluidos: ["Todos los módulos", "Soporte 24/7", "Analítica Pro"],
    descripcion: "Solución a medida para grandes cadenas nacionales.",
    estado: "activo",
    grupos_count: 2,
  },
];

export function PreciosTable() {
  const [plans, setPlans] = useState(MOCK_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<PlanPrecio | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const columns = [
    {
      header: "Nombre del Plan",
      key: "nombre",
      render: (item: PlanPrecio) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <RiPriceTag3Line size={18} />
          </div>
          <span className="font-bold text-gray-800">{item.nombre}</span>
        </div>
      ),
    },
    {
      header: "Precio",
      key: "precio",
      render: (item: PlanPrecio) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-gray-900">${item.precio}</span>
          <span className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">
            {item.periodo === "unico"
              ? "Pago único"
              : "Facturación " + item.periodo}
          </span>
        </div>
      ),
    },
    {
      header: "Módulos",
      key: "modulos",
      render: (item: PlanPrecio) => (
        <div className="flex flex-wrap gap-1 max-w-[250px]">
          {item.modulos_incluidos.slice(0, 2).map((mod) => (
            <span
              key={mod}
              className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold rounded-full"
            >
              {mod}
            </span>
          ))}
          {item.modulos_incluidos.length > 2 && (
            <span className="text-[9px] text-blue-500 font-bold">
              +{item.modulos_incluidos.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Grupos",
      key: "grupos_count",
      render: (item: PlanPrecio) => (
        <div className="flex items-center gap-2">
          <span className="p-1 px-2.5 bg-blue-50 text-blue-600 font-bold rounded-lg text-xs leading-none">
            {item.grupos_count}
          </span>
          <RiTeamLine className="text-gray-300" size={16} />
        </div>
      ),
    },
    {
      header: "Estado",
      key: "estado",
      render: (item: PlanPrecio) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
            item.estado === "activo"
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-rose-50 text-rose-600 border-rose-100"
          }`}
        >
          {item.estado}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-800">Planes y Tarifas</h2>
          <p className="text-sm text-gray-400 font-medium">
            Gestiona los precios de los módulos del sistema
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={plans}
        onView={(item: PlanPrecio) => {
          setSelectedPlan(item);
          setIsViewModalOpen(true);
        }}
        onEdit={(item: PlanPrecio) => console.log("Editar", item)}
        onDelete={(item: PlanPrecio) => {
          if (confirm("¿Estás seguro de eliminar este plan?")) {
            setPlans(plans.filter((p: PlanPrecio) => p.id !== item.id));
          }
        }}
        actions={[
          {
            label: "Nuevo Plan",
            icon: <RiPriceTag3Line />,
            onClick: () => console.log("Crear nuevo plan"),
            className:
              "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 px-6 py-3 rounded-2xl",
          },
        ]}
      />

      <VerPlanModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        plan={selectedPlan}
      />
    </div>
  );
}
