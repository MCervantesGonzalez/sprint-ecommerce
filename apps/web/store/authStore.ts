import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const cookieStorage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(name, value);
    document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 7}`;
  },
  removeItem: (name: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
    document.cookie = `${name}=;path=/;max-age=0`;
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => {
        // Escribir cookie manualmente para que el middleware la lea inmediatamente
        const value = JSON.stringify({
          state: { token, user, isAuthenticated: true },
          version: 0,
        });
        document.cookie = `auth-storage=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 7}`;
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        document.cookie = "auth-storage=;path=/;max-age=0";
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
