"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { DashboardCard } from "../cards/dashboardCard";
import { useTopCategories } from "@/features/reportes/hooks/useAnalysis";
import { DateRange } from "@/features/reportes/types/reportes.constants";
import { RiLoader4Line } from "react-icons/ri";
import {
  TimeRangeOption,
  getTimeRangeDate,
  getTimeRangeLabel,
} from "@/features/reportes/utils/dateFilters";
import { TimeRangeSelector } from "./TimeRangeSelector";

const COLORS = [
  "#4F46E5",
  "#F59E0B",
  "#A855F7",
  "#10B981",
  "#EC4899",
  "#3B82F6",
  "#8B5CF6",
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[10px] font-black"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const CategoryStats = () => {
  const [range, setRange] = useState<TimeRangeOption>("hoy");
  const [viewType, setViewType] = useState<"revenue" | "quantity">("revenue");
  const dateRange = useMemo<DateRange>(() => getTimeRangeDate(range), [range]);

  const { data, isLoading, error } = useTopCategories(dateRange);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data
      .map((item, i) => ({
        name: item.category,
        value:
          viewType === "revenue"
            ? item.total_ventas
            : item.total_items_vendidos,
        revenue: item.total_ventas,
        quantity: item.total_items_vendidos,
        color: COLORS[i % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [data, viewType]);

  return (
    <DashboardCard
      title="Categorías"
      className="h-[400px]"
      extra={
        <div className="flex flex-col items-center gap-2 justify-end">
          <TimeRangeSelector value={range} onChange={setRange} />
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner shrink-0">
            <button
              onClick={() => setViewType("revenue")}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all duration-300 ${
                viewType === "revenue"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              $ Ventas
            </button>
            <button
              onClick={() => setViewType("quantity")}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all duration-300 ${
                viewType === "quantity"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              # Items
            </button>
          </div>
        </div>
      }
    >
      <div className="w-full h-full flex flex-col md:flex-row items-center gap-6">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <RiLoader4Line size={24} className="animate-spin text-purple-500" />
            <p className="text-sm font-medium">Cargando categorías...</p>
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-400 italic">
            Error al cargar categorías destacadas.
          </div>
        ) : !chartData || chartData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center text-sm text-gray-400 italic">
            No hay datos ({getTimeRangeLabel(range).toLowerCase()})
          </div>
        ) : (
          <>
            <div className="w-full md:w-1/2 h-[220px] md:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius="90%"
                    innerRadius="50%"
                    dataKey="value"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-2 max-h-[180px] md:max-h-none overflow-y-auto pr-2 custom-scrollbar">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl bg-gray-50/50 border border-gray-100/50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[10px] font-bold text-gray-700 truncate uppercase tracking-tighter">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-gray-900 shrink-0">
                    {viewType === "revenue"
                      ? `$${item.revenue.toFixed(2)}`
                      : `${item.quantity} uds`}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardCard>
  );
};
