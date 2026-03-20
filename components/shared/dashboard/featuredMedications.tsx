"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "../cards/dashboardCard";
import { useTopMedications } from "@/features/reportes/hooks/useAnalysis";
import { DateRange } from "@/features/reportes/types/reportes.constants";
import {
  RiMedicineBottleLine,
  RiLoader4Line,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import {
  TimeRangeOption,
  getTimeRangeDate,
  getTimeRangeLabel,
} from "@/features/reportes/utils/dateFilters";
import { TimeRangeSelector } from "./TimeRangeSelector";

export const FeaturedMedications = () => {
  const [range, setRange] = useState<TimeRangeOption>("hoy");
  const dateRange = useMemo<DateRange>(() => getTimeRangeDate(range), [range]);

  const { data, isLoading, error } = useTopMedications(dateRange);

  const maxSales = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map((m) => m.total_quantity));
  }, [data]);

  return (
    <DashboardCard
      title="Movimientos de Inventario"
      className="md:col-span-2 h-[450px]"
      extra={<TimeRangeSelector value={range} onChange={setRange} />}
    >
      <div className="h-full overflow-y-auto pr-4 pb-6 py-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <RiLoader4Line
              size={32}
              className="animate-spin text-blue-600/30"
            />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-300">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
              Sin registros hoy
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((m, i) => {
              const isFirst = i === 0;
              const progress = (m.total_quantity / maxSales) * 100;

              return (
                <div
                  key={i}
                  className={`relative bg-white border rounded-[2.2rem] p-5 transition-all duration-500 group
                    ${
                      isFirst
                        ? "border-blue-200 shadow-xl shadow-blue-100/30 bg-gradient-to-br from-white via-white to-blue-50/40"
                        : "border-gray-100 hover:border-blue-100 hover:shadow-lg shadow-sm"
                    } min-h-[160px] flex flex-col justify-between`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2.5 rounded-2xl shrink-0 transition-colors duration-500 ${isFirst ? "bg-blue-600 shadow-lg shadow-blue-200" : "bg-gray-50 border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100"}`}
                    >
                      <RiMedicineBottleLine
                        size={20}
                        className={
                          isFirst
                            ? "text-white"
                            : "text-gray-400 group-hover:text-blue-500"
                        }
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[13px] font-black text-gray-800 leading-tight truncate">
                        {m.name}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate mt-0.5">
                        {m.brand}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[16px] font-black text-gray-900 tracking-tighter">
                          $
                          {m.total_revenue.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-[8px] font-black text-blue-500/60 uppercase tracking-widest mt-1">
                          Revenue
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-[22px] font-black leading-none tracking-tighter ${isFirst ? "text-blue-600" : "text-gray-800"}`}
                        >
                          {m.total_quantity}
                        </span>
                        <span className="text-[8px] font-black text-gray-300 uppercase">
                          Qty
                        </span>
                      </div>
                    </div>

                    {/* Barra de progreso más refinada */}
                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out 
                          ${isFirst ? "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "bg-gray-200"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {isFirst && (
                    <div className="absolute -top-1.5 -right-1.5 shadow-lg rounded-full">
                      <RiCheckboxCircleFill
                        className="text-blue-600 bg-white rounded-full"
                        size={20}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CSS interno para inyectar en tu layout o archivo global si prefieres */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </DashboardCard>
  );
};
