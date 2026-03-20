import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

export function useApiQuery<T>(
  key: any[],
  endpoint: string,
  options: any = {},
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      try {
        // Extraemos method y body de las opciones, por defecto es GET
        const { method = "get", body, ...axiosConfig } = options;

        // Si es GET, usamos .get, si no, usamos el método correspondiente con el body
        const response = await api({
          method,
          url: endpoint,
          data: body, // En Axios el body se pasa en la propiedad 'data'
          ...axiosConfig,
        });

        const finalData =
          response.data?.result || response.data?.data || response.data;

        return finalData;
      } catch (error: any) {
        throw error;
      }
    },
    ...options,
  });
}

/**
 * Hook generico para mutaciones (POST, PUT, DELETE)
 */
export function useApiMutation<T, B = any>(
  method: "post" | "put" | "delete",
  endpoint?: string,
  options: any = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ url, body }: { url?: string; body?: B }) => {
      const targetUrl = url || endpoint;
      if (!targetUrl) throw new Error("No endpoint provided for mutation");

      const response =
        method === "delete"
          ? await api.delete(targetUrl)
          : await api[method](targetUrl, body);

      return response.data;
    },
    ...options,
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries();
      if (options.onSuccess) options.onSuccess(...args);
    },
  });
}
