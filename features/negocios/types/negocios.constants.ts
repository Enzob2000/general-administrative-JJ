import React from "react";
import { ApiText } from "@/features/grupos/components/ApiText";

export interface Negocio {
  id: string;
  name: string;
  name_group?: string;
  id_group: string;
  health_code: string;
  rif: string;
  mpps: string;
  anniversary_month: string;
  active_modules: string[];
  status?: "Pendiente" | "PorPagar" | "AlDia" | "Retrasada";
  custom_plan_price?: string;
  geolocation?: {
    type: string;
    coordinates: [number, number];
  };
  payment?: {
    name: string;
    cedula: string;
    bank_account: string;
  };
  account_payment?: Array<{
    name: string;
    cedula: string;
    bank_account: string;
  }>;
  payment_pago_movil?: Array<{
    bank: string;
    number: string;
    rif: string;
  }>;
}

export const columns = [
  { header: "Nombre de la Farmacia", key: "name" },
  {
    header: "Grupo",
    key: "id",
    render: (item: Negocio) =>
      React.createElement(ApiText, {
        id: item.id_group,
        endpoint: "/admin/PharmacyGroup/namegroup",
        queryKey: "group-name",
        field: "name_group",
      }),
  },
  {
    header: "Estado",
    key: "status",
    render: (item: Negocio) => {
      const status = item.status || "Desconocido";
      const colors: Record<string, string> = {
        AlDia: "bg-emerald-100 text-emerald-600 border-emerald-200",
        PorPagar: "bg-amber-100 text-amber-600 border-amber-200",
        Retrasada: "bg-rose-100 text-rose-600 border-rose-200",
        Pendiente: "bg-blue-100 text-blue-600 border-blue-200",
      };

      const statusLabels: Record<string, string> = {
        AlDia: "Al día",
        PorPagar: "Por pagar",
        Retrasada: "Retrasada",
        Pendiente: "Pendiente",
      };

      return React.createElement(
        "span",
        {
          className: `px-2 py-0.5 text-[10px] font-black uppercase rounded-md border ${colors[status] || "bg-gray-100 text-gray-600 border-gray-200"}`,
        },
        statusLabels[status] || status,
      );
    },
  },
  {
    header: "Módulos",
    key: "active_modules",
    render: (item: Negocio) => {
      const modules = item.active_modules || [];
      if (modules.length === 0) return "Ninguno";
      return React.createElement(
        "div",
        { className: "flex flex-wrap gap-1" },
        modules.map((mod) =>
          React.createElement(
            "span",
            {
              key: mod,
              className:
                "px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-black uppercase rounded-md border border-blue-200",
            },
            mod === "DigitalBilling"
              ? "Facturación"
              : mod === "Accounting"
                ? "Contabilidad"
                : mod,
          ),
        ),
      );
    },
  },
  { header: "RIF", key: "rif" },
  { header: "Código Sanitario", key: "health_code" },
];

export const FILTER_CONFIG = [
  {
    key: "id_group",
    label: "Grupos",
    type: "select" as const,
    endpoint: "/admin/PharmacyGroup/groupsPharmacy",
    optionKey: "name_group",
    valueKey: "id",
  },
];
