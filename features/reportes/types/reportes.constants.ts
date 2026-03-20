// ─── Types de la API de Reportes ─────────────────────────────────────────────

export interface CategorySummary {
  category: string;
  count: number;
  total: number;
}

export interface PharmacyOrderResult {
  name_pharmacy: string;
  total_orders: number;
  categories: CategorySummary[];
}

/** Grupo tal como llega desde /admin/PharmacyGroup/groupsPharmacy */
export interface GrupoApi {
  id: string;
  name_group: string;
  pharmacies: string[];
  description?: string;
  created_at?: string;
}

/** Rango de fechas para los filtros y la búsqueda */
export interface DateRange {
  start: string; // ISO string
  end: string; // ISO string
}

// ─── Medicamento ──────────────────────────────────────────────────────────────

export interface Medicamento {
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
  timestamp: number;
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

const MEDICATIONS_BASE_URL =
  process.env.NEXT_PUBLIC_MEDICATIONS_BASE_URL || "https://medizins.com";

export const getProductImageUrl = (
  imageName: string | undefined,
): string | null => {
  if (!imageName || imageName.trim() === "" || imageName === "null")
    return null;
  if (imageName.startsWith("http")) return imageName;
  const baseUrl = MEDICATIONS_BASE_URL.endsWith("/")
    ? MEDICATIONS_BASE_URL.slice(0, -1)
    : MEDICATIONS_BASE_URL;
  return `${baseUrl}/MedicationImage/download/${imageName}`;
};

/**
 * Divide un activeIngredient que puede tener múltiples valores separados por " / "
 * en un array de strings individuales, limpiando espacios.
 * Ej: "Carbidopa / Levodopa" → ["Carbidopa", "Levodopa"]
 */
export const splitActiveIngredients = (ai: string): string[] => {
  return ai
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
};

/** Obtiene todos los principios activos únicos de un listado de medicamentos */
export const getUniqueActiveIngredients = (meds: Medicamento[]): string[] => {
  const set = new Set<string>();
  meds.forEach((m) => {
    if (m.activeIngredient) {
      splitActiveIngredients(m.activeIngredient).forEach((ai) => set.add(ai));
    }
  });
  return Array.from(set).sort();
};

/** Obtiene todas las categorías únicas */
export const getUniqueCategories = (meds: Medicamento[]): string[] => {
  const set = new Set<string>();
  meds.forEach((m) => {
    if (m.category) set.add(m.category);
  });
  return Array.from(set).sort();
};

/** Obtiene todas las marcas únicas */
export const getUniqueBrands = (meds: Medicamento[]): string[] => {
  const set = new Set<string>();
  meds.forEach((m) => {
    if (m.brand) set.add(m.brand);
  });
  return Array.from(set).sort();
};

/** Obtiene todas las dosificaciones únicas */
export const getUniqueDosages = (meds: Medicamento[]): string[] => {
  const set = new Set<string>();
  meds.forEach((m) => {
    if (m.dosage) set.add(m.dosage);
  });
  return Array.from(set).sort();
};

// ─── Top Analysis Results ─────────────────────────────────────────────────────

export interface TopPharmacyResult {
  id_pharmacy: string | null;
  pharmacy: string;
  total_ordenes: number;
  total_ventas: number;
}

export interface TopAgentResult {
  id_agent: string | null;
  name_agent: string;
  total_ordenes: number;
  total_ventas: number;
}

export interface TopCategoryResult {
  category: string;
  total_ventas: number;
  total_items_vendidos: number;
}

export interface TopMedicationResult {
  name: string;
  brand: string;
  category: string;
  total_quantity: number;
  controlled: boolean;
  unit_price: number;
  total_revenue: number;
}

/** Formatea un timestamp (microsegundos o milisegundos) a fecha legible */
export const formatTimestamp = (ts: number): string => {
  // Los timestamps de la API son en microsegundos (16 dígitos)
  // Date() espera millisegundos (13 dígitos)
  const ms = ts > 1e13 ? Math.floor(ts / 1000) : ts;
  return new Date(ms).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

// ─── Reporte de Entregas ─────────────────────────────────────────────────────

export interface Delivery {
  id_repartidor: string;
  cantidad_viajes: number;
  total_comisiones_delivery: number;
  total_ventas_entregadas: number;
}
