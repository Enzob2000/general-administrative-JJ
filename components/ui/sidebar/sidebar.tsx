"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiX, HiOutlineLogout, HiChevronRight } from "react-icons/hi";
import { MENU_ITEMS } from "./menuConstants";
import { useAuthStore } from "@/store/useAuthStore";
import { signOut } from "next-auth/react";

interface SidebarProps {
  setActiveSection: () => void;
  closeSidebar: () => void;
}

export default function Sidebar({
  setActiveSection,
  closeSidebar,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  const handleLogout = async () => {
    localStorage.removeItem("startedSession");
    clearAuth();
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  const [expandedItem, setExpandedItem] = useState<string | null>(() => {
    const activeParent = MENU_ITEMS.find((item) =>
      item.children?.some((child) => child.href === pathname),
    );
    return activeParent ? activeParent.name : null;
  });

  const handleParentClick = (item: any) => {
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      if (expandedItem === item.name) {
        setExpandedItem(null);
      } else {
        setExpandedItem(item.name);
      }
    } else {
      setExpandedItem(null);
      router.push(item.href);
      setActiveSection();
    }
  };

  const itemClass =
    "relative flex items-center px-7 py-5 transition-all text-base md:text-md w-full text-start  font-semibold cursor-pointer hover:bg-gray-50 gap-5";

  return (
    <div className="flex flex-col w-64 h-screen bg-white border-r border-gray-100 font-sans relative">
      {/* Boton para el cerrar el sidebar en movil */}
      <button
        onClick={closeSidebar}
        className="lg:hidden absolute top-2 right-2 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-all"
      >
        <HiX size={22} />
      </button>

      {/* Logo */}
      <div className="px-10 pt-10 pb-5 md:py-6 flex space-x-8">
        <img src="/Logo.svg" alt="Medizin" />
      </div>

      <nav className="flex-1 overflow-y-auto pt-0 scrollbar-hide">
        {MENU_ITEMS.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isParentActive =
            pathname === item.href ||
            item.children?.some((c) => c.href === pathname);
          const isExpanded = expandedItem === item.name;

          return (
            <div key={item.name} className="flex flex-col">
              <button
                onClick={() => handleParentClick(item)}
                className={`${itemClass} ${
                  isParentActive ? "text-primary" : "text-gray-700"
                }`}
              >
                {/* Indicador de item activo */}
                {isParentActive && (
                  <div className="absolute left-0 top-0  w-2 h-full bg-primary rounded-r-full" />
                )}
                <span className={`transition-transform scale-110`}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.name}</span>
                {hasChildren && (
                  <HiChevronRight
                    className={`transition-all duration-500 ease-out ${isExpanded ? "rotate-90" : "rotate-0"}`}
                    size={20}
                  />
                )}
              </button>

              {/* Submenu con transicion suave */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-gray-50/50 pb-2">
                  {item.children?.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link key={child.name} href={child.href} passHref>
                        <button
                          onClick={() => {
                            setActiveSection();
                            if (window.innerWidth < 1024) closeSidebar();
                          }}
                          className={`relative flex items-center pl-10 py-4 w-full text-left transition-all duration-200 bg-gray-200 cursor-pointer gap-5 font-semibold text-base md:text-md hover:bg-gray-300 ${
                            isChildActive
                              ? "text-primary"
                              : "text-gray-700 hover:text-gray-600"
                          }`}
                        >
                          <span className="scale-100">{child.icon}</span>
                          <span>{child.name}</span>
                        </button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-10 border-t border-gray-50">
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-700 hover:text-red-600 transition-colors w-full font-medium gap-5 cursor-pointer"
        >
          <HiOutlineLogout size={24} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
