"use client";
import LoginForm from "@/components/ui/loginForm";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { FaCircleNotch } from "react-icons/fa";

export default function LoginPage() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/panel";
    }
  }, [status]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f8f9fa]">
      {/* CAPA SUPERIOR AZUL - Ocupa el 50% superior */}
      <div className="absolute top-0 left-0 h-1/2 w-full bg-[#005eff]"></div>

      {/* CONTENEDOR DEL LOGO - Pegado al top */}
      <div className="absolute top-[-30px] left-0 w-full flex justify-center pt-8 z-20">
        <div className="flex items-center gap-2">
          <img
            src="/medizin.svg"
            alt="Medizin Logo"
            className="w-14 h-14 brightness-0 invert"
          />
        </div>
      </div>

      {/* CONTENEDOR DEL FORMULARIO */}
      <div className="relative z-10 w-full max-w-md px-4 mt-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
