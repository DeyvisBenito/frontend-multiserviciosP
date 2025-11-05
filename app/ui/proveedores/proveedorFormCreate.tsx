"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useValidateToken } from "@/app/lib/useValidateToken";
import {
  getCategorias,
  getTiposMedida,
  postProveedor,
  postTipoProducto,
} from "@/app/lib/api";
import {
  Categoria,
  ProveedorCreacion,
  TipoMedida,
  TipoProductoCreacion,
} from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { estados } from "@/app/lib/utilities/estadosEnum";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ProveedorCreatePage() {
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
    const proveedorCreacion: ProveedorCreacion = {
      Nit: data.nit,
      Nombres: data.nombres,
      Apellidos: data.apellidos,
      Telefono: data.telefono,
      Ubicacion: data.ubicacion,
      EstadoId: estados.Activo,
    };
    try {
      const data = await postProveedor(token, proveedorCreacion);

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

      toast.success("Proveedor agregado correctamente", {
        description: "Volviendo al dashboard...",
      });

      await sleep(2000);
      button.disabled = false;
      router.push("/dashboard/proveedores");
    } catch (error: any) {
      toast.error(error.message);
      button.disabled = false;
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
        {/* Nit */}
        <label htmlFor="nit" className="font-medium">
          Nit:
        </label>
        <input
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
          type="number"
          id="nit"
          {...register("nit", { required: "El nit es requerido" })}
        />
        {errors.nit && (
          <span className="text-red-500 text-sm">
            {errors.nit.message as string}
          </span>
        )}

        {/* Nombres */}
        <label htmlFor="nombres" className="font-medium">
          Nombres:
        </label>
        <input
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
          type="text"
          id="nombres"
          {...register("nombres", { required: "Los nombres son requeridos" })}
        />
        {errors.nombres && (
          <span className="text-red-500 text-sm">
            {errors.nombres.message as string}
          </span>
        )}

        {/* Apellidos */}
        <label htmlFor="apellidos" className="font-medium">
          Apellidos:
        </label>
        <input
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
          type="text"
          id="apellidos"
          {...register("apellidos", {
            required: "Los apellidos son requeridos",
          })}
        />
        {errors.apellidos && (
          <span className="text-red-500 text-sm">
            {errors.apellidos.message as string}
          </span>
        )}

        {/* Telefono */}
        <label htmlFor="telefono" className="font-medium">
          Telefono (Todo junto):
        </label>
        <input
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
          type="tel"
          id="telefono"
          placeholder="00000000"
          {...register("telefono", {
            required: "El telefono es requerido",
            pattern: {
              value: /^[0-9]{8,15}$/,
              message: "Ingresa un número de teléfono válido",
            },
          })}
        />
        {errors.telefono && (
          <span className="text-red-500 text-sm">
            {errors.telefono.message as string}
          </span>
        )}

        {/* Ubicacion */}
        <label htmlFor="ubicacion" className="font-medium">
          Ubicacion:
        </label>
        <textarea
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
          id="ubicacion"
          {...register("ubicacion", { required: "La ubicacion es requerida" })}
        />
        {errors.ubicacion && (
          <span className="text-red-500 text-sm">
            {errors.ubicacion.message as string}
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
          href="/dashboard/proveedores"
          className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow-md transition-colors inline-block"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
