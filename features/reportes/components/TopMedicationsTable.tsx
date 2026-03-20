"use client";

import { useMemo, useState } from "react";
import {
  RiMedicineBottleLine,
  RiFilter3Line,
  RiArrowUpDownLine,
  RiSearchLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiLoader4Line,
} from "react-icons/ri";
import {
  TopMedicationResult,
  getProductImageUrl,
} from "../types/reportes.constants";

interface TopMedicationsTableProps {
  data: TopMedicationResult[] | null;
  isLoading: boolean;
}

export const TopMedicationsTable = ({
  data,
  isLoading,
}: TopMedicationsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterControlled, setFilterControlled] = useState<
    "all" | "yes" | "no"
  >("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TopMedicationResult;
    direction: "asc" | "desc";
  }>({ key: "total_revenue", direction: "desc" });

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data
      .filter((m) => {
        const matchesSearch =
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesControlled =
          filterControlled === "all" ||
          (filterControlled === "yes" && m.controlled) ||
          (filterControlled === "no" && !m.controlled);
        return matchesSearch && matchesControlled;
      })
      .sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        return 0;
      });
  }, [data, searchTerm, filterControlled, sortConfig]);

  const handleSort = (key: keyof TopMedicationResult) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex-1 min-w-[200px]">
          <RiSearchLine className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium w-full text-gray-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <RiFilter3Line className="text-gray-400" />
          <select
            value={filterControlled}
            onChange={(e) => setFilterControlled(e.target.value as any)}
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-600 outline-none"
          >
            <option value="all">TODOS LOS PRODUCTOS</option>
            <option value="yes">SOLO CONTROLADOS</option>
            <option value="no">NO CONTROLADOS</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Producto
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Marca / Categoría
              </th>
              <th
                className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer hover:text-blue-500 transition-colors"
                onClick={() => handleSort("total_quantity")}
              >
                <div className="flex items-center gap-2">
                  Cant. Vendida <RiArrowUpDownLine />
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Controlado
              </th>
              <th
                className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer hover:text-blue-500 transition-colors"
                onClick={() => handleSort("unit_price")}
              >
                <div className="flex items-center gap-2">
                  Precio Unit. <RiArrowUpDownLine />
                </div>
              </th>
              <th
                className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer hover:text-blue-500 transition-colors"
                onClick={() => handleSort("total_revenue")}
              >
                <div className="flex items-center gap-2">
                  Total Revenue <RiArrowUpDownLine />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  <RiLoader4Line
                    className="animate-spin inline-block mr-2"
                    size={20}
                  />
                  Analizando ventas de productos...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400 italic text-sm"
                >
                  No se encontraron resultados para los filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredData.map((m, idx) => (
                <tr
                  key={`${m.name}-${idx}`}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-white p-1">
                        <RiMedicineBottleLine
                          size={20}
                          className="text-gray-400"
                        />
                      </div>
                      <span className="text-sm font-black text-gray-800 tracking-tight">
                        {m.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                        {m.brand}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {m.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">
                    {m.total_quantity} uds.
                  </td>
                  <td className="px-6 py-4">
                    {m.controlled ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                        <RiErrorWarningLine /> CONTROLADO
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                        <RiCheckboxCircleLine /> LIBRE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-gray-900">
                    ${m.unit_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-blue-700">
                    ${m.total_revenue.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
