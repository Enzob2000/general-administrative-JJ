"use client";

import { useState } from "react";
import { MultiStepModal } from "@/components/shared/modals/MultiStepModal";
import { FormInput } from "@/components/shared/modals/FormInput";
import { NotificationDialog } from "@/components/shared/modals/NotificationDialog";
import {
  RiUserSharedLine,
  RiLockPasswordLine,
  RiMailLine,
  RiShieldUserLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import { useApiMutation } from "@/hooks/useApi"; // Usando tu hook
import { useQueryClient } from "@tanstack/react-query";
import { ulid } from "ulid";

export function CrearAdminModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
    autoClose: false,
  });

  const [formData, setFormData] = useState({
    user: "",
    name: "",
    email: "",
    password: "",
    rol: [] as string[],
    description: "",
  });

  // --- IGUAL QUE EN GRUPOS: Usamos el mutation hook ---
  const { mutate, isPending } = useApiMutation(
    "post",
    "/admin/Admin/createAdmins",
  );

  const PERMISSION_GROUPS = [
    {
      label: "Acceso Total",
      permissions: [{ label: "Super Admin", value: "SuperAdmin" }],
    },
    {
      label: "Módulo de Farmacias",
      permissions: [
        { label: "Ver Farmacias", value: "ReadPharmacy" },
        { label: "Crear Farmacias", value: "CreatePharmacy" },
        { label: "Eliminar Farmacias", value: "DeletePharmacy" },
      ],
    },
    {
      label: "Módulo de Logística - Delivery",
      permissions: [
        { label: "Gestión Logística", value: "LogisticsManager" },
        { label: "Ver Deliveries", value: "ViewDeliveries" },
        {
          label: "Ver estado de deliveries",
          value: "UpdateDeliveryStatus",
        },
      ],
    },
    {
      label: "Módulo de Analítica",
      permissions: [
        { label: "Ver Estadísticas", value: "ViewStatistics" },
        { label: "Ver Facturación", value: "ViewBilling" },
      ],
    },
    {
      label: "Módulo de Usuarios",
      permissions: [
        { label: "Gestión de Usuarios", value: "ManageSystemUsers" },
      ],
    },
  ];

  const handleContinue = () => {
    const missingFields = [];

    // Validaciones Paso 1
    if (step === 1) {
      if (!formData.user) missingFields.push("Usuario");
      if (!formData.name) missingFields.push("Nombre");
      if (!formData.email.includes("@")) missingFields.push("Email válido");
      if (formData.password.length < 6)
        missingFields.push("Contraseña (min 6 carac.)");

      if (missingFields.length > 0) {
        setNotification({
          show: true,
          type: "error",
          title: "Campos requeridos",
          message: `Faltan: ${missingFields.join(", ")}`,
          autoClose: false,
        });
        return;
      }
      setStep(2);

      // Validaciones Paso 2 y Envío
    } else {
      if (formData.rol.length === 0) {
        setNotification({
          show: true,
          type: "error",
          title: "Faltan permisos",
          message: "Debes asignar al menos un rol al administrador.",
          autoClose: false,
        });
        return;
      }

      const payload = {
        user: formData.user,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        rol: formData.rol,
        description: formData.description.trim() || null,
        created_at: new Date().toISOString(),
      };

      mutate(
        { body: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            setNotification({
              show: true,
              type: "success",
              title: "¡Éxito!",
              message: "Administrador creado correctamente.",
              autoClose: true,
            });
            onClose();
          },
          onError: (err: any) => {
            setNotification({
              show: true,
              type: "error",
              title: "Error de Servidor",
              message:
                err.response?.data?.message || "Error al crear administrador",
              autoClose: false,
            });
          },
        },
      );
    }
  };

  return (
    <>
      <MultiStepModal
        isOpen={isOpen}
        onClose={onClose}
        title="Nuevo Administrador"
        currentStep={step}
        totalSteps={2}
        onBack={() => setStep(1)}
        onContinue={handleContinue}
        continueLabel={step === 2 ? "Registrar Ahora" : "Siguiente"}
        isSubmitting={isPending}
      >
        <div className="space-y-6">
          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
                <RiUserSharedLine /> Datos de Acceso
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Usuario"
                  value={formData.user}
                  onChange={(v) => setFormData({ ...formData, user: v })}
                />
                <FormInput
                  label="Nombre Real"
                  value={formData.name}
                  onChange={(v) => setFormData({ ...formData, name: v })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-end">
                <FormInput
                  label="Email"
                  icon={<RiMailLine />}
                  value={formData.email}
                  onChange={(v) => setFormData({ ...formData, email: v })}
                />
                <div className="relative">
                  <FormInput
                    label="Contraseña"
                    type="password"
                    icon={<RiLockPasswordLine />}
                    value={formData.password}
                    onChange={(v) => setFormData({ ...formData, password: v })}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
                <RiShieldUserLine /> Roles de Sistema
              </h3>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.label} className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                      {group.label}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.permissions.map((perm) => {
                        const selected = formData.rol.includes(perm.value);
                        return (
                          <button
                            key={perm.value}
                            type="button"
                            onClick={() => {
                              const newRoles = selected
                                ? formData.rol.filter((r) => r !== perm.value)
                                : [...formData.rol, perm.value];
                              setFormData({ ...formData, rol: newRoles });
                            }}
                            className={`p-3 text-[10px] font-black uppercase rounded-xl border-2 text-left transition-all ${
                              selected
                                ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"
                            }`}
                          >
                            {perm.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <FormInput
                  label="Descripción"
                  placeholder="Opcional..."
                  value={formData.description}
                  onChange={(v) => setFormData({ ...formData, description: v })}
                />
              </div>
            </div>
          )}
        </div>
      </MultiStepModal>

      <NotificationDialog
        isOpen={notification.show}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
}

const styles = `
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
