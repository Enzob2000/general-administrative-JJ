import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        isDirectLogin: { type: "hidden" },
        userData: { type: "hidden" },
        isRefresh: { type: "hidden" },
        refreshToken: { type: "hidden" },
      },

      async authorize(credentials) {
        try {
          // --- CASO 1: SILENT REFRESH (DISPARADO POR AXIOS) ---
          if (credentials?.isRefresh === "true" && credentials?.refreshToken) {
            const storedUser = JSON.parse(credentials.userData || "{}");

            const response = await fetch(`${API_URL}/auth/refresh-token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: credentials.refreshToken }),
            });

            const rawText = await response.text();

            // Manejo de Cloudflare / Errores de Servidor (HTML)
            if (rawText.includes("<!DOCTYPE html>")) {
              return {
                ...storedUser,
                id: String(storedUser.id),
                accessToken: (credentials as any).accessToken,
              };
            }

            if (!response.ok) {
              console.error(`[Auth] Error en API (${response.status}).`);
              if (response.status === 401) return null;
              return { ...storedUser, id: String(storedUser.id) };
            }

            const data = JSON.parse(rawText);
            const newAccess = data.token || data.access_token;

            return {
              id: String(storedUser.id || "refresh-id"),
              name: storedUser.name,
              email: storedUser.email,
              role: storedUser.role || storedUser.rol,
              accessToken: newAccess,
              refreshToken: data.refresh_token || credentials.refreshToken,
              accessTokenExpires: Date.now() + (data.expires_in || 3600) * 1000,
            };
          }

          // --- CASO 2: LOGIN DIRECTO (INYECCIÓN) ---
          if (credentials?.isDirectLogin === "true" && credentials?.userData) {
            const data = JSON.parse(credentials.userData);
            const user = data.admin || data.user;

            return {
              id: String(user?.id),
              name: user?.name,
              email: user?.email,
              role: user?.rol || user?.role,
              accessToken: data.token,
              refreshToken: data.refresh_token,
              accessTokenExpires: Date.now() + (data.expires_in || 3600) * 1000,
            };
          }

          // --- CASO 3: LOGIN NORMAL ---
          console.log("[Auth] Intento de login normal...");
          const response = await fetch(`${API_URL}/loginAdmins`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: credentials?.username,
              password: credentials?.password,
            }),
          });

          if (!response.ok) return null;

          const data = await response.json();
          const user = data.admin;

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.rol,
            accessToken: data.token,
            refreshToken: data.refresh_token,
            accessTokenExpires: Date.now() + (data.expires_in || 3600) * 1000,
          };
        } catch (error) {
          console.error("[Auth] Error crítico en Authorize:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        return {
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpires: (user as any).accessTokenExpires,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (user as any).role,
          },
        };
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (token && token.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },

  pages: { signIn: "/" },
  session: { strategy: "jwt" as const, maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
} as any;
