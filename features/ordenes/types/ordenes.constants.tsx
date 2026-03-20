import { FilterConfig } from "@/components/shared/dataTable/FilterGeneral";

export interface Medication {
  brand: string;
  activeIngredient: string;
  dosage: string;
  tablets: string;
  barCode: string;
  name: string;
  image: string;
  category: string;
  subcategory: string;
  price: number;
  quantity: number;
  stock: number;
  description: string;
  controlled: boolean;
  vat: number;
  antibiotic: boolean;
  minimum: number;
}

export interface Payment {
  runtimeType: string;
  change: number;
  amount: number;
}

export interface Client {
  id: string;
  documento: string;
  name: string;
  email: string;
  direccion: string;
  phone: string;
}

export interface Ordenes {
  date: string;
  idOrder: string;
  nameGroup: string;
  idAgent: string;
  nameAgent: string;
  idPharmacy: string;
  idGroup: string;
  medications: Medication[];
  totalreal: number;
  totalsystem: number;
  client: Client;
  payments: Payment[];
  rate: number;
  gender: string;
  saleStatus: string;
  isControlled: boolean;
  saleType: string;
  address: string;
  pharmacy: string;
  delivery: string | null;
  numeroControlInterno: string | null;
  facturacion: string | null;
  observation: string | null;
}

export const COLUMNS = [
  { header: "ID Orden", key: "id" },
  {
    header: "Fecha/Hora",
    key: "date",
    render: (item: Ordenes) => new Date(item.date).toLocaleString(),
  },
  {
    header: "Tipo",
    key: "saleType",
    render: (item: Ordenes) => (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          item.saleType === "Local"
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.saleType.toUpperCase()}
      </span>
    ),
  },
  {
    header: "Entidad",
    key: "nameGroup",
    render: (item: Ordenes) => (
      <div className="flex flex-col">
        <span className="text-gray-800 leading-none font-medium">
          {item.nameGroup}
        </span>
        <div className="flex gap-3">
          <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
            {item.pharmacy}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Cliente",
    key: "client",
    render: (item: Ordenes) => {
      return item.client.name;
    },
    // `${item.client.name} ${item.client.documento}`.trim(),
  },
  {
    header: "Total",
    key: "totalreal",
    render: (item: Ordenes) => (
      <span className="font-bold text-gray-700">
        ${item.totalreal.toFixed(2)}
      </span>
    ),
  },
];

export const FILTER_CONFIG: FilterConfig[] = [
  {
    key: "nameGroup",
    label: "Grupos",
    type: "select",
  },
  {
    key: "pharmacy",
    label: "Farmacias",
    type: "select",
  },
  {
    key: "saleType",
    label: "Tipo Venta",
    type: "select",
    options: ["Local", "Delivery", "Pickup"],
  },
  {
    key: "date",
    label: "Fecha",
    type: "date-range",
  },
];
