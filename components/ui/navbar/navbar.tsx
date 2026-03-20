"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineBell,
  HiOutlineCog,
  HiLogout,
  HiUser,
  HiMenuAlt2,
  HiChevronDown,
} from "react-icons/hi";
import UserAvatar from "@/components/shared/dashboard/UserAvatar";
import { useAuthStore } from "@/store/useAuthStore";
import { signOut } from "next-auth/react";

interface UserNavbarProps {
  sectionName: string;
  toggleSidebar: () => void;
}

export default function UserNavbar({
  sectionName,
  toggleSidebar,
}: UserNavbarProps) {
  const { profile, clearAuth } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const user = {
    name: profile?.name,
    email: profile?.email,
    avatar: profile?.image || "/Logo.svg",
    role: profile?.role,
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    try {
      clearAuth();
      await signOut({ redirect: false });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const navBtnClass =
    "p-2 md:p-2.5 rounded-full bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm transition-all focus:outline-none flex items-center justify-center border border-slate-100";

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 py-3 lg:py-4 px-4 lg:px-8 flex justify-between items-center border-b border-slate-100/80 z-40 transition-all duration-300">
      <div className="flex items-center gap-3 lg:gap-6 min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-2 lg:hidden rounded-xl bg-slate-50 text-indigo-600 hover:bg-indigo-100 transition-colors focus:outline-none border border-slate-100"
        >
          <HiMenuAlt2 size={22} />
        </button>

        <div className="flex flex-col min-w-0">
          <h1 className="text-lg lg:text-2xl font-black text-slate-800 truncate tracking-tight">
            {sectionName}
          </h1>
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1.5 md:gap-3">
          <button className={navBtnClass} title="Configuración">
            <HiOutlineCog className="w-5 h-5" />
          </button>

          <button className={`${navBtnClass} relative`} title="Notificaciones">
            <HiOutlineBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
        </div>

        <div className="h-8 w-px bg-slate-100 mx-1 hidden xs:block"></div>

        {/* Perfil de Usuario */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-2.5 p-1.5 rounded-full transition-all focus:outline-none group border ${isProfileOpen ? "bg-indigo-50 border-indigo-100 shadow-sm" : "hover:bg-slate-50 border-transparent"}`}
          >
            <div className="relative">
              <UserAvatar
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 md:w-9 md:h-9 border-2 border-white ring-1 ring-slate-100 group-hover:ring-indigo-200"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            <div className="hidden lg:flex flex-col items-start pr-1 text-left leading-tight">
              <span className="text-xs font-black text-slate-800 leading-none">
                {user.name?.split(" ")[0] || "Usuario"}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                {user.role}
              </span>
            </div>
            <HiChevronDown
              className={`text-slate-400 transition-transform duration-300 hidden sm:block ${isProfileOpen ? "rotate-180 text-indigo-600" : "group-hover:text-slate-600"}`}
            />
          </button>

          {/* Dropdown */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              ></div>

              <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
                <div className="px-5 py-6 flex flex-col items-center text-center bg-gradient-to-b from-slate-50/50 to-white border-b border-slate-50">
                  <UserAvatar
                    src={user.avatar}
                    className="w-20 h-20 border-4 border-white shadow-xl mb-4 p-0.5 bg-indigo-50"
                  />
                  <h3 className="text-base font-black text-slate-800 tracking-tight">
                    {user.name}
                  </h3>
                  {/* <p className="text-xs text-slate-400 font-medium mb-3">
                    {user.email}
                  </p> */}
                  <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full tracking-widest border border-indigo-100/50">
                    {user.role}
                  </span>
                </div>

                <div className="p-2 space-y-1">
                  <button className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl w-full text-left transition-all group group-hover:translate-x-1">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <HiUser size={18} />
                    </div>
                    <span className="font-bold">Mi Perfil</span>
                  </button>

                  <button className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl w-full text-left transition-all group group-hover:translate-x-1 border-t border-slate-50 mt-1 pt-3">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors text-slate-400">
                      <HiOutlineCog size={18} />
                    </div>
                    <span className="font-bold">Configuración</span>
                  </button>

                  {/* Boton Cerrar Sesion */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 rounded-xl w-full text-left transition-all group active:scale-95"
                  >
                    <div className="p-2 bg-rose-100/50 rounded-lg group-hover:bg-white transition-colors">
                      <HiLogout size={18} />
                    </div>
                    <span className="font-black">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
