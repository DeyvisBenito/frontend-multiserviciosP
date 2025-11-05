"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { resetearPassword, validarTokenResetearPassword } from "@/app/lib/api";
import {
  CredencialesResetearPassword,
  ReseteoPasswordIn,
  ResetPasswordForm,
} from "@/app/lib/definitions";
import { useEffect, useState } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>();

  const router = useRouter();

  useEffect(() => {
    const emailParam = searchParams.get("email") || "";
    const tokenParam = searchParams.get("token") || "";
    setEmail(emailParam);
    setToken(tokenParam);

    let credenciales: CredencialesResetearPassword = {
      Email: emailParam,
      TokenResetPassword: tokenParam,
    };

    const fetchValidarToken = async () => {
      try {
        const data = await validarTokenResetearPassword(credenciales);
        if (!data) {
          router.push("/auth/login");
          return;
        }
        
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchValidarToken();
  }, [searchParams]);

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmarPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    let credenciales: ReseteoPasswordIn = {
      Email: email,
      Token: token,
      NuevoPassword: data.password,
    };

    try {
      await resetearPassword(credenciales);
      toast.success("Contraseña cambiada con éxito", {
        description: "Volviendo al login...",
      });
      await sleep(2000);
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full max-w-md mx-auto">
      <Toaster position="top-center" richColors />

      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Cambiar Password
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Nuevo Password */}
        <label htmlFor="password" className="font-medium">
          Nuevo Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Nueva contraseña"
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
          {...register("password", {
            required: "La contraseña es requerida",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}

        {/* Confirmar Password */}
        <label htmlFor="confirmarPassword" className="font-medium mt-2">
          Confirmar Password
        </label>
        <input
          type="password"
          id="confirmarPassword"
          placeholder="Confirmar contraseña"
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
          {...register("confirmarPassword", {
            required: "Debes confirmar la contraseña",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
          })}
        />
        {errors.confirmarPassword && (
          <span className="text-red-500 text-sm">
            {errors.confirmarPassword.message}
          </span>
        )}

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
          >
            Confirmar
          </button>
          <Link
            href="/auth/login"
            className="flex-1 text-center text-gray-800 hover:text-gray-600 font-semibold transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
