import { FilterConfig } from "@/components/shared/dataTable/FilterGeneral";

export interface PrincipioActivo {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
}

export const MOCK_PRINCIPIOS: PrincipioActivo[] = [
  {
    id: "PA-001",
    nombre: "Amoxicilina",
    descripcion: "Antibiótico betalactámico bactericida.",
    fecha_creacion: "2026-01-10T08:00:00Z",
  },
  {
    id: "PA-002",
    nombre: "Ibuprofeno",
    descripcion: "Antiinflamatorio no esteroideo (AINE).",
    fecha_creacion: "2026-01-12T10:00:00Z",
  },
  {
    id: "PA-003",
    nombre: "Loratadina",
    descripcion: "Antihistamínico de segunda generación.",
    fecha_creacion: "2026-01-15T15:00:00Z",
  },
];

export const columns = [
  {
    header: "Nombre del Principio Activo",
    key: "nombre",
    // Hacemos que el nombre resalte un poco más
    render: (item: PrincipioActivo) => item.nombre.toUpperCase(),
  },
  {
    header: "Descripción",
    key: "descripcion",
  },
  {
    header: "Fecha de Registro",
    key: "fecha_creacion",
    render: (item: PrincipioActivo) =>
      new Date(item.fecha_creacion).toLocaleDateString(),
  },
];

export const FILTER_CONFIG: FilterConfig[] = [
  {
    key: "search",
    label: "Buscar principio activo...",
    type: "search",
  },
  {
    key: "order",
    label: "Ordenar por",
    type: "select",
    options: [
      { label: "Nombre (A-Z)", value: "asc" },
      { label: "Nombre (Z-A)", value: "desc" },
      { label: "Más recientes", value: "newest" },
      { label: "Más antiguos", value: "oldest" },
    ],
  },
];
