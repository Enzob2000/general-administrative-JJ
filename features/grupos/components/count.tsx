import React from "react";
import { useApiQuery } from "@/hooks/useApi";

interface GenericCounterProps {
  id: string;
  endpoint: string;
  queryKey: string;
}

export const ApiCounter = ({ id, endpoint, queryKey }: GenericCounterProps) => {
  const { data, isLoading } = useApiQuery<any[]>(
    [queryKey, id],
    `${endpoint}/${id}`,
  );

  if (isLoading) {
    return React.createElement(
      "span",
      { className: "animate-pulse font-bold text-blue-400" },
      "...",
    );
  }

  return React.createElement(
    "span",
    { className: "font-bold text-gray-700" },
    Array.isArray(data) ? data.length : 0,
  );
};
