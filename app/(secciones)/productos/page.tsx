"use client";

import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/ui/layout/layout";
import {
  RiSearchLine,
  RiFilter3Line,
  RiLoader4Line,
  RiEyeLine,
  RiCalendarLine,
  RiMedicineBottleLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiAddLine,
  RiRestartLine,
  RiHashtag,
  RiStackLine,
} from "react-icons/ri";

import { useMedicamentos } from "@/features/reportes/hooks/useMedicamentos";
import { ProductoModal } from "@/features/productos/components/ProductoModal";
import { SearchableSelect } from "@/features/productos/components/SearchableSelect";
import { CrearProductoModal } from "@/features/productos/components/CrearProductoModal";
import {
  Medicamento,
  getProductImageUrl,
  splitActiveIngredients,
  getUniqueCategories,
  getUniqueBrands,
  getUniqueDosages,
  getUniqueActiveIngredients,
} from "@/features/reportes/types/reportes.constants";

export default function ProductosPage() {
  const {
    medications,
    isLoading,
    hasMore,
    loadMore,
    refetch,
    search: apiSearch,
  } = useMedicamentos(80);

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    ingredient: "",
    dosage: "",
  });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedProduct, setSelectedProduct] = useState<Medicamento | null>(
    null,
  );
  const [isCrearOpen, setIsCrearOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      apiSearch(searchTerm || null);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, apiSearch]);

  // Filtering Logic
  const filteredMeds = useMemo(() => {
    return medications.filter((m) => {
      const matchesDate = (() => {
        const mDate = m.timestamp;
        const start = dateRange.start ? new Date(dateRange.start).getTime() : 0;
        const end = dateRange.end
          ? new Date(dateRange.end + "T23:59:59").getTime()
          : Infinity;
        return mDate >= start && mDate <= end;
      })();

      return (
        (!filters.category || m.category === filters.category) &&
        (!filters.brand || m.brand === filters.brand) &&
        (!filters.dosage || m.dosage === filters.dosage) &&
        (!filters.ingredient ||
          splitActiveIngredients(m.activeIngredient).includes(
            filters.ingredient,
          )) &&
        matchesDate
      );
    });
  }, [medications, filters, dateRange]);

  const paginatedMeds = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMeds.slice(start, start + itemsPerPage);
  }, [filteredMeds, currentPage]);

  const totalPages = Math.ceil(filteredMeds.length / itemsPerPage);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ category: "", brand: "", ingredient: "", dosage: "" });
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              Catálogo de Productos
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Gestiona el inventario de productos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="h-10 px-4 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all flex items-center gap-2 font-bold text-sm"
            >
              <RiRestartLine size={18} /> Refrescar
            </button>
            <button
              onClick={() => setIsCrearOpen(true)}
              className="h-10 px-4 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all flex items-center gap-2 font-bold text-sm shadow-lg shadow-red-100"
            >
              <RiAddLine size={18} /> Crear producto
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[280px]">
              <RiSearchLine
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar por nombre, principio activo o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
            <button
              onClick={clearFilters}
              className="h-11 px-5 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
            >
              <RiFilter3Line size={16} /> Limpiar
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SearchableSelect
              label="Categoría"
              value={filters.category}
              options={getUniqueCategories(medications)}
              onChange={(v) => updateFilter("category", v)}
            />
            <SearchableSelect
              label="Marca"
              value={filters.brand}
              options={getUniqueBrands(medications)}
              onChange={(v) => updateFilter("brand", v)}
            />
            <SearchableSelect
              label="Principio Activo"
              value={filters.ingredient}
              options={getUniqueActiveIngredients(medications)}
              onChange={(v) => updateFilter("ingredient", v)}
            />
            <SearchableSelect
              label="Dosis"
              value={filters.dosage}
              options={getUniqueDosages(medications)}
              onChange={(v) => updateFilter("dosage", v)}
            />

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
              <RiCalendarLine size={14} className="text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((p) => ({ ...p, start: e.target.value }))
                }
                className="bg-transparent text-[11px] font-bold text-gray-600 outline-none"
              />
              <span className="text-gray-300 text-[10px]">—</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((p) => ({ ...p, end: e.target.value }))
                }
                className="bg-transparent text-[11px] font-bold text-gray-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full">
          {isLoading && paginatedMeds.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 border border-gray-100 shadow-sm text-center flex flex-col items-center gap-3">
              <RiLoader4Line size={40} className="text-blue-500 animate-spin" />
              <p className="text-sm font-bold text-gray-400 italic">
                Consultando catálogo...
              </p>
            </div>
          ) : paginatedMeds.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 border border-gray-100 shadow-sm text-center">
              <p className="text-sm font-bold text-gray-400 italic">
                No hay productos que coincidan.
              </p>
            </div>
          ) : (
            <>
              {/* --- MOBILE CARDS OPTIMIZADAS --- */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {paginatedMeds.map((m) => (
                  <div
                    key={m.barCode}
                    className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-4"
                  >
                    <div className="flex gap-4">
                      <div className="size-24 rounded-3xl bg-gray-50 flex items-center justify-center p-2 shrink-0 border border-gray-100 shadow-inner">
                        {m.image ? (
                          <img
                            src={getProductImageUrl(m.image) || ""}
                            alt={m.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <RiMedicineBottleLine
                            size={40}
                            className="text-gray-300"
                          />
                        )}
                      </div>
                      <div className="flex-1 justify-center flex flex-col">
                        <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest leading-none mb-1">
                          {m.subcategory || "General"}
                        </span>
                        <h3 className="text-xl font-black text-gray-800 leading-tight">
                          {m.name}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                          {m.brand}
                        </p>
                      </div>
                    </div>

                    {/* Dosis y Presentación (Nuevo en Móvil) */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
                        <RiHashtag className="text-blue-500" size={14} />
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase leading-none">
                            Dosis
                          </span>
                          <span className="text-[11px] font-bold text-gray-700">
                            {m.dosage || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
                        <RiStackLine className="text-purple-500" size={14} />
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase leading-none">
                            Presentación
                          </span>
                          <span className="text-[11px] font-bold text-gray-700 truncate">
                            {m.tablets || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {splitActiveIngredients(m.activeIngredient)
                        .slice(0, 3)
                        .map((ai) => (
                          <span
                            key={ai}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[9px] font-black border border-blue-100 uppercase"
                          >
                            {ai}
                          </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">
                          Categoría
                        </span>
                        <span className="text-xs font-bold text-gray-600">
                          {m.category}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedProduct(m)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100 text-xs font-bold active:scale-95 transition-all"
                      >
                        <RiEyeLine size={18} /> Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table (Sin cambios) */}
              <div className="hidden md:block bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      {[
                        "Imagen",
                        "Producto",
                        "Principio Activo",
                        "Categoría",
                        "Marca",
                        "Fecha",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedMeds.map((m) => (
                      <tr
                        key={m.barCode}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="size-12 rounded-xl bg-gray-50 flex items-center justify-center p-1 group-hover:bg-white border border-gray-100 transition-colors">
                            {m.image ? (
                              <img
                                src={getProductImageUrl(m.image) || ""}
                                className="w-full h-full object-contain"
                                alt=""
                              />
                            ) : (
                              <RiMedicineBottleLine
                                size={24}
                                className="text-gray-300"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800 leading-tight">
                              {m.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              {m.subcategory || "General"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {splitActiveIngredients(m.activeIngredient)
                              .slice(0, 2)
                              .map((ai) => (
                                <span
                                  key={ai}
                                  className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[9px] font-black border border-blue-100 uppercase"
                                >
                                  {ai}
                                </span>
                              ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                            {m.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-gray-600">
                            {m.brand}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-gray-500">
                            {new Date(m.timestamp).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedProduct(m)}
                            className="p-2 rounded-xl bg-white border border-gray-100 text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <RiEyeLine size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination */}
          <div className="mt-6 px-6 py-4 bg-white rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Mostrando {paginatedMeds.length} de {filteredMeds.length}{" "}
              resultados
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:enabled:bg-blue-600 hover:enabled:text-white transition-all disabled:opacity-30"
              >
                <RiArrowLeftSLine size={20} />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const p = currentPage > 3 ? currentPage - 2 + i : i + 1;
                  if (p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`size-9 rounded-xl text-xs font-black transition-all ${currentPage === p ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-gray-400 border border-gray-200 hover:bg-gray-50"}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => {
                  if (currentPage === totalPages && hasMore) loadMore();
                  setCurrentPage((p) => p + 1);
                }}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:enabled:bg-blue-600 hover:enabled:text-white transition-all disabled:opacity-30"
              >
                <RiArrowRightSLine size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductoModal
          producto={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      <CrearProductoModal
        isOpen={isCrearOpen}
        onClose={() => setIsCrearOpen(false)}
      />
    </DashboardLayout>
  );
}
