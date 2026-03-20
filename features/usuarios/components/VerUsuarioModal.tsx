"use client";

import { useState } from "react";
import {
  RiCloseLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiUser3Line,
  RiCarLine,
  RiCheckLine,
  RiCloseFill,
} from "react-icons/ri";
import { FaCircleNotch } from "react-icons/fa";
import { Usuario } from "@/features/usuarios/types/usuarios.constants";

interface VerUsuarioModalProps {
  isOpen: boolean;
  usuario: Usuario | null;
  onClose: () => void;
  onAction: (id: string, status: "Completed" | "Cancelled") => Promise<void>;
}

type ConfirmAction = "aceptar" | "denegar" | null;

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-800">
        {value || "—"}
      </span>
    </div>
  );
}

export function VerUsuarioModal({
  isOpen,
  usuario,
  onClose,
  onAction,
}: VerUsuarioModalProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [motivo, setMotivo] = useState("");
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !usuario) return null;

  const images = [
    { url: usuario.foto_url, label: "Foto de Perfil" },
    { url: usuario.cedula_url, label: "Cédula de Identidad" },
    { url: usuario.licencia_url, label: "Licencia / Carnet" },
  ].filter((img) => img.url) as { url: string; label: string }[];

  const prevImg = () =>
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIndex((i) => (i + 1) % images.length);

  const handleClose = () => {
    setImgIndex(0);
    setConfirmAction(null);
    setMotivo("");
    setDone(false);
    setIsSubmitting(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (!usuario || !confirmAction) return;

    setIsSubmitting(true);
    try {
      // 1. Mapeamos "aceptar" -> "Completed" y "denegar" -> "Cancelled"
      const status = confirmAction === "aceptar" ? "Completed" : "Cancelled";

      // 2. Ejecutamos la función que viene por props (la mutación)
      await onAction(usuario.id, status);

      // 3. Si la promesa se resuelve (éxito), mostramos el check verde
      setDone(true);

      // Cerramos después de un momento para que el usuario vea el éxito
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      // Si la API falla, el error cae aquí y el modal no se cierra
      console.error("Error al actualizar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <RiArrowLeftLine size={18} />
              Regresar
            </button>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
          >
            <RiCloseLine size={22} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 md:px-8 py-6 space-y-8">
          {/* DATOS DEL USUARIO */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <RiUser3Line size={18} className="text-blue-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">
                Datos del usuario
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
              <InfoField label="Nombre y Apellidos" value={usuario.full_name} />
              <InfoField label="Cédula de Identidad" value={usuario.cedula} />
              <InfoField label="Número de RIF" value={usuario.numero_rif} />
              <InfoField label="Correo" value={usuario.email} />
              <InfoField
                label="Número de contacto"
                value={usuario.phone_number}
              />
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* DATOS DEL VEHÍCULO */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <RiCarLine size={18} className="text-blue-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">
                Datos del vehículo
              </h3>
            </div>
            {usuario.vehiculo ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                <InfoField
                  label="Marca del Vehículo"
                  value={usuario.vehiculo.marca}
                />
                <InfoField
                  label="Modelo del Vehículo"
                  value={usuario.vehiculo.modelo}
                />
                <InfoField
                  label="Año del Vehículo"
                  value={usuario.vehiculo.anio}
                />
                <InfoField
                  label="Número de Placa"
                  value={usuario.vehiculo.numero_placa}
                />
                <InfoField
                  label="Número de Puestos"
                  value={usuario.vehiculo.numero_puestos}
                />
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Sin datos de vehículo registrados.
              </p>
            )}
          </section>

          <div className="border-t border-gray-100" />

          {/* CARRUSEL DE IMÁGENES */}
          {images.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">
                Documentos e Imágenes
              </h3>
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 aspect-[16/7]">
                <img
                  src={images[imgIndex].url}
                  alt={images[imgIndex].label}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all"
                    >
                      <RiArrowLeftLine size={20} />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all"
                    >
                      <RiArrowRightLine size={20} />
                    </button>
                  </>
                )}
                <div className="absolute top-3 left-3 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  {images[imgIndex].label}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer Acciones */}
        <div className="px-6 md:px-8 py-5 border-t border-gray-100 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gray-50/50">
          <button
            onClick={() => setConfirmAction("aceptar")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-100"
          >
            <RiCheckLine size={18} /> Aceptar solicitud
          </button>
          <button
            onClick={() => setConfirmAction("denegar")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-95 transition-all shadow-md shadow-red-100"
          >
            <RiCloseFill size={18} /> Denegar solicitud
          </button>
        </div>
      </div>

      {/* CONFIRMACIÓN OVERLAY */}
      {confirmAction && (
        <div className="absolute inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8 animate-in zoom-in-95 duration-200 space-y-5">
            {done ? (
              <div className="text-center space-y-3 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto">
                  <RiCheckLine size={32} className="text-emerald-500" />
                </div>
                <p className="font-black text-gray-800">
                  Solicitud{" "}
                  {confirmAction === "aceptar" ? "aceptada" : "rechazada"}{" "}
                  correctamente
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-base font-black text-gray-800">
                  Confirmar{" "}
                  {confirmAction === "aceptar" ? "aprobación" : "rechazo"}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  ¿Seguro que deseas confirmar{" "}
                  {confirmAction === "aceptar" ? "la aprobación" : "el rechazo"}{" "}
                  de la solicitud de{" "}
                  <span className="font-bold text-gray-700">
                    {usuario.full_name}
                  </span>
                  ?
                </p>

                {confirmAction === "denegar" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">
                      Motivo del rechazo
                    </label>
                    <textarea
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      rows={3}
                      placeholder="Ej: Documentos ilegibles..."
                      className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setConfirmAction(null)}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className={`flex-1 py-3 rounded-xl text-white text-sm font-black transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      confirmAction === "aceptar"
                        ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-100"
                        : "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100"
                    } disabled:opacity-70`}
                  >
                    {isSubmitting ? (
                      <FaCircleNotch className="animate-spin" />
                    ) : confirmAction === "aceptar" ? (
                      "Aceptar"
                    ) : (
                      "Rechazar"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
