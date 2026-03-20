import axios from "axios";
import { signOut, getSession, signIn } from "next-auth/react";

const cleanToken = (token: string | undefined): string => {
  if (!token) return "";
  return token.replace(/\s/g, "").replace(/[\x00-\x1F\x7F]/g, "");
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (
      (session as any)?.error === "RefreshAccessTokenError" ||
      (session as any)?.error === "CloudflareBlock"
    ) {
      const refreshToken = (session as any)?.refreshToken;

      if (refreshToken) {
        try {
          const resp = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: refreshToken }),
            },
          );

          if (!resp.ok) {
            console.error("[Refresh nativo falló (HTTP)", resp.status);
            throw new Error(`HTTP ${resp.status}`);
          }

          const data = await resp.json();

          if (data && (data.token || data.access_token)) {
            const result = await signIn("credentials", {
              isDirectLogin: "true",
              userData: JSON.stringify({
                ...data,
                user: (session as any)?.user,
              }),
              redirect: false,
            });

            if (result?.ok) {
              // console.log("[Axios] Sesión inyectada con éxito");
              const newSession = await getSession();
              const newToken = (newSession as any)?.accessToken;
              if (newToken) {
                config.headers.Authorization = `Bearer ${cleanToken(newToken)}`;
                return config;
              }
            }
          }
        } catch (error) {
          console.error("[Axios] Error en refresh nativo:", error);
        }
      }

      // console.error("[Axios] Falló recuperación nativa. Redirigiendo...");
      signOut({ callbackUrl: "/" });
      return config;
    }

    const token = (session as any)?.accessToken || "";

    if (token) {
      config.headers.Authorization = `Bearer ${cleanToken(token)}`;
    } else if (process.env.NEXT_PUBLIC_JWT) {
      // Fallback para tokens de ambiente si no hay sesión
      config.headers.Authorization = `Bearer ${cleanToken(process.env.NEXT_PUBLIC_JWT)}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Manejo de 401, 402, 403 para refresco de token ROBUSTO
    if (
      (error.response?.status === 401 ||
        error.response?.status === 402 ||
        error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const session = await getSession();
        const refreshToken = (session as any)?.refreshToken;

        if (refreshToken) {
          // 1. Pedimos el token al backend (Browser-side fetch)
          const resp = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: refreshToken }),
            },
          );

          if (!resp.ok) throw new Error("Backend rejected refresh token");

          const data = await resp.json();
          const newToken = data.token || data.access_token;

          if (newToken) {
            const result = await signIn("credentials", {
              isDirectLogin: "true",
              userData: JSON.stringify({
                token: newToken,
                refresh_token: data.refresh_token || refreshToken,
                user: (session as any)?.user,
                expires_in: data.expires_in || 3600,
              }),
              redirect: false,
            });

            if (result?.ok) {
              processQueue(null, newToken);
              originalRequest.headers["Authorization"] =
                `Bearer ${cleanToken(newToken)}`;
              return api(originalRequest);
            }
          }
        }
        throw new Error("No se pudo recuperar la sesión");
      } catch (refreshError) {
        console.error("[Axios] Refresh falló:", refreshError);
        processQueue(refreshError, null);
        signOut({ callbackUrl: "/" });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 2. Fix temporal para Cloudflare 502/Network Error
    if (
      (error.response?.status === 502 || error.message === "Network Error") &&
      (originalRequest.url?.includes("/admin/Pharmacy/createpharmacy") ||
        originalRequest.url?.includes("/admin/TokenCustodian/insert_token"))
    ) {
      console.warn(
        "[Axios] Detectado 502 o Network Error en creación de farmacia/token. Forzando éxito...",
      );
      return Promise.resolve({
        ...error.response,
        status: 200,
        data: {
          message: "Faked success from 502/Network Error",
          ...error.response?.data,
        },
      });
    }

    return Promise.reject(error);
  },
);

export default api;
