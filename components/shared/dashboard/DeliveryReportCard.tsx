"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "../cards/dashboardCard";
import { useApiQuery } from "@/hooks/useApi";
import {
  Delivery,
  DateRange,
} from "@/features/reportes/types/reportes.constants";
import {
  RiTruckLine,
  RiLoader4Line,
  RiCheckboxCircleFill,
  RiMoneyDollarCircleLine,
  RiRouteLine,
} from "react-icons/ri";
import {
  TimeRangeOption,
  getTimeRangeDate,
} from "@/features/reportes/utils/dateFilters";
import { TimeRangeSelector } from "./TimeRangeSelector";

const MOCK_DELIVERIES: Delivery[] = [
  {
    id_repartidor: "Carlos Ruiz",
    cantidad_viajes: 45,
    total_comisiones_delivery: 225.5,
    total_ventas_entregadas: 1250.0,
  },
  {
    id_repartidor: "Ana Lopez",
    cantidad_viajes: 38,
    total_comisiones_delivery: 190.0,
    total_ventas_entregadas: 980.5,
  },
  {
    id_repartidor: "Juan Perez",
    cantidad_viajes: 30,
    total_comisiones_delivery: 150.0,
    total_ventas_entregadas: 750.0,
  },
  {
    id_repartidor: "Maria Garcia",
    cantidad_viajes: 25,
    total_comisiones_delivery: 125.0,
    total_ventas_entregadas: 620.0,
  },
  {
    id_repartidor: "Jose Rodriguez",
    cantidad_viajes: 18,
    total_comisiones_delivery: 90.0,
    total_ventas_entregadas: 450.0,
  },
];

export const DeliveryReportCard = () => {
  const [range, setRange] = useState<TimeRangeOption>("hoy");
  const dateRange = useMemo<DateRange>(() => getTimeRangeDate(range), [range]);

  const { data: apiData, isLoading } = useApiQuery<Delivery[]>(
    ["deliveries", dateRange.start, dateRange.end],
    "/admin/Orders/reportdelivery",
    {
      method: "POST",
      body: {
        start: dateRange.start,
        end: dateRange.end,
      },
    },
  );

  const data = useMemo(() => {
    // Si no hay datos de la API o está vacío, usamos mocks
    if (!apiData || apiData.length === 0) return MOCK_DELIVERIES;
    return apiData;
  }, [apiData]);

  const maxTrips = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map((d) => d.cantidad_viajes));
  }, [data]);

  return (
    <DashboardCard
      title="Rendimiento de Entregas"
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((d, i) => {
              const isFirst = i === 0;
              const progress = (d.cantidad_viajes / maxTrips) * 100;

              return (
                <div
                  key={i}
                  className={`relative bg-white border rounded-[2.2rem] p-5 transition-all duration-500 group
                    ${
                      isFirst
                        ? "border-emerald-200 shadow-xl shadow-emerald-100/30 bg-gradient-to-br from-white via-white to-emerald-50/40"
                        : "border-gray-100 hover:border-emerald-100 hover:shadow-lg shadow-sm"
                    } min-h-[160px] flex flex-col justify-between`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2.5 rounded-2xl shrink-0 transition-colors duration-500 ${
                        isFirst
                          ? "bg-emerald-600 shadow-lg shadow-emerald-200"
                          : "bg-gray-50 border border-gray-100 group-hover:bg-emerald-50 group-hover:border-emerald-100"
                      }`}
                    >
                      <RiTruckLine
                        size={20}
                        className={
                          isFirst
                            ? "text-white"
                            : "text-gray-400 group-hover:text-emerald-500"
                        }
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[13px] font-black text-gray-800 leading-tight truncate">
                        {d.id_repartidor}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate mt-0.5">
                        Repartidor
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[16px] font-black text-gray-900 tracking-tighter">
                          $
                          {d.total_comisiones_delivery.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <div className="flex items-center gap-1">
                          <RiMoneyDollarCircleLine
                            size={10}
                            className="text-emerald-500"
                          />
                          <span className="text-[8px] font-black text-emerald-500/60 uppercase tracking-widest mt-0.5">
                            Comisión
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-[22px] font-black leading-none tracking-tighter ${
                              isFirst ? "text-emerald-600" : "text-gray-800"
                            }`}
                          >
                            {d.cantidad_viajes}
                          </span>
                          <RiRouteLine
                            size={14}
                            className={
                              isFirst ? "text-emerald-600" : "text-gray-400"
                            }
                          />
                        </div>
                        <span className="text-[8px] font-black text-gray-300 uppercase">
                          Viajes
                        </span>
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out 
                          ${
                            isFirst
                              ? "bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                              : "bg-gray-200"
                          }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-bold text-gray-400">
                      <span>Total Entregado</span>
                      <span className="text-gray-600">
                        $
                        {d.total_ventas_entregadas.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  {isFirst && (
                    <div className="absolute -top-1.5 -right-1.5 shadow-lg rounded-full">
                      <RiCheckboxCircleFill
                        className="text-emerald-600 bg-white rounded-full"
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
