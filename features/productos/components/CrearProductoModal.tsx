"use client";

import { useState, useRef } from "react";
import { MultiStepModal } from "@/components/shared/modals/MultiStepModal";
import { FormInput, FormSelect } from "@/components/shared/modals/FormInput";
import {
  RiImageAddLine,
  RiDeleteBin6Line,
  RiBarcodeLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────
interface ImagePreview {
  file: File;
  url: string;
}

interface ProductFormData {
  // Step 2 – Información
  nombre: string;
  marca: string;
  categoria: string;
  principio_activo: string;
  descripcion: string;
  // Step 3 – Código universal
  codigo_universal: string;
}

const STEP_TITLES = [
  "Contenido multimedia",
  "Información del Producto",
  "Sección del producto",
  "Código Universal",
];

const CATEGORY_OPTIONS = [
  { label: "Selecciona una categoría...", value: "" },
  { label: "Antibióticos", value: "Antibióticos" },
  { label: "Analgésicos", value: "Analgésicos" },
  { label: "Antiinflamatorios", value: "Antiinflamatorios" },
  { label: "Antialérgicos", value: "Antialérgicos" },
  { label: "Cardiovascular", value: "Cardiovascular" },
  { label: "Gastrointestinal", value: "Gastrointestinal" },
  { label: "Salud Respiratoria", value: "Salud Respiratoria" },
  { label: "Multivitamínicos", value: "Multivitamínicos" },
  { label: "Antidiabéticos", value: "Antidiabéticos" },
  { label: "Corticosteroides", value: "Corticosteroides" },
  { label: "Antifúngicos", value: "Antifúngicos" },
  { label: "Probióticos", value: "Probióticos" },
  { label: "Antiespasmódicos", value: "Antiespasmódicos" },
  { label: "Otro", value: "Otro" },
];

// ───────────────────────────────────────────────
// Main Component
// ───────────────────────────────────────────────
export function CrearProductoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    nombre: "",
    marca: "",
    categoria: "",
    principio_activo: "",
    descripcion: "",
    codigo_universal: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 10;

  // ── Handlers ──────────────────────────────────
  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_IMAGES - images.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const newPreviews: ImagePreview[] = toAdd.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleContinue = async () => {
    if (step === 1 && images.length === 0) {
      return alert("Agrega al menos una imagen del producto.");
    }
    if (step === 2 && (!formData.nombre || !formData.marca)) {
      return alert("El nombre y la marca son obligatorios.");
    }
    if (step === 3 && !formData.categoria) {
      return alert("Selecciona una categoría.");
    }
    if (step === 4 && !formData.codigo_universal) {
      return alert("Ingresa el código universal del producto.");
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      // Simulate submit
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 900));
      setIsSubmitting(false);
      setIsDone(true);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setStep(1);
    setImages([]);
    setFormData({
      nombre: "",
      marca: "",
      categoria: "",
      principio_activo: "",
      descripcion: "",
      codigo_universal: "",
    });
    setIsDone(false);
    onClose();
  };

  // ── Success screen ─────────────────────────────
  if (isDone) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center text-center p-12 gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
            <RiCheckboxCircleFill size={56} className="text-blue-600" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              Producto creado exitosamente
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              El producto ya está disponible en el catálogo de medicamentos.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all w-full"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // ── Main modal ─────────────────────────────────
  return (
    <MultiStepModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear producto"
      currentStep={step}
      totalSteps={4}
      onBack={() => setStep(step - 1)}
      onContinue={handleContinue}
      continueLabel={step === 4 ? "Crear producto" : "Continuar"}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* ── STEP 1: Multimedia ─────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-black text-gray-800">
                {STEP_TITLES[0]}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Puedes subir hasta {MAX_IMAGES} imágenes
              </p>
            </div>

            {/* Grid de imágenes cargadas */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50 aspect-square"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all active:scale-90"
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </div>
                    {/* Dimensions label */}
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-black text-white bg-black/50 px-2 py-0.5 rounded-full whitespace-nowrap">
                      1080 × 1080
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone */}
            {images.length < MAX_IMAGES && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 py-16 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-all">
                  <RiImageAddLine
                    size={32}
                    className="text-gray-400 group-hover:text-blue-500"
                  />
                </div>
                <p className="text-sm font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
                  Arrastra o toca aquí para agregar
                </p>
                <button
                  type="button"
                  className="px-6 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Subir
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageSelect(e.target.files)}
            />
          </div>
        )}

        {/* ── STEP 2: Información del Producto ─────── */}
        {step === 2 && (
          <div className="flex flex-col gap-5 max-w-xl">
            <h3 className="text-xl font-black text-gray-800">
              {STEP_TITLES[1]}
            </h3>

            <FormInput
              label="Nombre del producto"
              placeholder="Ej: Amoxicilina 500mg"
              value={formData.nombre}
              onChange={(v) => setFormData({ ...formData, nombre: v })}
            />
            <FormInput
              label="Marca del producto"
              placeholder="Ej: Genfar"
              value={formData.marca}
              onChange={(v) => setFormData({ ...formData, marca: v })}
            />
            <FormInput
              label="Número de lote del producto"
              placeholder="Ej: LOT-20260101"
              value={formData.principio_activo}
              onChange={(v) =>
                setFormData({ ...formData, principio_activo: v })
              }
            />
          </div>
        )}

        {/* ── STEP 3: Sección del producto ─────────── */}
        {step === 3 && (
          <div className="flex flex-col gap-5 max-w-xl">
            <h3 className="text-xl font-black text-gray-800">
              {STEP_TITLES[2]}
            </h3>

            <FormSelect
              label="Selección de categoría *"
              value={formData.categoria}
              onChange={(v) => setFormData({ ...formData, categoria: v })}
              options={CATEGORY_OPTIONS}
            />
            <FormSelect
              label="Selección de sub-categoría"
              value={""}
              onChange={() => {}}
              options={[{ label: "Seleccione...", value: "" }]}
            />
            <FormInput
              label="Contenido informativo *"
              placeholder="Descripción del producto"
              value={formData.descripcion}
              onChange={(v) => setFormData({ ...formData, descripcion: v })}
            />
            <FormSelect
              label="Asignación dólares por producto"
              value={""}
              onChange={() => {}}
              options={[{ label: "SELECCIONE CUPÓN", value: "" }]}
            />
            <FormInput
              label="Unidad *"
              placeholder="Ej: Comprimido"
              value={""}
              onChange={() => {}}
            />
          </div>
        )}

        {/* ── STEP 4: Código Universal ──────────────── */}
        {step === 4 && (
          <div className="flex flex-col gap-6 max-w-xl">
            <h3 className="text-xl font-black text-gray-800">
              {STEP_TITLES[3]}
            </h3>
            <p className="text-sm text-gray-400 -mt-3">
              Código que identifica al producto en el grupo
            </p>

            <FormInput
              label="Código del producto *"
              placeholder="Ej: 0100000001"
              value={formData.codigo_universal}
              onChange={(v) =>
                setFormData({ ...formData, codigo_universal: v })
              }
            />

            {/* Barcode visual */}
            <div className="flex flex-col items-center gap-3 p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <RiBarcodeLine size={80} className="text-gray-700" />
              <p className="text-xs font-bold text-gray-400 text-center max-w-xs">
                Puedes también configurar este código como código de barras
                registrado para una empresa.
              </p>
              <p className="text-[10px] text-gray-300 font-bold text-center max-w-xs">
                Si el código no tiene código de barras asignado, por favor
                comunicarse con el equipo de soporte.
              </p>
            </div>
          </div>
        )}
      </div>
    </MultiStepModal>
  );
}
