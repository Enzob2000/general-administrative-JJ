export interface PlanPrecio {
  id: string;
  nombre: string;
  precio: number;
  periodo: "mensual" | "anual" | "unico";
  modulos_incluidos: string[];
  descripcion: string;
  estado: "activo" | "inactivo";
  grupos_count: number;
}

export interface GrupoAsociado {
  id: string;
  nombre: string;
  rif: string;
  farmacias_count: number;
  fecha_contratacion: string;
}

export const MODULOS_DISPONIBLES = [
  "Farmacias",
  "Inventario",
  "Facturación",
  "Reportes",
  "Logística",
  "Delivery",
  "Analítica Pro",
  "Soporte 24/7",
];
