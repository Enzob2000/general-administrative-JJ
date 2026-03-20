"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthSync() {
  const { data: session, status } = useSession();
  const setProfile = useAuthStore((state) => state.setProfile);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const profile = useAuthStore((state) => state.profile);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // 1. Sincronizacion inicial desde NextAuth
  useEffect(() => {
    if (!isHydrated || status === "loading") {
      return;
    }

    if (status === "authenticated" && session?.user) {
      const storedProfile = useAuthStore.getState().profile;
      const sessAccessToken = (session as any).accessToken || "";
      const sessRefreshToken = (session as any).refreshToken || "";

      if (!storedProfile || storedProfile.email !== session.user.email) {
        setProfile({
          id: session.user.id || "",
          name: session.user.name || "",
          email: session.user.email || "",
          role: (session.user as any).role || "",
          image: session.user.image || "",
        });
      }
    } else if (status === "unauthenticated") {
      clearAuth();
    }
  }, [session, status, setProfile, clearAuth, isHydrated]);

  return null;
}
