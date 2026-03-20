import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Medicamento } from "../types/reportes.constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://medizins.com";
const MEDICATIONS_URL = `${BASE_URL}/Medications`;

interface UseMedicamentosResult {
  medications: Medicamento[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
  search: (text: string | null) => void;
}

/**
 * Carga medicamentos desde el endpoint POST /Medications/list o /Medications/Search con paginación por cursor.
 */
export function useMedicamentos(size: number = 50): UseMedicamentosResult {
  const [medications, setMedications] = useState<Medicamento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);
  const initialized = useRef(false);

  const fetchPage = useCallback(
    async (cursorValue: string | null, reset: boolean, text: string | null) => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoint = text
          ? `${MEDICATIONS_URL}/Search`
          : `${MEDICATIONS_URL}/list`;
        const response = await axios.post(endpoint, {
          text: text || null,
          cursor: cursorValue,
          size,
        });
        const raw = response.data;
        const meds: Medicamento[] = Array.isArray(raw?.medications)
          ? raw.medications
          : Array.isArray(raw)
            ? raw
            : [];
        const nextCursor: string | null =
          raw?.cursor ?? raw?.next_cursor ?? null;

        setMedications((prev) => (reset ? meds : [...prev, ...meds]));
        setCursor(nextCursor);
        setHasMore(!!nextCursor && meds.length >= size);
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar medicamentos");
      } finally {
        setIsLoading(false);
      }
    },
    [size],
  );

  // Initial load / refetch when fetchKey or searchText changes
  useEffect(() => {
    initialized.current = true;
    setMedications([]);
    setCursor(null);
    setHasMore(true);
    fetchPage(null, true, searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey, searchText]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPage(cursor, false, searchText);
    }
  }, [isLoading, hasMore, cursor, searchText, fetchPage]);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  const search = useCallback((text: string | null) => {
    setSearchText(text);
  }, []);

  return { medications, isLoading, error, hasMore, loadMore, refetch, search };
}
