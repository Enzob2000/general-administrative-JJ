"use client";

import DashboardLayout from "@/components/ui/layout/layout";
import { PreciosTable } from "@/features/precios/components/PreciosTable";
import {
  RiMoneyDollarCircleLine,
  RiInformationLine,
  RiLineChartLine,
  RiStore2Line,
  RiSettings4Line,
} from "react-icons/ri";

export default function PreciosPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <span className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                <RiMoneyDollarCircleLine />
              </span>
              Gestión de Precios
            </h1>
            <p className="text-gray-400 font-medium ml-1">
              Configuración de suscripciones, planes y costos modulares
            </p>
          </div>

          <div className="flex items-center gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100 max-w-sm">
            <RiInformationLine className="text-amber-600 shrink-0" size={24} />
            <p className="text-[10px] text-amber-900 font-bold leading-relaxed">
              Los cambios en los precios se aplicarán a las nuevas
              contrataciones. Los clientes existentes mantendrán su tarifa
              actual hasta la renovación.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <PreciosTable />
        </div>

        {/* Grid de KPIs rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-blue-600 rounded-[2rem] text-white space-y-4 shadow-xl shadow-blue-100 relative overflow-hidden group">
            <RiLineChartLine className="absolute -right-4 -bottom-4 size-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
            <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest">
              Plan Más Vendido
            </p>
            <div>
              <h3 className="text-3xl font-black">Premium Anual</h3>
              <p className="text-blue-200 text-xs font-bold mt-1">
                +12% de crecimiento este mes
              </p>
            </div>
          </div>

          <div className="p-8 bg-white border border-gray-100 rounded-[2rem] space-y-4 shadow-sm relative overflow-hidden group">
            <RiStore2Line className="absolute -right-4 -bottom-4 size-32 text-gray-50 group-hover:scale-110 transition-transform duration-500" />
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
              Ingreso Promedio
            </p>
            <div>
              <h3 className="text-3xl font-black text-gray-900">$142.50</h3>
              <p className="text-emerald-500 text-xs font-bold mt-1">
                Ticket promedio por grupo
              </p>
            </div>
          </div>

          <div className="p-8 bg-white border border-gray-100 rounded-[2rem] space-y-4 shadow-sm relative overflow-hidden group">
            <RiSettings4Line className="absolute -right-4 -bottom-4 size-32 text-gray-50 group-hover:scale-110 transition-transform duration-500" />
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
              Módulos Activos
            </p>
            <div>
              <h3 className="text-3xl font-black text-gray-900">8 / 12</h3>
              <p className="text-blue-500 text-xs font-bold mt-1">
                Tasa de adopción: 75%
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
