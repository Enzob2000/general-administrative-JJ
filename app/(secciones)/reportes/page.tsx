"use client";

import { useState, useCallback, useMemo } from "react";
import DashboardLayout from "@/components/ui/layout/layout";
import {
  RiArrowUpLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiStoreLine,
  RiCalendarLine,
  RiLoader4Line,
  RiMedicineBottleLine,
} from "react-icons/ri";

import { useGroupsReport } from "@/features/reportes/hooks/useGroupsReport";
import { PharmacyOrderSubList } from "@/features/reportes/components/PharmacyOrderSubList";
import { GroupTotalVentas } from "@/features/reportes/components/GroupTotalVentas";
import { ApiCounter } from "@/features/grupos/components/count";
import { DateRange } from "@/features/reportes/types/reportes.constants";
import { useTopMedications } from "@/features/reportes/hooks/useAnalysis";
import { TopMedicationsTable } from "@/features/reportes/components/TopMedicationsTable";
import { DeliveryReportCard } from "@/components/shared/dashboard/DeliveryReportCard";

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Setea el rango exactamente al día de hoy (mismo inicio y fin) */
function currentDayRange(): DateRange {
  const now = new Date();

  // Usamos el mismo objeto base para evitar desfases
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
  );
  // El fin lo ponemos al mismo día pero al último segundo
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function toInputDate(iso: string) {
  return iso.slice(0, 10);
}

// ─── Stat Badge ───────────────────────────────────────────────────────────────

