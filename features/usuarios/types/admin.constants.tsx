import React from "react";

export interface Admin {
  id?: string;
  user: string;
  name: string;
  email: string;
  password?: string;
  rol: string[];
  created_at: string;
  description?: string;
}

export const columns = [
  {
    header: "Usuario",
    key: "user",
    render: (item: Admin) => (
      <span className="font-bold text-blue-600">@{item.user}</span>
    ),
  },
  {
    header: "Nombre Completo",
    key: "name",
    render: (item: Admin) => (
      <span className="font-medium text-gray-800">{item.name}</span>
    ),
  },
  {
    header: "Correo Electrónico",
    key: "email",
    render: (item: Admin) => (
      <span className="text-gray-600 text-sm">{item.email}</span>
    ),
  },
  {
    header: "Roles",
    key: "rol",
    render: (item: Admin) => (
      <div className="flex flex-wrap gap-1">
        {item.rol.map((r) => (
          <span
            key={r}
            className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-md border border-blue-100"
          >
            {r}
          </span>
        ))}
      </div>
    ),
  },
  {
    header: "Fecha Registro",
    key: "created_at",
    render: (item: Admin) =>
      item.created_at
        ? new Date(item.created_at).toLocaleDateString("es-VE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—",
  },
];

export const FILTER_CONFIG = [
  {
    key: "user",
    label: "Usuario",
    type: "text",
  },
  {
    key: "rol",
    label: "Rol",
    type: "select",
    options: [
      { label: "Super Admin", value: "SuperAdmin" },
      { label: "Gestión Usuarios", value: "ManageSystemUsers" },
      { label: "Farmacias", value: "ReadPharmacy" },
      { label: "Logística", value: "LogisticsManager" },
      { label: "Analítica", value: "ViewStatistics" },
    ],
  },
];
