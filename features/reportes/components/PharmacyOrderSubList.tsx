"use client";

import { usePharmacyOrders } from "../hooks/usePharmacyOrders";
import { DateRange, CategorySummary } from "../types/reportes.constants";
import { RiMoneyDollarCircleLine, RiRefreshLine } from "react-icons/ri";

// Paleta de colores para las píldoras de categoría
const CATEGORY_COLORS = [
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-purple-50 text-purple-700 border-purple-200",
  "bg-green-50 text-green-700 border-green-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-teal-50 text-teal-700 border-teal-200",
  "bg-indigo-50 text-indigo-700 border-indigo-200",
  "bg-orange-50 text-orange-700 border-orange-200",
];

const getCategoryColor = (index: number) =>
  CATEGORY_COLORS[index % CATEGORY_COLORS.length];

function CategoryPill({
  cat,
  colorClass,
}: {
  cat: CategorySummary;
  colorClass: string;
}) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${colorClass}`}
    >
      <span>{cat.category}</span>
      <span className="opacity-60">·</span>
      <span>{cat.count}</span>
      <span className="opacity-60">·</span>
      <span>${fmt(cat.total)}</span>
    </span>
  );
}

interface PharmacyOrderSubListProps {
  groupId: string;
  dateRange: DateRange;
}

export const PharmacyOrderSubList = ({
  groupId,
  dateRange,
}: PharmacyOrderSubListProps) => {
  const { data, isLoading, error, refetch } = usePharmacyOrders(
    groupId,
    dateRange,
  );

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-6 text-blue-500">
        <div className="size-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm font-medium">
          Cargando datos de farmacias…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 py-6 text-red-500">
        <span className="text-xs">{error}</span>
        <button
          onClick={refetch}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
        >
          <RiRefreshLine size={13} /> Reintentar
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400 italic bg-gray-50/50 rounded-xl border border-dashed border-gray-200 my-3">
        No hay datos de ventas para las farmacias de este grupo en el período
        seleccionado.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm mt-3 mb-5 mx-1">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-3 px-5 font-black text-gray-400 uppercase text-[10px] tracking-wider">
                Farmacia
              </th>
              <th className="py-3 px-5 font-black text-gray-400 uppercase text-[10px] tracking-wider text-center">
                Órdenes
              </th>
              <th className="py-3 px-5 font-black text-gray-400 uppercase text-[10px] tracking-wider">
                Categorías
              </th>
              <th className="py-3 px-5 font-black text-gray-400 uppercase text-[10px] tracking-wider text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((ph) => (
              <tr
                key={ph.name_pharmacy}
                className="hover:bg-blue-50/20 transition-colors"
              >
                <td className="py-4 px-5 font-bold text-gray-800">
                  {ph.name_pharmacy}
                </td>
                <td className="py-4 px-5 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-black text-xs">
                    {ph.total_orders.toFixed(0)}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <div className="flex flex-wrap gap-1.5">
                    {ph.categories && ph.categories.length > 0 ? (
                      ph.categories.map((cat, i) => (
                        <CategoryPill
                          key={cat.category}
                          cat={cat}
                          colorClass={getCategoryColor(i)}
                        />
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs italic">—</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-5 text-right font-black text-blue-700 font-mono">
                  ${fmt(ph.total_orders)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Detalle por Farmacia
          </span>
        </div>
        {data.map((ph) => (
          <div key={ph.name_pharmacy} className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <h4 className="text-sm font-black text-gray-800">
                {ph.name_pharmacy}
              </h4>
              <div className="flex items-center gap-1 text-blue-600 font-black text-sm shrink-0">
                <RiMoneyDollarCircleLine size={15} />${fmt(ph.total_orders)}
              </div>
            </div>
            {ph.categories && ph.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {ph.categories.map((cat, i) => (
                  <CategoryPill
                    key={cat.category}
                    cat={cat}
                    colorClass={getCategoryColor(i)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
