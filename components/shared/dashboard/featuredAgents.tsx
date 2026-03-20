"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "../cards/dashboardCard";
import { useTopAgents } from "@/features/reportes/hooks/useAnalysis";
import { DateRange } from "@/features/reportes/types/reportes.constants";
import {
  RiUserSharedLine,
  RiLoader4Line,
  RiMedalLine,
  RiArrowUpLine,
} from "react-icons/ri";
import {
  TimeRangeOption,
  getTimeRangeDate,
  getTimeRangeLabel,
} from "@/features/reportes/utils/dateFilters";
import { TimeRangeSelector } from "./TimeRangeSelector";

export const FeaturedAgents = () => {
  const [range, setRange] = useState<TimeRangeOption>("hoy");
  const dateRange = useMemo<DateRange>(() => getTimeRangeDate(range), [range]);

  const { data, isLoading, error } = useTopAgents(dateRange);

  // Colores para el podio
  const getRankStyles = (index: number) => {
    if (index === 0)
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-600",
        border: "border-yellow-200",
        icon: "text-yellow-500",
      };
    if (index === 1)
      return {
        bg: "bg-slate-50",
        text: "text-slate-600",
        border: "border-slate-200",
        icon: "text-slate-400",
      };
    if (index === 2)
      return {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
        icon: "text-orange-500",
      };
    return {
      bg: "bg-gray-50/50",
      text: "text-gray-600",
      border: "border-gray-100",
      icon: "text-gray-400",
    };
  };

  return (
    <DashboardCard
      title="Agentes Destacados"
      className="h-[400px]"
      extra={<TimeRangeSelector value={range} onChange={setRange} />}
    >
      <div className="grid grid-cols-2 gap-4 h-full overflow-y-auto pr-1 pb-4">
        {isLoading ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
            <RiLoader4Line size={32} className="animate-spin text-indigo-500" />
            <p className="text-xs font-black uppercase tracking-widest">
              Analizando rendimiento...
            </p>
          </div>
        ) : error ? (
          <div className="col-span-2 py-20 text-center text-sm text-red-400 italic font-medium">
            Error al sincronizar datos de agentes.
          </div>
        ) : !data || data.length === 0 ? (
          <div className="col-span-2 py-20 text-center text-xs text-gray-400 font-bold uppercase tracking-widest italic">
            Sin actividad de agentes ({getTimeRangeLabel(range).toLowerCase()})
          </div>
        ) : (
          data.map((agent, i) => {
            const styles = getRankStyles(i);
            return (
              <div
                key={agent.id_agent || i}
                className={`relative flex flex-col items-center justify-center p-5 rounded-[2rem] border transition-all group cursor-pointer ${
                  i === 0
                    ? "bg-gradient-to-b from-yellow-50/50 to-white border-yellow-100 shadow-lg shadow-yellow-100/50"
                    : "bg-white border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50"
                }`}
              >
                {/* Badge de Ranking Asimétrico */}
                {i < 3 && (
                  <div
                    className={`absolute -top-1 -left-1 w-8 h-8 rounded-xl shadow-sm flex items-center justify-center border-2 border-white z-10 ${styles.bg}`}
                  >
                    <RiMedalLine className={styles.icon} size={16} />
                  </div>
                )}

                <div className="relative mb-4">
                  {/* Glow Effect para el Top 1 */}
                  {i === 0 && (
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                  )}
                  <div
                    className={`w-16 h-16 rounded-3xl flex items-center justify-center border-2 border-white shadow-md shrink-0 transition-all duration-500 p-0.5 relative z-10 ${
                      i === 0
                        ? "bg-yellow-100 rotate-3 group-hover:rotate-0"
                        : "bg-indigo-50 group-hover:bg-indigo-500"
                    }`}
                  >
                    <RiUserSharedLine
                      size={28}
                      className={
                        i === 0
                          ? "text-yellow-600"
                          : "text-indigo-600 group-hover:text-white transition-colors"
                      }
                    />
                  </div>
                </div>

                <div className="text-center w-full space-y-3">
                  <div>
                    <p className="text-[13px] font-black text-gray-800 leading-none truncate mb-1">
                      {agent.name_agent || "Agente"}
                    </p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      ID: {agent.id_agent}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 items-center">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm">
                      <span className="text-[10px] font-black text-gray-700">
                        {agent.total_ordenes}
                      </span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase">
                        Órdenes
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 text-emerald-600">
                      <RiArrowUpLine size={12} />
                      <span className="text-[12px] font-black tracking-tight">
                        $
                        {agent.total_ventas.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardCard>
  );
};
