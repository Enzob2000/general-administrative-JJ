import React from "react";
import { FilterConfig } from "@/components/shared/dataTable/FilterGeneral";

export type TipoUsuario = "Delivery" | "Enfermero" | "Informero" | "Conductor";
export type EstadoUsuario =
  | "Completado"
  | "En trámite"
  | "Cancelado"
  | "Pendiente";

// 1. Mapeo de colores por estado (Soportando valores de la API)
const STATUS_STYLES: Record<string, { label: string; classes: string }> = {
  COMPLETED: {
    label: "Completado",
    classes: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  Completed: {
    label: "Completado",
    classes: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  PENDING: {
    label: "Pendiente",
    classes: "bg-amber-50 text-amber-600 border-amber-100",
  },
  Pending: {
    label: "Pendiente",
    classes: "bg-amber-50 text-amber-600 border-amber-100",
  },
  CANCELLED: {
    label: "Rechazado",
    classes: "bg-rose-50 text-rose-600 border-rose-100",
  },
  Cancelled: {
    label: "Rechazado",
    classes: "bg-rose-50 text-rose-600 border-rose-100",
  },
  "En trámite": {
    label: "En trámite",
    classes: "bg-blue-50 text-blue-600 border-blue-100",
  },
};

export interface VehiculoUsuario {
  marca: string;
  modelo: string;
  anio: string;
  numero_placa: string;
  numero_puestos: string;
}

export interface Usuario {
  _id: string;
  id: string;
  full_name: string;
  cedula: string;
  email: string;
  phone_number: string;
  registration_date: string;
  delivery_status: EstadoUsuario;
  saldo: number;
  numero_rif?: string;
  vehiculo?: VehiculoUsuario;
  foto_url?: string;
  cedula_url?: string;
  licencia_url?: string;
}

export const columns = [
  {
    header: "Nombre y Apellidos",
    key: "full_name",
    render: (item: Usuario) => (
      <div className="flex items-center gap-3">
        {item.foto_url && (
          <img
            src={item.foto_url}
            alt={item.full_name}
            className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
          />
        )}
        <span className="font-semibold text-gray-800 text-sm">
          {item.full_name}
        </span>
      </div>
    ),
  },
  {
    header: "Cédula",
    key: "cedula",
    render: (item: Usuario) => (
      <span className="text-sm text-gray-700 font-mono">
        {item.cedula || "N/A"}
      </span>
    ),
  },
  {
    header: "Correo",
    key: "email",
    render: (item: Usuario) => (
      <span className="text-xs text-gray-600">{item.email}</span>
    ),
  },
  {
    header: "Fecha",
    key: "registration_date",
    render: (item: Usuario) =>
      item.registration_date
        ? new Date(item.registration_date).toLocaleDateString("es-VE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—",
  },
  {
    header: "Estado",
    key: "delivery_status",
    render: (item: Usuario) => {
      const style = STATUS_STYLES[item.delivery_status] || {
        label: item.delivery_status || "Pendiente",
        classes: "bg-gray-50 text-gray-400 border-gray-100",
      };

      return (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${style.classes}`}
        >
          {style.label}
        </span>
      );
    },
  },
];

export const FILTER_CONFIG: FilterConfig[] = [
  {
    key: "registration_date",
    label: "Fecha",
    type: "date",
  },
  {
    key: "delivery_status",
    label: "Estado del usuario",
    type: "select",
    options: [
      { label: "Completado", value: "COMPLETED" },
      { label: "En trámite", value: "En trámite" },
      { label: "Rechazado", value: "CANCELLED" },
      { label: "Pendiente", value: "PENDING" },
    ],
  },
];
