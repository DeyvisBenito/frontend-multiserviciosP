"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useValidateToken } from "@/app/lib/useValidateToken";
import { postCategorias } from "@/app/lib/api";
import {
  CategoriaCreacion,
} from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { estados } from "@/app/lib/utilities/estadosEnum";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CategoriaFormCreate() {
  useValidateToken();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const button = document.getElementById("submitButton") as HTMLButtonElement;
    button.disabled = true;

    const token = localStorage.getItem("token");
    const postCategoria: CategoriaCreacion = {
      Nombre: data.nombre,
      IdEstado: estados.Activo
    };
    try {
      const data = await postCategorias(token, postCategoria);

      if (data === 403) {
        toast.error("No tienes autorización", {
          description: "Inicia sesión, por favor",
        });

        await sleep(2000);
        localStorage.removeItem("token");
        button.disabled = false;
        router.push("/auth/login");
        return;
      }

      toast.success("Categoria agregada correctamente", {
        description: "Volviendo al dashboard...",
      });

      await sleep(2000);
      button.disabled = false;
      router.push("/dashboard/categorias");
    } catch (error: any) {
      toast.error(error.message);
      button.disabled = false;
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
        {/* Nombre */}
        <label htmlFor="nombre" className="font-medium">
          Nombre:
        </label>
        <input
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
          type="text"
          id="nombre"
          {...register("nombre", { required: "El Nombre es requerido" })}
        />
        {errors.nombre && (
          <span className="text-red-500 text-sm">
            {errors.nombre.message as string}
          </span>
        )}

        {/* Botones */}
        <button
          id="submitButton"
          className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
        >
          Crear
        </button>

        <Link
          href="/dashboard/categorias"
          className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow-md transition-colors inline-block"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
