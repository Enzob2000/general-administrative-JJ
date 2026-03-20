import { FilterConfig } from "@/components/shared/dataTable/FilterGeneral";
import React from "react";

export interface Producto {
  id: string;
  foto_url?: string;
  nombre: string;
  principio_activo: string;
  categoria: string;
  marca: string;
  fecha_ingreso: string;
}

export const MOCK_PRODUCTOS: Producto[] = [
  {
    id: "PROD-001",
    nombre: "Amoxicilina 500mg",
    principio_activo: "Amoxicilina",
    categoria: "Antibióticos",
    marca: "Genfar",
    fecha_ingreso: "2026-01-28T12:00:00Z",
  },
  {
    id: "PROD-002",
    nombre: "Teragrip Noche",
    principio_activo: "Acetaminofén + Otros",
    categoria: "Salud Respiratoria",
    marca: "Meyer",
    fecha_ingreso: "2026-01-29T09:00:00Z",
  },
  {
    id: "PROD-003",
    nombre: "Ibuprofeno 600mg",
    principio_activo: "Ibuprofeno",
    categoria: "Analgésicos",
    marca: "Advil",
    fecha_ingreso: "2026-01-25T10:30:00Z",
  },
  {
    id: "PROD-004",
    nombre: "Loratadina 10mg",
    principio_activo: "Loratadina",
    categoria: "Antialérgicos",
    marca: "Claritin",
    fecha_ingreso: "2026-01-20T08:15:00Z",
  },
  {
    id: "PROD-005",
    nombre: "Omeprazol 20mg",
    principio_activo: "Omeprazol",
    categoria: "Gastrointestinal",
    marca: "Proweb",
    fecha_ingreso: "2026-01-15T14:20:00Z",
  },
  {
    id: "PROD-006",
    nombre: "Atamel Forte",
    principio_activo: "Acetaminofén",
    categoria: "Analgésicos",
    marca: "Pfizer",
    fecha_ingreso: "2026-01-27T11:00:00Z",
  },
  {
    id: "PROD-007",
    nombre: "Diclofenac Sódico",
    principio_activo: "Diclofenac",
    categoria: "Antiinflamatorios",
    marca: "Voltaren",
    fecha_ingreso: "2026-01-22T09:45:00Z",
  },
  {
    id: "PROD-008",
    nombre: "Losartán Potásico 50mg",
    principio_activo: "Losartán",
    categoria: "Cardiovascular",
    marca: "Calox",
    fecha_ingreso: "2026-01-10T16:30:00Z",
  },
  {
    id: "PROD-009",
    nombre: "Metformina 850mg",
    principio_activo: "Metformina",
    categoria: "Antidiabéticos",
    marca: "Merck",
    fecha_ingreso: "2026-01-05T07:00:00Z",
  },
  {
    id: "PROD-010",
    nombre: "Cetirizina 10mg",
    principio_activo: "Cetirizina",
    categoria: "Antialérgicos",
    marca: "Zyrtec",
    fecha_ingreso: "2026-01-18T13:00:00Z",
  },
  {
    id: "PROD-011",
    nombre: "Salbutamol Inhalador",
    principio_activo: "Salbutamol",
    categoria: "Salud Respiratoria",
    marca: "Glaxo",
    fecha_ingreso: "2026-01-29T10:00:00Z",
  },
  {
    id: "PROD-012",
    nombre: "Azitromicina 500mg",
    principio_activo: "Azitromicina",
    categoria: "Antibióticos",
    marca: "Sandoz",
    fecha_ingreso: "2026-01-12T15:20:00Z",
  },
  {
    id: "PROD-013",
    nombre: "Vitamina C 1g",
    principio_activo: "Ácido Ascórbico",
    categoria: "Multivitamínicos",
    marca: "Redoxon",
    fecha_ingreso: "2026-01-24T08:00:00Z",
  },
  {
    id: "PROD-014",
    nombre: "Enterogermina",
    principio_activo: "Bacillus clausii",
    categoria: "Probióticos",
    marca: "Sanofi",
    fecha_ingreso: "2026-01-26T12:30:00Z",
  },
  {
    id: "PROD-015",
    nombre: "Dexametasona 4mg",
    principio_activo: "Dexametasona",
    categoria: "Corticosteroides",
    marca: "Stein",
    fecha_ingreso: "2026-01-02T11:15:00Z",
  },
  {
    id: "PROD-016",
    nombre: "Buscapina Duo",
    principio_activo: "Hioscina + Ibuprofeno",
    categoria: "Antiespasmódicos",
    marca: "Boehringer",
    fecha_ingreso: "2026-01-21T09:00:00Z",
  },
  {
    id: "PROD-017",
    nombre: "Ciprofloxacina 500mg",
    principio_activo: "Ciprofloxacina",
    categoria: "Antibióticos",
    marca: "Bayer",
    fecha_ingreso: "2026-01-14T14:00:00Z",
  },
  {
    id: "PROD-018",
    nombre: "Enalapril 10mg",
    principio_activo: "Enalapril",
    categoria: "Cardiovascular",
    marca: "Leti",
    fecha_ingreso: "2026-01-11T10:45:00Z",
  },
  {
    id: "PROD-019",
    nombre: "Fluconazol 150mg",
    principio_activo: "Fluconazol",
    categoria: "Antifúngicos",
    marca: "Diflucan",
    fecha_ingreso: "2026-01-19T17:00:00Z",
  },
  {
    id: "PROD-020",
    nombre: "Gaviscon Suspensión",
    principio_activo: "Alginato de Sodio",
    categoria: "Gastrointestinal",
    marca: "Reckitt",
    fecha_ingreso: "2026-01-28T15:30:00Z",
  },
];

export const columns = [
  {
    header: "Imagen",
    key: "foto_url",
    render: () =>
      React.createElement(
        "div",
        {
          className:
            "w-12 h-12 bg-gray-200 rounded-md border flex items-center justify-center text-[10px] text-gray-400",
        },
        "No Image",
      ),
  },
  {
    header: "Producto",
    key: "nombre",
  },
  {
    header: "Principio Activo",
    key: "principio_activo",
  },
  {
    header: "Categoría",
    key: "categoria",
  },
  {
    header: "Marca",
    key: "marca",
  },
  {
    header: "Fecha",
    key: "fecha_ingreso",
    render: (item: Producto) =>
      new Date(item.fecha_ingreso).toLocaleDateString(),
  },
];

export const FILTER_CONFIG: FilterConfig[] = [
  {
    key: "principio_activo",
    label: "Principio Activo",
    type: "select",
    endpoint: "Products/active-principles",
    optionKey: "name",
  },
  {
    key: "fecha_ingreso",
    label: "Fecha de Ingreso",
    type: "date",
  },
];
