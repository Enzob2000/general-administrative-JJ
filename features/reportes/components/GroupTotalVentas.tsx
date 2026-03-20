"use client";

import { useMemo } from "react";
import { usePharmacyOrders } from "../hooks/usePharmacyOrders";
import { DateRange } from "../types/reportes.constants";

interface GroupTotalVentasProps {
  groupId: string;
  dateRange: DateRange;
}

export const GroupTotalVentas = ({
  groupId,
  dateRange,
}: GroupTotalVentasProps) => {
  const { data, isLoading } = usePharmacyOrders(groupId, dateRange);

  const total = useMemo(() => {
    if (!data) return 0;
    return data.reduce((acc, curr) => acc + (curr.total_orders || 0), 0);
  }, [data]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  if (isLoading) {
    return <span className="animate-pulse font-bold text-blue-400">...</span>;
  }

  return (
    <span className="font-black text-sm text-blue-700">${fmt(total)}</span>
  );
};
