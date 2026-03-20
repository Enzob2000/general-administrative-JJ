"use client";

import { useState } from "react";
import { MultiStepModal } from "@/components/shared/modals/MultiStepModal";
import { FormInput, FormSelect } from "@/components/shared/modals/FormInput";
import { NotificationDialog } from "@/components/shared/modals/NotificationDialog";
import { useApiMutation } from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { ulid } from "ulid";
import { PHONE_PREFIXES } from "@/features/negocios/hooks/useCrearNegocioForm";

export function CrearGrupoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    autoClose: boolean;
  }>({
    show: false,
    type: "success",
    title: "",
    message: "",
    autoClose: false,
  });

  const [formData, setFormData] = useState({
    nombreGrupo: "",
    descripcion: "",
    nombrePropietario: "",
    fechaNacimiento: "",
    cedula: "",
    phonePrefix: "0412",
    telefonoBody: "",
    rifSuffix: "",
    usuarioEmail: "",
    password: "",
    confirmPassword: "",
    mpps: "",
  });

  const { mutate, isPending } = useApiMutation(
    "post",
    "/admin/PharmacyGroup/insertgroupsPharmacy",
  );

  const handleContinue = () => {
    const missingFields = [];

    // --- VALIDACIONES PASO 1 (Datos del Propietario/Grupo) ---
    if (step === 1) {
      if (!formData.nombreGrupo) missingFields.push("Nombre del Grupo");
      if (!formData.nombrePropietario)
        missingFields.push("Nombre del Propietario");
      if (!formData.cedula) missingFields.push("Cédula");
      if (!formData.rifSuffix) missingFields.push("Dígito RIF");

      // Validación de Cédula (Rango 1M - 99M)
      const cedulaNum = parseInt(formData.cedula);
      if (isNaN(cedulaNum) || cedulaNum < 1000000 || cedulaNum > 99999999) {
        missingFields.push("Cédula (rango inválido)");
      }

      // Validación de Teléfono (Exactamente 7 dígitos)
      if (!formData.telefonoBody || formData.telefonoBody.length !== 7) {
        missingFields.push("Teléfono (7 dígitos)");
      }

      // Si hay errores en Paso 1, mostramos notificación y frenamos
      if (missingFields.length > 0) {
        setNotification({
          show: true,
          type: "error",
          title: "Datos incompletos",
          message: `Por favor verifica: ${missingFields.join(", ")}.`,
          autoClose: false,
        });
        return;
      }

      setStep(2);

      // --- VALIDACIONES PASO 2 (Credenciales) ---
    } else {
      if (!formData.usuarioEmail) missingFields.push("Usuario/Email");
      if (!formData.password) missingFields.push("Contraseña");
      if (formData.password !== formData.confirmPassword) {
        missingFields.push("Las contraseñas no coinciden");
      }

      if (missingFields.length > 0) {
        setNotification({
          show: true,
          type: "error",
          title: "Error en credenciales",
          message: `Verifica: ${missingFields.join(", ")}.`,
          autoClose: false,
        });
        return;
      }

      // --- PROCESO DE ENVÍO (Mutate) ---
      const createdAt = new Date().toISOString();
      const payload = {
        id: "",
        id_group: ulid(),
        name_group: formData.nombreGrupo,
        permits: ["Admin"],
        created_at: createdAt,
        description: formData.descripcion || "Sin descripción",
        proprietary: {
          id: formData.cedula,
          name: formData.nombrePropietario,
          number: `+58${formData.phonePrefix.substring(1)}${formData.telefonoBody}`,
          rif: `J-${formData.cedula}-${formData.rifSuffix}`,
        },
        pharmacies: [],
        credentials: {
          user: formData.usuarioEmail,
          password: formData.password,
        },
      };

      mutate(
        { body: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["grupos"] });

            setNotification({
              show: true,
              type: "success",
              title: "¡Éxito!",
              message: "El grupo ha sido creado correctamente.",
              autoClose: true,
            });

            // Reset completo del formulario
            setFormData({
              nombreGrupo: "",
              descripcion: "",
              nombrePropietario: "",
              fechaNacimiento: "",
              cedula: "",
              phonePrefix: "0412",
              telefonoBody: "",
              rifSuffix: "",
              usuarioEmail: "",
              password: "",
              confirmPassword: "",
              mpps: "",
            });
            setStep(1);
          },
          onError: (err: any) => {
            console.error("[GROUP ERROR]:", err.response?.data);
            const serverMsg =
              err.response?.data?.message ||
              err.response?.data?.error ||
              err.message ||
              "No se pudo crear el grupo.";

            setNotification({
              show: true,
              type: "error",
              title: "Error de Servidor",
              message: `Detalle: ${serverMsg}`,
              autoClose: false,
            });
          },
        },
      );
    }
  };

  const passChecks = {
    length: formData.password.length >= 6,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    match:
      formData.password === formData.confirmPassword &&
      formData.password !== "",
  };

  return (
    <>
      <MultiStepModal
        isOpen={isOpen}
        onClose={onClose}
        title="Crear Grupo Regional"
        currentStep={step}
        totalSteps={2}
        onBack={() => setStep(1)}
        onContinue={handleContinue}
        continueLabel={step === 1 ? "Siguiente" : "Confirmar Registro"}
        isSubmitting={isPending}
      >
        {step === 1 ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-6 font-main">
                Datos del grupo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Nombre del grupo"
                  required
                  placeholder="Ej: Grupo Farmacéutico Regional"
                  value={formData.nombreGrupo}
                  onChange={(v) => setFormData({ ...formData, nombreGrupo: v })}
                />
                <FormInput
                  label="Descripción"
                  placeholder="Breve descripción del grupo..."
                  value={formData.descripcion}
                  onChange={(v) => setFormData({ ...formData, descripcion: v })}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-6 font-main">
                Datos del propietario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Nombre completo"
                  required
                  placeholder="Ej: Juan Pérez"
                  value={formData.nombrePropietario}
                  onChange={(v) =>
                    setFormData({ ...formData, nombrePropietario: v })
                  }
                />
                <FormInput
                  label="Cédula"
                  required
                  placeholder="Ej: 12345678"
                  value={formData.cedula}
                  onChange={(v) => {
                    const numeric = v.replace(/\D/g, "").slice(0, 8);
                    setFormData({ ...formData, cedula: numeric });
                  }}
                  hint="Rango: 1,000,000 - 99,999,999"
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-start gap-2">
                    <div className="w-32">
                      <FormSelect
                        label={null as any}
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
                        label={null as any}
                        placeholder="1234567"
                        value={formData.telefonoBody}
                        onChange={(v) => {
                          const numeric = v.replace(/\D/g, "").slice(0, 7);
                          setFormData({ ...formData, telefonoBody: numeric });
                        }}
                        hint="Obligatorio: 7 dígitos"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    RIF <span className="text-red-500">*</span>
                  </label>

                  <div className="flex items-start gap-2">
                    {/* Ajuste de altura para que sea igual al FormInput (h-[58px] y rounded-2xl) */}
                    <div className="flex-1 flex items-center h-[58px] rounded-2xl bg-gray-100/80 px-6 border-2 border-transparent text-gray-400 font-bold opacity-70">
                      J-{formData.cedula || "XXXXXXXX"}-
                    </div>

                    <div className="w-24">
                      <FormInput
                        label={null as any}
                        placeholder="0"
                        value={formData.rifSuffix}
                        onChange={(v) => {
                          const numeric = v.replace(/\D/g, "").slice(0, 1);
                          setFormData({ ...formData, rifSuffix: numeric });
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 font-medium ml-1">
                    Formato: J-{formData.cedula || "XXXXXXXX"}-
                    {formData.rifSuffix || "?"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex-1 space-y-8">
              <h3 className="text-xl font-bold text-blue-600 mb-2 font-main">
                Credenciales de Acceso
              </h3>
              <FormInput
                label="Usuario o correo"
                required
                placeholder="Ej: admin@grupo.com"
                value={formData.usuarioEmail}
                onChange={(v) => setFormData({ ...formData, usuarioEmail: v })}
              />
              <FormInput
                label="Contraseña"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(v) => setFormData({ ...formData, password: v })}
              />
              <FormInput
                label="Confirmar contraseña"
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(v) =>
                  setFormData({ ...formData, confirmPassword: v })
                }
              />
            </div>

            <div className="w-full md:w-80 pt-12 space-y-3">
              <CheckItem
                label="Mínimo 6 caracteres"
                active={passChecks.length}
              />
              <CheckItem label="Una mayúscula" active={passChecks.uppercase} />
              <CheckItem label="Una minúscula" active={passChecks.lowercase} />
              <CheckItem label="Un número" active={passChecks.number} />
              <CheckItem label="Coinciden" active={passChecks.match} />
            </div>
          </div>
        )}
      </MultiStepModal>

      <NotificationDialog
        isOpen={notification.show}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => {
          setNotification({ ...notification, show: false });
          if (notification.autoClose) {
            onClose();
          }
        }}
      />
    </>
  );
}

function CheckItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`size-3 rounded-full transition-colors ${active ? "bg-green-500" : "bg-gray-200"}`}
      />
      <span
        className={`text-[11px] font-bold ${active ? "text-gray-800" : "text-gray-400"}`}
      >
        {label}
      </span>
    </div>
  );
}
