"use client";
import { useState } from "react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCircleNotch,
} from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const apiResponse = await fetch(`${apiUrl}/loginAdmins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        setError(
          errorData.message || "Credenciales incorrectas o error de red",
        );
        setIsLoading(false);
        return;
      }

      const userData = await apiResponse.json();

      const result = await signIn("credentials", {
        isDirectLogin: "true",
        userData: JSON.stringify(userData),
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        localStorage.setItem("startedSession", "true");
        window.location.href = "/panel";
      }
    } catch (err: any) {
      setError("Error de conexión con el servidor");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-[2.5rem] bg-white p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">
          Iniciar Sesión
        </h2>
      </div>

      <form onSubmit={handleLogin} className="space-y-10">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
        {/* Input Usuario */}
        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
            Nombre de usuario
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-blue-600 transition-colors">
              <FaUser />
            </span>
            <input
              type="text"
              required
              disabled={isLoading}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Nombre de usuario"
              className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 placeholder-gray-600 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:opacity-50 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Input Contraseña */}
        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
            Contraseña
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-blue-600 transition-colors">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu clave de acceso"
              className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 py-3.5 pl-12 pr-12 text-gray-900 placeholder-gray-600 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:opacity-50 disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>

        <div className="mt-12">
          <button
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 rounded-2xl py-4 font-bold text-white shadow-lg transform transition-all active:scale-95 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed opacity-80"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? (
              <>
                <FaCircleNotch className="animate-spin text-xl" />
                <span>Iniciando...</span>
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
