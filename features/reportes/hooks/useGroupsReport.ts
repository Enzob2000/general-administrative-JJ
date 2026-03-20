import { useApiQuery } from "@/hooks/useApi";
import { GrupoApi } from "../types/reportes.constants";

/**
 * Obtiene la lista de grupos desde la API.
 * Reutiliza el mismo endpoint que la sección de Grupos del panel.
 */
export function useGroupsReport() {
  return useApiQuery<GrupoApi[]>(
    ["reporte-grupos"],
    "/admin/PharmacyGroup/groupsPharmacy",
  );
}
