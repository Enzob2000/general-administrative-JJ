"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error: any) => {
            if (error.message?.includes("AUTENTICACION_REQUERIDA")) {
              alert(
                "Sesión requerida: No se encontró un token válido. Por favor, inicia sesión.",
              );
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            onError: (error: any) => {
              if (error.message?.includes("AUTENTICACION_REQUERIDA")) {
                alert("Acción bloqueada: Debes estar autenticado.");
              } else {
                console.error("[Mutation Error]", error);
              }
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
