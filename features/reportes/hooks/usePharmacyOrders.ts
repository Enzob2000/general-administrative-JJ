import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { PharmacyOrderResult, DateRange } from "../types/reportes.constants";

interface UsePharmacyOrdersResult {
  data: PharmacyOrderResult[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Llama al endpoint POST /admin/Orders/SearchOrdersPharmacy
 * para obtener el resumen de órdenes por farmacia de un grupo dado.
 */
export function usePharmacyOrders(
  groupId: string | null,
  dateRange: DateRange,
): UsePharmacyOrdersResult {
  const [data, setData] = useState<PharmacyOrderResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const fetch = useCallback(async () => {
    if (!groupId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/admin/Orders/SearchOrdersPharmacy", {
        id_group: groupId,
        date: {
          start: dateRange.start,
          end: dateRange.end,
        },
      });
      const raw = response.data?.result ?? response.data?.data ?? response.data;
      setData(Array.isArray(raw) ? raw : []);
    } catch (err: any) {
      setError(err?.message ?? "Error al cargar órdenes");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [groupId, dateRange.start, dateRange.end, fetchKey]); // eslint-disable-line

  useEffect(() => {
    fetch();
  }, [fetch]);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  return { data, isLoading, error, refetch };
}
