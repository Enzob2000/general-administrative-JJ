"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "../cards/dashboardCard";
import { useTopPharmacies } from "@/features/reportes/hooks/useAnalysis";
import { DateRange } from "@/features/reportes/types/reportes.constants";
import { RiStore2Line, RiLoader4Line } from "react-icons/ri";
import {
  TimeRangeOption,
  getTimeRangeDate,
  getTimeRangeLabel,
} from "@/features/reportes/utils/dateFilters";
import { TimeRangeSelector } from "./TimeRangeSelector";

export const FeaturedBusiness = () => {
  const [range, setRange] = useState<TimeRangeOption>("hoy");
  const dateRange = useMemo<DateRange>(() => getTimeRangeDate(range), [range]);

  const { data, isLoading, error } = useTopPharmacies(dateRange);

  const colors = [
    "bg-orange-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-purple-100",
    "bg-pink-100",
  ];

  return (
    <DashboardCard
      title="Negocios Destacados"
      className="h-[400px]"
      extra={<TimeRangeSelector value={range} onChange={setRange} />}
    >
      <div className="flex flex-col gap-3 h-full overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <RiLoader4Line size={24} className="animate-spin text-blue-500" />
            <p className="text-sm font-medium">Cargando negocios...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center text-sm text-red-400 italic">
            Error al cargar negocios destacados.
          </div>
        ) : !data || data.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400 italic">
            No hay negocios destacados hoy.
          </div>
        ) : (
          data.map((f, i) => (
            <div
              key={f.id_pharmacy || i}
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-gray-100/50 hover:bg-white hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${colors[i % colors.length]} flex items-center justify-center border-2 border-white shadow-sm shrink-0`}
                >
                  <RiStore2Line size={18} className="text-gray-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 leading-tight truncate">
                    {f.pharmacy}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                    {f.total_ordenes} órdenes (
                    {getTimeRangeLabel(range).toLowerCase()})
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100/50">
                +$
                {f.total_ventas.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </DashboardCard>
  );
};
