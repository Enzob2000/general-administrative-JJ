"use client";

import { signOut } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";
import { LuLogOut } from "react-icons/lu";

export default function LogoutButton({ className }: { className?: string }) {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    clearAuth();
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors font-medium ${className}`}
    >
      <LuLogOut size={20} />
      <span>Cerrar Sesión</span>
    </button>
  );
}
