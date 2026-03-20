"use client";

import { useState } from "react";
import { RiCloseLine, RiCheckboxCircleLine, RiAddLine } from "react-icons/ri";
import { FormInput } from "@/components/shared/modals/FormInput";

interface CrearPrincipioActivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type ModalStep = "form" | "success";

export function CrearPrincipioActivoModal({
  isOpen,
  onClose,
  onSuccess,
}: CrearPrincipioActivoModalProps) {
  const [nombre, setNombre] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [step, setStep] = useState<ModalStep>("form");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setNombre("");
    setError("");
    setStep("form");
    onClose();
  };

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      setError("El nombre del principio activo es requerido.");
      return;
    }
    setError("");
    setIsPending(true);
    try {
      // TODO: replace with real API call
      // await api.post("/admin/ActivePrinciple/create", { name: nombre.trim() });
      await new Promise((r) => setTimeout(r, 800)); // simulate network
      setStep("success");
      onSuccess?.();
    } catch {
      setError(
        "Ocurrió un error al crear el principio activo. Intente nuevamente.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* === FORMULARIO === */}
      {step === "form" && (
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-8 pb-4">
            <h2 className="text-xl font-black text-gray-900">
              Crear principio activo
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-700"
            >
              <RiCloseLine size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="px-8 pb-6 space-y-5">
            <p className="text-sm text-gray-500 leading-relaxed">
              Introduce el nombre del nuevo principio activo que deseas
              registrar en el sistema.
            </p>
            <FormInput
              label="Nombre del principio activo"
              placeholder="Ej: Amoxicilina, Ibuprofeno..."
              value={nombre}
              onChange={(v) => {
                setNombre(v);
                if (error) setError("");
              }}
            />
            {error && (
              <p className="text-xs text-red-500 font-medium -mt-2">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Guardando...
                </>
              ) : (
                <>
                  <RiAddLine size={18} />
                  Guardar
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* === ÉXITO === */}
      {step === "success" && (
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden text-center">
          <div className="px-10 py-12 flex flex-col items-center gap-5">
            {/* Icono de éxito con círculo azul */}
            <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center">
              <RiCheckboxCircleLine size={44} className="text-blue-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-gray-900 leading-snug">
                Principio activo creado
                <br />
                exitosamente
              </h2>
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-gray-600">{nombre}</span> ha
                sido registrado correctamente.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="mt-2 w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
