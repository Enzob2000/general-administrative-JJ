import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

interface AuthState {
  profile: UserProfile | null;
  isHydrated: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setHydrated: (state: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      profile: null,
      isHydrated: false,
      setProfile: (profile) => set({ profile }),
      setHydrated: (state) => set({ isHydrated: state }),
      clearAuth: () => set({ profile: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
