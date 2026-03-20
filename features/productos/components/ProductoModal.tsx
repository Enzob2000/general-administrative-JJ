"use client";

import { useEffect, useCallback } from "react";
import {
  Medicamento,
  getProductImageUrl,
  formatTimestamp,
  splitActiveIngredients,
} from "../../reportes/types/reportes.constants";
import {
  RiCloseLine,
  RiBillLine,
  RiShieldCheckLine,
  RiBarcodeLine,
  RiMedicineBottleLine,
  RiCalendarLine,
  RiPriceTag3Line,
  RiStockLine,
} from "react-icons/ri";

interface ProductoModalProps {
  producto: Medicamento;
  onClose: () => void;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  );
}

function Badge({
  label,
  active,
  activeClass,
  inactiveClass,
}: {
  label: string;
  active: boolean;
  activeClass: string;
  inactiveClass: string;
}) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${active ? activeClass : inactiveClass}`}
    >
      {active ? "SÍ" : "NO"} — {label}
    </span>
  );
}

export function ProductoModal({ producto: p, onClose }: ProductoModalProps) {
  const imageUrl = getProductImageUrl(p.image);
  const activeIngredients = splitActiveIngredients(p.activeIngredient);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-5 flex items-start gap-4">
          {/* Imagen */}
          <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 overflow-hidden flex items-center justify-center border border-white/30">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={p.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <RiMedicineBottleLine size={32} className="text-white/60" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-0.5">
              {p.category}
              {p.subcategory ? ` · ${p.subcategory}` : ""}
            </p>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              {p.name}
            </h2>
            <p className="text-sm text-white/80 mt-0.5">{p.brand}</p>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 px-6 py-3 bg-blue-50/50 border-b border-blue-100">
          <Badge
            label="Controlado"
            active={p.controlled}
            activeClass="bg-amber-50 text-amber-700 border-amber-200"
            inactiveClass="bg-gray-50 text-gray-500 border-gray-200"
          />
          <Badge
            label="Antibiótico"
            active={p.antibiotic}
            activeClass="bg-red-50 text-red-700 border-red-200"
            inactiveClass="bg-gray-50 text-gray-500 border-gray-200"
          />
          {p.vat > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black border bg-purple-50 text-purple-700 border-purple-200">
              IVA {p.vat}%
            </span>
          )}
        </div>

        {/* Contenido scrollable */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Principios activos */}
          {activeIngredients.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Principio(s) Activo(s)
              </p>
              <div className="flex flex-wrap gap-2">
                {activeIngredients.map((ai) => (
                  <span
                    key={ai}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200"
                  >
                    <RiBillLine size={13} />
                    {ai}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          {p.description && (
            <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 leading-relaxed">
              {p.description}
            </div>
          )}

          {/* Grid de detalles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            <Field label="Dosis" value={p.dosage} />
            <Field label="Presentación" value={p.tablets} />
            <Field label="Marca" value={p.brand} />
            <Field label="Categoría" value={p.category} />
            <Field label="Subcategoría" value={p.subcategory} />
            <Field
              label="Precio"
              value={
                p.price > 0 ? (
                  <span className="text-blue-700 font-black">
                    ${p.price.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-gray-400 italic">N/D</span>
                )
              }
            />
            <Field
              label="Stock"
              value={
                <div className="flex items-center gap-1">
                  <RiStockLine
                    size={14}
                    className={
                      p.stock > p.minimum ? "text-green-500" : "text-amber-500"
                    }
                  />
                  {p.stock}
                  {p.minimum > 0 && (
                    <span className="text-xs text-gray-400 font-normal">
                      (mín. {p.minimum})
                    </span>
                  )}
                </div>
              }
            />
            <Field label="Cantidad" value={p.quantity > 0 ? p.quantity : "—"} />
            <Field
              label="Fecha de registro"
              value={
                <div className="flex items-center gap-1">
                  <RiCalendarLine size={13} className="text-gray-400" />
                  {formatTimestamp(p.timestamp)}
                </div>
              }
            />
          </div>

          {/* Código de barras */}
          {p.barCode && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3">
              <RiBarcodeLine size={16} className="text-gray-400" />
              <span className="text-xs font-mono text-gray-600">
                {p.barCode}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-auto">
                Código de Barras
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
