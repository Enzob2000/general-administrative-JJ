import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import {
  TopPharmacyResult,
  TopAgentResult,
  TopCategoryResult,
  TopMedicationResult,
  DateRange,
} from "../types/reportes.constants";

interface UseAnalysisResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

function useTopAnalysis<T>(
  endpoint: string,
  dateRange: DateRange,
): UseAnalysisResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(endpoint, {
        start: dateRange.start,
        end: dateRange.end,
      });

      const rawData =
        response.data?.result || response.data?.data || response.data;

      // Debugging requested by user
      // console.log(`[useTopAnalysis] Endpoint: ${endpoint}`);
      // console.log(JSON.stringify(rawData, null, 2));

      setData((Array.isArray(rawData) ? rawData : []) as T);
    } catch (err: any) {
      console.error(`[useTopAnalysis Error] ${endpoint}:`, err);
      setError(err?.message || "Error fetching analysis data");
      setData([] as unknown as T);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, dateRange.start, dateRange.end, fetchKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => setFetchKey((k) => k + 1);

  return { data, isLoading, error, refetch };
}

export function useTopPharmacies(dateRange: DateRange) {
  return useTopAnalysis<TopPharmacyResult[]>(
    "/admin/Orders/topfeaturedpharmacies",
    dateRange,
  );
}

export function useTopAgents(dateRange: DateRange) {
  return useTopAnalysis<TopAgentResult[]>(
    "/admin/Orders/topfeaturedagent",
    dateRange,
  );
}

export function useTopCategories(dateRange: DateRange) {
  return useTopAnalysis<TopCategoryResult[]>(
    "/admin/Orders/topfeaturedcategories",
    dateRange,
  );
}

export function useTopMedications(dateRange: DateRange) {
  return useTopAnalysis<TopMedicationResult[]>(
    "/admin/Orders/topfeaturedmedication",
    dateRange,
  );
}
