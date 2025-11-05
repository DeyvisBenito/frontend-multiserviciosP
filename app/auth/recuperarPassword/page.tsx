"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { recuperarPassword } from "@/app/lib/api";
import { RecuperarForm } from "@/app/lib/definitions";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function RecuperarPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecuperarForm>();

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await recuperarPassword(data.email);
      toast.success("Se ha enviado un correo para recuperar su contraseña");
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
        Recuperar Contraseña
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <label htmlFor="email" className="font-medium">
          Correo electrónico
        </label>
        <input
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
          type="email"
          id="email"
          placeholder="ejemplo@gmail.com"
          {...register("email", {
            required: {
              value: true,
              message: "El Correo Electrónico es requerido",
            },
          })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
          >
            Recuperar
          </button>
          <Link
            href="/auth/login"
            className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow-md transition-colors"
          >
            Volver
          </Link>
        </div>
      </form>
    </div>
  );
}
