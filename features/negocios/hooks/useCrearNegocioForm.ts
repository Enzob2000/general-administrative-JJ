import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiQuery } from "@/hooks/useApi";
import api from "@/lib/axios";
import { ulid } from "ulid";

// Constantes
export const ENTIDAD_MAP: Record<string, string> = {
  SMART: "SMART",
  // "BANCO PLAZA": "0138",
  R4: "0169",
};

export const PHONE_PREFIXES = ["0412", "0422", "0414", "0424", "0416", "0426"];

export const BANCOS_PAGO_MOVIL = [
  // { label: "BANCO PLAZA (0138)", value: "0138" },
  { label: "R4 (0169)", value: "0169" },
];

export function useCrearNegocioForm(isOpen: boolean, onClose: () => void) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [tokenStatus, setTokenStatus] = useState<
    Record<number, "idle" | "loading" | "success" | "error">
  >({
    0: "idle",
  });

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
    id: ulid(),
    nombreFarmacia: "",
    idGrupo: "",
    rifBody: "", // Solo números del RIF (8-9 dígitos)
    codigoSanitarioSuffix: "",
    phonePrefix: "0412",
    phoneBody: "",
    longitud: "",
    latitud: "",
    mppsSuffix: "",
    anniversary_month: "",
    titularCuenta: "",
    rifTitularBody: "", // Solo números
    numeroCuentaPrefix: "", // 4 dígitos
    numeroCuentaBody: "", // 16 dígitos
    // Modulos
    active_modules: [] as string[],
    custom_plan_price: "",
  });

  const [tokens, setTokens] = useState([{ entidad: "SMART", token: "" }]);
  const [pagoMovil, setPagoMovil] = useState([
    { bank: "0169", prefix: "0412", number: "", rif: "" },
  ]);

  // Helpers
  const formatRifForPagoMovil = (rif: string) => {
    // Si rif viene como J-12345678-9, quitar guiones y quitar ultimo digito
    return rif.replace(/-/g, "");
  };

  const toTitleCase = (str: string) => {
    return str
      .split(" ")
      .map((word) => {
        // Si la palabra ya está toda en mayúsculas (ej: CA, SA, USA), mantenerla
        if (word === word.toUpperCase() && word.length > 1) return word;
        // Si no, capitalizar primera letra
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  // Construye el RIF completo J-12345678-9
  const buildRif = (body: string) => {
    if (!body) return "";
    const clean = body.replace(/\D/g, "");
    if (clean.length < 2) return `J-${clean}`; // Fallback simple
    const suffix = clean.slice(-1);
    const prefix = clean.slice(0, -1);
    return `J-${prefix}-${suffix}`;
  };

  // Handlers
  const handleNameChange = (val: string) => {
    setFormData({ ...formData, nombreFarmacia: toTitleCase(val) });
  };

  const handleAccountHolderChange = (val: string) => {
    setFormData({ ...formData, titularCuenta: toTitleCase(val) });
  };

  const handlePhoneBodyChange = (val: string) => {
    const numeric = val.replace(/\D/g, "").slice(0, 7);
    setFormData({ ...formData, phoneBody: numeric });
  };

  const handleRifBodyChange = (val: string) => {
    const numeric = val.replace(/\D/g, "").slice(0, 9); // Max 9 digits
    setFormData({ ...formData, rifBody: numeric });
  };

  const handleRifTitularBodyChange = (val: string) => {
    const numeric = val.replace(/\D/g, "").slice(0, 9);
    setFormData({ ...formData, rifTitularBody: numeric });
  };

  const handleAccountPrefixChange = (val: string) => {
    const numeric = val.replace(/\D/g, "").slice(0, 4);
    setFormData({ ...formData, numeroCuentaPrefix: numeric });
  };

  const handleAccountBodyChange = (val: string) => {
    const numeric = val.replace(/\D/g, "").slice(0, 16);
    setFormData({ ...formData, numeroCuentaBody: numeric });
  };

  const handleMppsChange = (val: string) => {
    const numeric = val.replace(/\D/g, "");
    setFormData({ ...formData, mppsSuffix: numeric });
  };

  const handleHealthCodeChange = (val: string) => {
    setFormData({ ...formData, codigoSanitarioSuffix: val });
  };

  // Gestión de Arrays (Tokens y Pago Móvil)
  const addTokenField = () => {
    const entidadesPosibles = ["SMART", "R4"];
    // Buscamos cuál no está en uso
    const disponible = entidadesPosibles.find(
      (ent) => !tokens.some((t) => t.entidad === ent),
    );

    if (disponible) {
      setTokens([...tokens, { entidad: disponible, token: "" }]);
    }
  };

  const removeTokenField = (index: number) =>
    tokens.length > 1 && setTokens(tokens.filter((_, i) => i !== index));

  const updateTokenField = (
    index: number,
    field: "entidad" | "token",
    value: string,
  ) => {
    const newTokens = [...tokens];
    newTokens[index][field] = value;
    setTokens(newTokens);
    // Si cambia el token, reseteamos el estado de verificación a 'idle'
    if (field === "token") {
      setTokenStatus((prev) => ({ ...prev, [index]: "idle" }));
    }
  };

  const addPagoMovil = () =>
    pagoMovil.length < BANCOS_PAGO_MOVIL.length &&
    setPagoMovil([
      ...pagoMovil,
      { bank: "0169", prefix: "0412", number: "", rif: "" },
    ]);

  const removePagoMovil = (index: number) =>
    pagoMovil.length > 1 &&
    setPagoMovil(pagoMovil.filter((_, i) => i !== index));

  const updatePagoMovil = (index: number, field: string, value: string) => {
    const newPM = [...pagoMovil];
    newPM[index] = { ...newPM[index], [field]: value };
    if (field === "number") {
      // Limit 7 digits
      newPM[index].number = value.replace(/\D/g, "").slice(0, 7);
    }
    setPagoMovil(newPM);
  };

  // Data fetching
  const { data: groupsData } = useApiQuery<any[]>(
    ["groups-list"],
    "/admin/PharmacyGroup/groupsPharmacy",
    { enabled: isOpen },
  );

  const groupOptions = useMemo(() => {
    if (!groupsData || !Array.isArray(groupsData)) return [];
    return groupsData.map((g: any, index: number) => ({
      label: g.name_group || g.name || `Grupo #${index + 1}`,
      value: `${g.id_group || "unknown"}::${index}`,
    }));
  }, [groupsData]);

  // Mutacion para probar facturacion
  const { mutate: verifyToken, isPending: isVerifying } = useMutation({
    mutationFn: async ({
      index,
      rif,
      token,
    }: {
      index: number;
      rif: string;
      token: string;
    }) => {
      // El payload según tu especificación
      const payload = { rif, token };
      return api.post("/admin/Facturacion/test_facturacion", payload);
    },
    onSuccess: (_, variables) => {
      setTokenStatus((prev) => ({ ...prev, [variables.index]: "success" }));
      setNotification({
        show: true,
        type: "success",
        title: "Token Verificado",
        message: "Token Smart validado exitosamente.",
        autoClose: false,
      });
    },
    onError: (err: any, variables) => {
      setTokenStatus((prev) => ({ ...prev, [variables.index]: "error" }));
      const serverMsg =
        // err.response?.data?.message ||
        "El token SMART es inválido o expiró.";
      setNotification({
        show: true,
        type: "error",
        title: "Error de Verificación",
        message: serverMsg,
        autoClose: false,
      });
    },
  });

  //  Handler para el boton de verificar
  const handleVerifyToken = (index: number) => {
    const currentToken = tokens[index];
    const currentRif = buildRif(formData.rifBody);

    if (!currentRif || currentRif.length < 5) {
      return setNotification({
        show: true,
        type: "error",
        title: "RIF Requerido",
        message: "Primero debes ingresar el RIF de la farmacia en el Paso 2.",
        autoClose: false,
      });
    }

    if (!currentToken.token || currentToken.token.length < 10) {
      return setNotification({
        show: true,
        type: "error",
        title: "Token Vacío",
        message: "Debes pegar el token antes de verificarlo.",
        autoClose: false,
      });
    }

    setTokenStatus((prev) => ({ ...prev, [index]: "loading" }));
    verifyToken({ index, rif: currentRif, token: currentToken.token });
  };

  // --- MUTACIÓN PARA PROBAR R4 (OTP) ---
  const { mutate: verifyR4, isPending: isVerifyingR4 } = useMutation({
    mutationFn: async ({ index, token }: { index: number; token: string }) => {
      // El payload según la documentación de R4
      return api.post("/admin/R4/test", { token });
    },
    onSuccess: (_, variables) => {
      setTokenStatus((prev) => ({ ...prev, [variables.index]: "success" }));
      setNotification({
        show: true,
        type: "success",
        title: "Prueba R4 Exitosa",
        message: "Token R4 validado exitosamente.",
        autoClose: false,
      });
    },
    onError: (err: any, variables) => {
      setTokenStatus((prev) => ({ ...prev, [variables.index]: "error" }));
      const serverMsg =
        // err.response?.data?.message ||
        "Fallo del Token de R4.";
      setNotification({
        show: true,
        type: "error",
        title: "Fallo en R4",
        message: serverMsg,
        autoClose: false,
      });
    },
  });

  // --- HANDLER PARA EL BOTÓN DE R4 ---
  const handleVerifyR4 = (index: number) => {
    const currentToken = tokens[index];

    if (!currentToken.token || currentToken.token.length < 10) {
      return setNotification({
        show: true,
        type: "error",
        title: "Token Requerido",
        message: "Debes ingresar el token de R4 para realizar la prueba.",
        autoClose: false,
      });
    }

    setTokenStatus((prev) => ({ ...prev, [index]: "loading" }));
    verifyR4({ index, token: currentToken.token });
  };

  interface Status {
    status: "Pendiente" | "PorPagar" | "AlDia" | "Retrasada";
  }

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const cleanIdGrupo = formData.idGrupo.split("::")[0];
      const fullPhone = `+58${formData.phonePrefix.substring(1)}${formData.phoneBody}`;
      const fullRif = buildRif(formData.rifBody);
      const fullRifTitular = buildRif(formData.rifTitularBody);
      const fullAccount = `${formData.numeroCuentaPrefix}${formData.numeroCuentaBody}`;
      const currentStatus: Status["status"] = "AlDia";

      const pharmacyPayload = {
        id: formData.id,
        name: formData.nombreFarmacia,
        active_modules: formData.active_modules,
        status: currentStatus,
        custom_plan_price: formData.custom_plan_price
          ? parseFloat(formData.custom_plan_price)
          : 0,
        id_group: cleanIdGrupo,
        rif: fullRif,
        health_code: `HC-${formData.codigoSanitarioSuffix}`,
        geolocation: [
          parseFloat(formData.longitud) || 0,
          parseFloat(formData.latitud) || 0,
        ],
        telephone_number: fullPhone,
        mpps: `MPPS-${formData.mppsSuffix}`,
        anniversary_month: formData.anniversary_month,
        image: "https://medizins.com/default-pharmacy.jpg",
        // agents: ["ag-001"],
        medications: [],
        account_payment: [
          {
            name: formData.titularCuenta,
            bank_account: fullAccount,
            cedula: fullRifTitular,
          },
        ],
        payment_pago_movil: pagoMovil.map((pm) => ({
          bank: pm.bank,
          number: `+58${pm.prefix.substring(1)}${pm.number}`,
          rif: formatRifForPagoMovil(pm.rif || fullRif),
        })),
      };

      // console.log("[PHARMACY PAYLOAD]:", pharmacyPayload);

      try {
        await api.post("/admin/Pharmacy/createpharmacy", pharmacyPayload);
      } catch (err: any) {
        throw err;
      }

      const tokensPayload = tokens
        .filter((t) => t.token.trim() !== "")
        .map((t) => ({
          id_pharmacy: formData.id,
          token: t.token,
          entidad: ENTIDAD_MAP[t.entidad] || t.entidad,
        }));

      try {
        if (tokensPayload.length > 0) {
          await api.post("/admin/TokenCustodian/insert_token", tokensPayload);
        }
      } catch (err: any) {
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["negocios"] });
      setNotification({
        show: true,
        type: "success",
        title: "Registro Exitoso",
        message: "La farmacia y sus tokens han sido creados correctamente.",
        autoClose: true,
      });
      // Reset form
      setFormData({
        id: ulid(),
        nombreFarmacia: "",
        idGrupo: "",
        rifBody: "",
        codigoSanitarioSuffix: "",
        phonePrefix: "0412",
        phoneBody: "",
        longitud: "",
        latitud: "",
        mppsSuffix: "",
        anniversary_month: "",
        titularCuenta: "",
        rifTitularBody: "",
        numeroCuentaPrefix: "",
        numeroCuentaBody: "",
        // Modulos
        active_modules: [],
        custom_plan_price: "",
      });
      setTokens([{ entidad: "SMART", token: "" }]);
      setPagoMovil([{ bank: "0169", prefix: "0412", number: "", rif: "" }]);
      setStep(1);
    },
    onError: (err: any) => {
      console.error("[ERROR FINAL]", err);
      console.error("[DETALLE SERVIDOR]", err.response?.data);

      const serverMsg =
        err.response?.data?.message || err.response?.data?.error;
      const msg = serverMsg || err.message || "Error desconocido";

      setNotification({
        show: true,
        type: "error",
        title: "Error de Servidor (400)",
        message: `Fallo: ${msg}. Revisa la consola par más detalles técnicos.`,
        autoClose: false,
      });
    },
  });

  const handleContinue = () => {
    const missingFields = [];

    // --- LÓGICA DE VALIDACIÓN POR PASO ---
    if (step === 1) {
      if (formData.active_modules.length === 0) {
        // Aquí puedes lanzar una notificación o simplemente no avanzar
        missingFields.push("Módulos");
      }
    }
    if (step === 2) {
      if (!formData.nombreFarmacia) missingFields.push("Nombre de la Farmacia");
      if (!formData.idGrupo) missingFields.push("Grupo Farmacéutico");
    }

    if (step === 3) {
      if (!formData.rifBody) missingFields.push("RIF de la Farmacia");
      if (!formData.codigoSanitarioSuffix)
        missingFields.push("Registro Sanitario");
      if (!formData.mppsSuffix) missingFields.push("Registro MPPS");

      const rifNum = parseInt(formData.rifBody);
      if (isNaN(rifNum) || rifNum < 10000000 || rifNum > 999999999) {
        missingFields.push("RIF (debe estar entre 10M y 999M)");
      }
      if (formData.phoneBody.length !== 7) {
        missingFields.push("Teléfono (7 dígitos)");
      }
    }

    if (step === 4) {
      if (!formData.latitud || !formData.longitud) {
        missingFields.push("Ubicación GPS");
      }
    }

    if (step === 5) {
      if (!formData.titularCuenta) missingFields.push("Titular de la Cuenta");
      if (!formData.numeroCuentaPrefix)
        missingFields.push("Prefijo (4 dígitos)");

      const rifTitularNum = parseInt(formData.rifTitularBody);
      if (
        isNaN(rifTitularNum) ||
        rifTitularNum < 10000000 ||
        rifTitularNum > 999999999
      ) {
        missingFields.push("RIF del Titular inválido");
      }

      const numeroCuentaStr = formData.numeroCuentaBody.toString().trim();
      if (!/^\d{16}$/.test(numeroCuentaStr)) {
        missingFields.push("Número de cuenta (16 dígitos exactos)");
      }
    }

    if (step === 6) {
      if (pagoMovil.some((p) => !p.number || p.number.length !== 7)) {
        missingFields.push("Números de Pago Móvil (7 dígitos)");
      }
    }

    if (step === 7) {
      // Los tokens ahora son opcionales según requerimiento.
      // No agregamos nada a missingFields para permitir continuar/finalizar.
    }

    // --- PROCESAMIENTO DE ERRORES ---
    if (missingFields.length > 0) {
      setNotification({
        show: true,
        type: "error",
        title: "Datos incompletos",
        message: `Por favor completa: ${missingFields.join(", ")}.`,
        autoClose: false,
      });
      return;
    }

    // --- CAMBIO DE PASO O ENVÍO FINAL ---
    if (step < 7) {
      setStep(step + 1);
    } else {
      mutate();
    }
  };

  return {
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
    tokenStatus,
    handleVerifyToken,
    handleVerifyR4,
    isVerifying,
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
    setTokens,
  };
}
