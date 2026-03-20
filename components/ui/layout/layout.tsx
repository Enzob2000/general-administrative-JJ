"use client";
import { ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/ui/sidebar/sidebar";
import UserNavbar from "@/components/ui/navbar/navbar";
import { useSession } from "next-auth/react";
import { MENU_ITEMS } from "@/components/ui/sidebar/menuConstants";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuthStore } from "@/store/useAuthStore";
import { FaCircleNotch } from "react-icons/fa";

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isHydrated, profile } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const hasStartedSession = localStorage.getItem("startedSession") === "true";

    const timeoutDuration = hasStartedSession ? 4000 : 100;

    const timeout = setTimeout(() => {
      if (isHydrated && status === "unauthenticated") {
        localStorage.removeItem("startedSession");
        router.push("/");
      }
    }, timeoutDuration);

    return () => clearTimeout(timeout);
  }, [status, isHydrated, router]);

  const hasStartedSession =
    typeof window !== "undefined" &&
    localStorage.getItem("startedSession") === "true";
  const isRecovering = status === "unauthenticated" && hasStartedSession;
  const isSyncing = status === "authenticated" && !profile;
  const showSpinner =
    status === "loading" || !isHydrated || isSyncing || isRecovering;

  const activeItem = MENU_ITEMS.find((item) => item.href === pathname);
  const activeSection = activeItem ? activeItem.name : "Panel General";

  usePageTitle(activeSection);

  if (showSpinner) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#005eff]">
        <div className="flex flex-col items-center space-y-6">
          <img
            src="/medizin.svg"
            alt="Medizin Logo"
            className="h-20 w-auto brightness-0 invert animate-pulse"
          />
          <FaCircleNotch className="text-white animate-spin size-12" />
          <p className="text-white font-bold animate-pulse text-lg text-center">
            <span className="text-sm font-normal opacity-80">
              Por favor, espera un momento
            </span>
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    // console.log("[Layout] Sesión inválida. Redirigiendo a login.");
    router.replace("/");
    return null;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-gray-900">
      <div
        className={`
          fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar
          setActiveSection={() => setIsSidebarOpen(false)}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <UserNavbar
          sectionName={activeSection}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="max-w-8xl mx-auto h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
