"use client";

import React, { useState } from "react";
import { PlanPrecio, GrupoAsociado } from "../types/precios.types";
import {
  RiInformationLine,
  RiTeamLine,
  RiCheckLine,
  RiCalendarLine,
  RiCloseLine,
  RiPriceTag3Line,
  RiVerifiedBadgeLine,
} from "react-icons/ri";

const MOCK_GRUPOS: GrupoAsociado[] = [
  {
    id: "1",
    nombre: "FarmaRedes Group",
    rif: "J-12345678-0",
    farmacias_count: 5,
    fecha_contratacion: "2024-01-15",
  },
  {
    id: "2",
    nombre: "BioSalud C.A.",
    rif: "J-87654321-9",
    farmacias_count: 2,
    fecha_contratacion: "2024-02-20",
  },
  {
    id: "3",
    nombre: "MedicExpress",
    rif: "J-11223344-5",
    farmacias_count: 8,
    fecha_contratacion: "2024-03-05",
  },
];

export function VerPlanModal({
  isOpen,
  onClose,
  plan,
}: {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanPrecio | null;
}) {
  const [activeTab, setActiveTab] = useState<"general" | "grupos">("general");

  if (!isOpen || !plan) return null;

  const gruposLabel = "Grupos Asociados (" + plan.grupos_count + ")";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-7 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight leading-none">
                  Ficha de Plan
                </h2>
                <span className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">
                  {plan.nombre}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <RiCloseLine size={28} />
            </button>
          </div>

          <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
            <TabNav
              active={activeTab === "general"}
              onClick={() => setActiveTab("general")}
              icon={<RiInformationLine />}
              label="Información General"
            />
            <TabNav
              active={activeTab === "grupos"}
              onClick={() => setActiveTab("grupos")}
              icon={<RiTeamLine />}
              label={gruposLabel}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar bg-white space-y-10">
          {activeTab === "general" ? (
            <div className="space-y-10 animate-in slide-in-from-left-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  label="Precio Base"
                  value={"$" + plan.precio}
                  sub={plan.periodo}
                  color="blue"
                />
                <StatCard label="Estado" value={plan.estado} color="emerald" />
                <StatCard
                  label="Adopción"
                  value={String(plan.grupos_count)}
                  sub="Grupos"
                  color="amber"
                />
              </div>

              <Section
                title="Descripción y Propósito"
                icon={<RiInformationLine size={18} />}
              >
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {plan.descripcion}
                  </p>
                </div>
              </Section>

              <Section
                title="Módulos y Capacidades"
                icon={<RiVerifiedBadgeLine size={18} />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {plan.modulos_incluidos.map((mod) => (
                    <div
                      key={mod}
                      className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <RiCheckLine size={18} />
                      </div>
                      <span className="text-xs font-black text-gray-700 uppercase tracking-tighter">
                        {mod}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="overflow-hidden border border-gray-100 rounded-[2.5rem] shadow-sm bg-gray-50/30">
                <table className="w-full text-left">
                  <thead className="bg-white border-b border-gray-100">
                    <tr>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-8">
                        Grupo de Farmacias
                      </th>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                        RIF Fiscal
                      </th>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                        Locales
                      </th>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right pr-8">
                        Contratación
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {MOCK_GRUPOS.map((grupo) => (
                      <tr
                        key={grupo.id}
                        className="hover:bg-blue-50/50 transition-colors group"
                      >
                        <td className="p-5 pl-8">
                          <div className="flex items-center gap-4">
                            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-blue-100 transition-transform group-hover:scale-110">
                              {grupo.nombre.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-gray-800 text-sm tracking-tight">
                              {grupo.nombre}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg font-mono text-xs font-bold">
                            {grupo.rif}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-black text-xs">
                            <RiPriceTag3Line size={14} />{" "}
                            {grupo.farmacias_count}
                          </div>
                        </td>
                        <td className="p-5 text-right pr-8">
                          <span className="text-xs font-bold text-gray-400 flex items-center justify-end gap-2">
                            <RiCalendarLine />{" "}
                            {new Date(
                              grupo.fecha_contratacion,
                            ).toLocaleDateString("es-VE", {
                              month: "short",
                              year: "numeric",
                              day: "2-digit",
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {MOCK_GRUPOS.length === 0 && (
                <div className="py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                  <RiTeamLine
                    className="mx-auto text-gray-200 mb-4"
                    size={48}
                  />
                  <p className="text-sm font-black text-gray-300 uppercase tracking-widest">
                    Sin grupos asociados actualmente
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-7 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all text-xs uppercase tracking-widest shadow-lg shadow-gray-200 active:scale-95"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}

function TabNav({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
        active
          ? "bg-white text-blue-600 shadow-sm scale-105"
          : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-7 flex items-center gap-3 border-l-4 border-blue-600 pl-3">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: "blue" | "emerald" | "amber";
}) {
  const styles = {
    blue: "bg-blue-50/50 border-blue-100/50 text-blue-600",
    emerald: "bg-emerald-50/50 border-emerald-100/50 text-emerald-600",
    amber: "bg-amber-50/50 border-amber-100/50 text-amber-600",
  }[color];

  return (
    <div
      className={`p-6 rounded-[2rem] border text-center flex flex-col items-center justify-center gap-1 ${styles}`}
    >
      <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">
        {label}
      </span>
      <h4 className="text-2xl font-black tracking-tighter uppercase">
        {value}
      </h4>
      {sub && (
        <span className="text-[10px] font-bold uppercase opacity-60 tracking-widest">
          {sub}
        </span>
      )}
    </div>
  );
}
