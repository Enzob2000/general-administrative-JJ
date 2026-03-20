import React from "react";
import { useApiQuery } from "@/hooks/useApi";

interface ApiTextProps {
  id: string;
  endpoint: string;
  queryKey: string;
  field?: string;
}

export const ApiText = ({
  id,
  endpoint,
  queryKey,
  field = "name",
}: ApiTextProps) => {
  const { data, isLoading, error } = useApiQuery<any>(
    [queryKey, id],
    `${endpoint}/${id}`,
  );

  if (isLoading) {
    return React.createElement(
      "span",
      { className: "animate-pulse text-gray-400 text-xs" },
      "Cargando...",
    );
  }

  let displayValue = id;

  if (data) {
    if (typeof data === "string" || typeof data === "number") {
      displayValue = String(data);
    } else if (typeof data === "object" && data !== null) {
      if (data[field]) {
        displayValue = String(data[field]);
      } else if (data.name_group) {
        displayValue = String(data.name_group);
      } else if (data.name) {
        displayValue = String(data.name);
      }
    }
  }

  return React.createElement(
    "span",
    { className: "font-bold text-gray-700" },
    displayValue,
  );
};