function StatBadge({
  title,
  value,
  sub,
  gradient,
}: {
  title: string;
  value: string;
  sub: string;
  gradient: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl px-4 py-5 text-white ${gradient} shadow-lg`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
            {title}
          </p>
          <p className="text-2xl font-black leading-none">{value}</p>
        </div>
        <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1 text-[10px] font-black whitespace-nowrap self-start">
          <RiArrowUpLine size={12} />
          este mes
        </div>
      </div>
      <p className="mt-2 text-xs opacity-70">{sub}</p>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ReportesPage() {
  const { data: grupos, isLoading: gruposLoading } = useGroupsReport();
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(
    new Set(),
  );

  // Inicializamos con el rango del día actual (mismo inicio y fin)
  const [dateRange, setDateRange] = useState<DateRange>(currentDayRange());

  /** Consulta de medicamentos para las nuevas cards y la tabla */
  const { data: topMeds, isLoading: medsLoading } =
    useTopMedications(dateRange);

  const totals = useMemo(() => {
    if (!topMeds) return { revenue: 0, units: 0 };
    return topMeds.reduce(
      (acc, m) => ({
        revenue: acc.revenue + (m.total_revenue || 0),
        units: acc.units + (m.total_quantity || 0),
      }),
      { revenue: 0, units: 0 },
    );
  }, [topMeds]);

  const toggleGroup = useCallback((id: string) => {
    setExpandedGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const todayIso = new Date().toISOString();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 flex flex-col gap-7">
        {/* ── Stat Card ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatBadge
            title="Grupos registrados"
            value={gruposLoading ? "…" : String(grupos?.length ?? 0)}
            sub="Total de grupos de farmacias"
            gradient="bg-gradient-to-br from-blue-700 to-blue-500"
          />
          <StatBadge
            title="Ventas Totales ($)"
            value={
              medsLoading
                ? "…"
                : `$${totals.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
            }
            sub="Suma de todos los productos vendidos"
            gradient="bg-gradient-to-br from-emerald-600 to-emerald-400"
          />
          <StatBadge
            title="Unidades Vendidas"
            value={medsLoading ? "…" : totals.units.toLocaleString("en-US")}
            sub="Total de items despachados"
            gradient="bg-gradient-to-br from-indigo-600 to-indigo-400"
          />
        </div>

        {/* ── Filtro de Fechas ── */}
        <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <RiCalendarLine size={16} className="text-blue-500" />
            <span className="text-xs font-black uppercase tracking-widest text-gray-500">
              Período de Análisis
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              max={toInputDate(todayIso)}
              value={toInputDate(dateRange.start)}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  start: e.target.value
                    ? new Date(e.target.value + "T00:00:00").toISOString()
                    : prev.start,
                }))
              }
              className="h-8 rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-700 outline-none focus:border-blue-500 transition-all cursor-pointer"
            />
            <span className="text-gray-400 text-xs font-bold w-4 text-center">
              –
            </span>
            <input
              type="date"
              max={toInputDate(todayIso)}
              value={toInputDate(dateRange.end)}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  end: e.target.value
                    ? new Date(e.target.value + "T23:59:59").toISOString()
                    : prev.end,
                }))
              }
              className="h-8 rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-700 outline-none focus:border-blue-500 transition-all cursor-pointer"
            />

            <button
              onClick={() => setDateRange(currentDayRange())}
              className="ml-2 h-8 px-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter border border-blue-100 shadow-sm active:scale-95"
            >
              Hoy
            </button>
          </div>

          <p className="text-[10px] text-gray-400 ml-auto hidden lg:inline italic">
            * Análisis del día: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* ── Listado Detallado de Medicamentos ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
              <RiMedicineBottleLine size={18} />
            </div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest">
              Análisis Detallado de Productos
            </h2>
          </div>
          <TopMedicationsTable data={topMeds} isLoading={medsLoading} />
        </div>

        {/* ── Rendimiento de Entregas ── */}
        <div className="flex flex-col gap-4">
          <DeliveryReportCard />
        </div>

        {/* ── Reporte por Grupos ── */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="bg-blue-700 px-6 py-4 flex items-center gap-2">
            <RiStoreLine size={18} className="text-white/80" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest">
              Reporte de Ventas por Grupos
            </h2>
            {gruposLoading && (
              <RiLoader4Line
                size={16}
                className="text-white/60 animate-spin ml-auto"
              />
            )}
          </div>

          <div className="bg-blue-600 grid grid-cols-3 sm:grid-cols-4 px-6 py-3">
            {[
              "Nombre del Grupo",
              "N° de Farmacias",
              "Categorías",
              "Ventas Totales",
            ].map((h) => (
              <span
                key={h}
                className="text-[10px] font-black uppercase tracking-wider text-white/80 hidden sm:block first:block"
              >
                {h}
              </span>
            ))}
            <span className="text-[10px] font-black uppercase tracking-wider text-white/80 sm:hidden">
              Grupo
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-white/80 sm:hidden">
              Farmacias
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-white/80 sm:hidden">
              Total
            </span>
          </div>

          <div className="bg-white divide-y divide-gray-100">
            {gruposLoading ? (
              <div className="flex items-center gap-2 px-6 py-8 text-blue-500">
                <div className="size-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-sm font-medium">Cargando grupos…</span>
              </div>
            ) : !grupos || grupos.length === 0 ? (
              <div className="py-12 text-center text-gray-400 italic text-sm">
                No se encontraron grupos registrados.
              </div>
            ) : (
              grupos.map((g) => {
                const isExpanded = expandedGroupIds.has(g.id);
                return (
                  <div key={g.id}>
                    <button
                      onClick={() => toggleGroup(g.id)}
                      className="w-full grid grid-cols-3 sm:grid-cols-4 px-6 py-4 text-left hover:bg-blue-50/30 transition-colors group items-center"
                    >
                      <div className="flex items-center gap-2 col-span-1">
                        <span className="text-blue-500 group-hover:text-blue-700 transition-colors shrink-0">
                          {isExpanded ? (
                            <RiArrowUpSLine size={18} />
                          ) : (
                            <RiArrowDownSLine size={18} />
                          )}
                        </span>
                        <span className="font-bold text-sm text-gray-800 truncate">
                          {g.name_group}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 font-semibold self-center">
                        <ApiCounter
                          id={g.id}
                          endpoint="/admin/Pharmacy/searchpharmacyforgroup"
                          queryKey="pharmacy-count"
                        />
                      </div>

                      <span className="text-sm text-gray-400 italic self-center hidden sm:block">
                        {isExpanded ? "↓ Ver desglose" : "Click para ver"}
                      </span>

                      <div className="text-right sm:text-left">
                        <GroupTotalVentas
                          groupId={g.id}
                          dateRange={dateRange}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="bg-blue-50/20 border-t border-blue-100/50 px-4 pb-4">
                        <PharmacyOrderSubList
                          groupId={g.id}
                          dateRange={dateRange}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
