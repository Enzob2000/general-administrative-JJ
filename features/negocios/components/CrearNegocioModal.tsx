"use client";

import { useState } from "react";
import { MultiStepModal } from "@/components/shared/modals/MultiStepModal";
import { FormInput, FormSelect } from "@/components/shared/modals/FormInput";
import { NotificationDialog } from "@/components/shared/modals/NotificationDialog";
import {
  RiMapPin2Line,
  RiBankLine,
  RiShieldKeyholeLine,
  RiFocus3Line,
  RiAddLine,
  RiDeleteBin6Line,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import { LuLoader } from "react-icons/lu";
import {
  useCrearNegocioForm,
  PHONE_PREFIXES,
} from "@/features/negocios/hooks/useCrearNegocioForm";

export function CrearNegocioModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // 3. Definimos el estado para la visibilidad de los tokens
  const [showValues, setShowValues] = useState<Record<number, boolean>>({});

  const {
    step,
    setStep,
    formData,
    setFormData,
    handleNameChange,
    handleAccountHolderChange,
    handlePhoneBodyChange,
    handleRifBodyChange,
    handleRifTitularBodyChange,
    handleAccountPrefixChange,
    handleAccountBodyChange,
    handleMppsChange,
    handleHealthCodeChange,
    tokens,
    addTokenField,
    removeTokenField,
    updateTokenField,
    pagoMovil,
    addPagoMovil,
    removePagoMovil,
    updatePagoMovil,
    groupOptions,
    isPending,
    handleContinue,
    notification,
    setNotification,
    geoStatus,
    setGeoStatus,
    BANCOS_PAGO_MOVIL,
    formatRifForPagoMovil,
    buildRif,
    tokenStatus,
    handleVerifyToken,
    handleVerifyR4,
  } = useCrearNegocioForm(isOpen, onClose);

  return (
    <>
      <MultiStepModal
        isOpen={isOpen}
        onClose={onClose}
        title="Configurar Nuevo Negocio"
        currentStep={step}
        totalSteps={7}
        onBack={() => setStep(step - 1)}
        onContinue={handleContinue}
        continueLabel={step === 7 ? "Finalizar y Guardar" : "Continuar"}
        isSubmitting={isPending}
      >
        <div className="space-y-8 animate-in fade-in duration-300">
          {step === 1 && (
            <div className="max-w-xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                  Paso 1: Módulos y Plan
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  Selecciona los servicios que tendrá activos la farmacia y su
                  costo.
                </p>
              </div>

              {/* SELECCIÓN DE MÓDULOS (Multi-select estilo Tabs) */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Módulos Activos (Mínimo 1)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    {
                      id: "Accounting",
                      label: "Contabilidad",
                      icon: <RiBankLine />,
                    },
                    {
                      id: "DigitalBilling",
                      label: "Facturación",
                      icon: <RiShieldKeyholeLine />,
                    },
                    {
                      id: "Marketplace",
                      label: "Marketplace",
                      icon: <RiFocus3Line />,
                    },
                  ].map((mod) => {
                    const isSelected = (
                      formData.active_modules as string[]
                    ).includes(mod.id);
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => {
                          const newModules = isSelected
                            ? formData.active_modules.filter(
                                (m: string) => m !== mod.id,
                              )
                            : [...formData.active_modules, mod.id];
                          setFormData({
                            ...formData,
                            active_modules: newModules,
                          });
                        }}
                        className={`flex flex-col items-center justify-center p-5 rounded-[2rem] border-2 transition-all gap-2 relative ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                            : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-xl">{mod.icon}</span>
                        <span className="font-bold text-[10px] uppercase tracking-tighter">
                          {mod.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-4 w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PRECIO PERSONALIZADO */}
              <div className="pt-6 border-t border-gray-100">
                <div className="bg-slate-50/80 p-6 rounded-[2.5rem] border border-slate-100 space-y-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        Costo del Plan
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        Personalizado (Opcional)
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <FormInput
                      label=""
                      placeholder="Ej: 49.99"
                      value={formData.custom_plan_price}
                      onChange={(v) =>
                        setFormData({ ...formData, custom_plan_price: v })
                      }
                    />
                    {formData.custom_plan_price && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-[10px] font-black text-blue-600">
                          USD
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-400 font-medium italic ml-1">
                    * Si se deja vacío, se aplicará la tarifa base por defecto.
                  </p>
                </div>
              </div>

              {/* MENSAJE DE VALIDACIÓN */}
              {formData.active_modules.length === 0 && (
                <div className="flex items-center justify-center gap-2 text-red-500">
                  <span className="text-xs font-bold">
                    Selecciona al menos un módulo
                  </span>
                </div>
              )}
            </div>
          )}
          {step === 2 && (
            <div className="max-w-xl space-y-6">
              <h3 className="text-xl font-bold text-blue-600">
                Paso 2: Identificación
              </h3>
              <FormInput
                label="Nombre del Negocio"
                placeholder="Ej: Negocio"
                value={formData.nombreFarmacia}
                onChange={handleNameChange}
              />
              <FormSelect
                label="Grupo de Negocio"
                value={formData.idGrupo}
                onChange={(v) => setFormData({ ...formData, idGrupo: v })}
                options={[
                  { label: "Seleccione un grupo...", value: "" },
                  ...groupOptions,
                ]}
              />
            </div>
          )}

          {step === 3 && (
            <div className="max-w-xl space-y-6">
              <h3 className="text-xl font-bold text-blue-600">
                Paso 3: Documentación y Contacto
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  RIF del Negocio
                </label>
                <div className="flex items-center w-full rounded-2xl border-2 border-transparent bg-gray-100/80 overflow-hidden focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                  <div className="pl-4 pr-2 py-4 text-gray-500 font-bold bg-gray-200/50 border-r border-gray-200 select-none">
                    J-
                  </div>
                  <input
                    type="text"
                    value={formData.rifBody}
                    onChange={(e) => handleRifBodyChange(e.target.value)}
                    placeholder="123456789"
                    className="w-full bg-transparent py-4 px-4 text-gray-900 placeholder-gray-500 font-medium outline-none"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium ml-1">
                  Formato: {buildRif(formData.rifBody)}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Teléfono Móvil
                </label>
                <div className="flex gap-2">
                  <div className="w-32">
                    <FormSelect
                      label=""
                      value={formData.phonePrefix}
                      onChange={(v) =>
                        setFormData({ ...formData, phonePrefix: v })
                      }
                      options={PHONE_PREFIXES.map((p) => ({
                        label: p,
                        value: p,
                      }))}
                    />
                  </div>
                  <div className="flex-1">
                    <FormInput
                      label=""
                      placeholder="1234567"
                      value={formData.phoneBody}
                      onChange={handlePhoneBodyChange}
                      hint="Obligatorio: 7 dígitos"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    MPPS
                  </label>
                  <div className="flex items-center w-full rounded-2xl border-2 border-transparent bg-gray-100/80 overflow-hidden focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                    <div className="pl-4 pr-2 py-4 text-gray-500 font-bold bg-gray-200/50 border-r border-gray-200 select-none">
                      MPPS-
                    </div>
                    <input
                      type="text"
                      value={formData.mppsSuffix}
                      onChange={(e) => handleMppsChange(e.target.value)}
                      placeholder="NÚMERO"
                      className="w-full bg-transparent py-4 px-4 text-gray-900 placeholder-gray-500 font-medium outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium ml-1">
                    Solo números
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Código Sanitario
                  </label>
                  <div className="flex items-center w-full rounded-2xl border-2 border-transparent bg-gray-100/80 overflow-hidden focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                    <div className="pl-4 pr-2 py-4 text-gray-500 font-bold bg-gray-200/50 border-r border-gray-200 select-none">
                      HC-
                    </div>
                    <input
                      type="text"
                      value={formData.codigoSanitarioSuffix}
                      onChange={(e) => handleHealthCodeChange(e.target.value)}
                      placeholder="NUMERO"
                      className="w-full bg-transparent py-4 px-4 text-gray-900 placeholder-gray-500 font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <FormSelect
                    label="Mes Aniversario"
                    value={formData.anniversary_month}
                    onChange={(v) =>
                      setFormData({ ...formData, anniversary_month: v })
                    }
                    options={Array.from({ length: 12 }, (_, i) => {
                      const m = (i + 1).toString().padStart(2, "0");
                      return { label: m, value: m };
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                  <RiMapPin2Line /> Paso 4: Ubicación
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    if (!navigator.geolocation) return setGeoStatus("error");
                    setGeoStatus("loading");
                    navigator.geolocation.getCurrentPosition(
                      (p) => {
                        setFormData({
                          ...formData,
                          latitud: p.coords.latitude.toFixed(6),
                          longitud: p.coords.longitude.toFixed(6),
                        });
                        setGeoStatus("success");
                      },
                      () => setGeoStatus("error"),
                    );
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black"
                >
                  {geoStatus === "loading" ? (
                    <LuLoader className="animate-spin" />
                  ) : (
                    <RiFocus3Line size={18} />
                  )}{" "}
                  Ubicarme ahora
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Latitud"
                  placeholder="Ej: 10.4806"
                  value={formData.latitud}
                  onChange={(v) => setFormData({ ...formData, latitud: v })}
                />
                <FormInput
                  label="Longitud"
                  placeholder="Ej: -66.9036"
                  value={formData.longitud}
                  onChange={(v) => setFormData({ ...formData, longitud: v })}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="max-w-2xl space-y-6">
              <h3 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                <RiBankLine /> Paso 5: Métodos de Pago
              </h3>
              <FormInput
                label="Titular de la Cuenta"
                placeholder="Ej: Farmacia Central CA"
                value={formData.titularCuenta}
                onChange={handleAccountHolderChange}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Número de Cuenta
                </label>
                <div className="flex gap-2">
                  <div className="w-28">
                    <FormInput
                      label=""
                      placeholder="0105"
                      value={formData.numeroCuentaPrefix}
                      onChange={handleAccountPrefixChange}
                      hint="4 dígitos"
                    />
                  </div>
                  <div className="flex-1">
                    <FormInput
                      label=""
                      placeholder="0000000000000000"
                      value={formData.numeroCuentaBody}
                      onChange={handleAccountBodyChange}
                      hint="16 dígitos restantes"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  RIF/Cédula del Titular
                </label>
                <div className="flex items-center w-full rounded-2xl border-2 border-transparent bg-gray-100/80 overflow-hidden focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                  <div className="pl-4 pr-2 py-4 text-gray-500 font-bold bg-gray-200/50 border-r border-gray-200 select-none">
                    J-
                  </div>
                  <input
                    type="text"
                    value={formData.rifTitularBody}
                    onChange={(e) => handleRifTitularBodyChange(e.target.value)}
                    placeholder="123456789"
                    className="w-full bg-transparent py-4 px-4 text-gray-900 placeholder-gray-500 font-medium outline-none"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium ml-1">
                  Formato: {buildRif(formData.rifTitularBody)}
                </p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                    <RiBankLine className="text-2xl" /> Paso 6: Configurar Pago
                    Móvil
                  </h3>
                  <p className="text-[11px] text-gray-400 font-bold uppercase italic tracking-wider">
                    RIF DETECTADO:{" "}
                    {formatRifForPagoMovil(buildRif(formData.rifBody)) ||
                      "PENDIENTE"}
                  </p>
                </div>

                {pagoMovil.length < BANCOS_PAGO_MOVIL.length && (
                  <button
                    onClick={addPagoMovil}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    <RiAddLine size={18} /> Agregar Banco
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {pagoMovil.map((pm, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col md:flex-row gap-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 items-start"
                  >
                    <div className="w-full md:w-[45%]">
                      <FormSelect
                        label="Banco"
                        value={pm.bank}
                        onChange={(v) => updatePagoMovil(index, "bank", v)}
                        options={BANCOS_PAGO_MOVIL.filter(
                          (opt) =>
                            opt.value === pm.bank ||
                            !pagoMovil.some((p) => p.bank === opt.value),
                        )}
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                        Teléfono Pago Móvil
                      </label>
                      <div className="flex items-start gap-3">
                        <div className="w-40 shrink-0">
                          <FormSelect
                            label=""
                            value={pm.prefix || "0412"}
                            onChange={(v) =>
                              updatePagoMovil(index, "prefix", v)
                            }
                            options={PHONE_PREFIXES.map((p) => ({
                              label: p,
                              value: p,
                            }))}
                          />
                        </div>
                        <div className="flex-1">
                          <FormInput
                            label=""
                            placeholder="1234567"
                            value={pm.number}
                            onChange={(v) =>
                              updatePagoMovil(index, "number", v)
                            }
                            hint="Obligatorio: 7 dígitos"
                          />
                        </div>
                      </div>
                    </div>

                    {pagoMovil.length > 1 && (
                      <button
                        onClick={() => removePagoMovil(index)}
                        className="mt-8 p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <RiDeleteBin6Line size={22} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 7: TOKENS DINÁMICOS */}
        </div>
      </MultiStepModal>

      <NotificationDialog
        isOpen={notification.show}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => {
          setNotification((prev) => ({ ...prev, show: false }));
          if (notification.autoClose) {
            onClose();
          }
        }}
      />
    </>
  );
}
