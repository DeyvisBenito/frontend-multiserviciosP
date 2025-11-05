"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";

import { ClienteCreacion, RegisterConEmail, Sucursal } from "../../lib/definitions";
import { postCliente } from "@/app/lib/api";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ClienteCreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const token = localStorage.getItem("token");

    const crearteCliente: ClienteCreacion = {
      Nit: data.nit,
      Nombres: data.nombres,
      Apellidos: data.apellidos,
      Email: data.email ? data.email : null,
      Telefono: data.telefono
    };
    try {
      const data = await postCliente(token, crearteCliente);
      if (data === 403) {
        toast.error("No tienes acceso a este recurso", {
          description: "Por favor, inicie sesion",
        });
        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Cliente agregado con existo", {
        description: "Volviendo al dashboard...",
      });
      await sleep(1500);
      router.push("/dashboard/clientes");
    } catch (error: any) {
      toast.error(error.message);
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          {/* Nit */}
          <label htmlFor="nit" className="font-medium">
            Nit:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="nit"
            {...register("nit", {
              required: {
                value: true,
                message: "El Nit es requerido",
              },
            })}
          />

          {errors.nit && (
            <span className="text-red-500 text-sm">
              {errors.nit.message as string}
            </span>
          )}

          {/* Nombres */}
          <label htmlFor="nombres" className="font-medium mt-4">
            Nombres:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="nombres"
            {...register("nombres", {
              required: {
                value: true,
                message: "Los Nombres son requeridos",
              },
            })}
          />
          {errors.nombres && (
            <span className="text-red-500 text-sm">
              {errors.nombres.message as string}
            </span>
          )}

          {/* Apellidos */}
          <label htmlFor="apellidos" className="font-medium mt-4">
            Apellidos:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="apellidos"
            {...register("apellidos", {
              required: {
                value: true,
                message: "Los Apellidos son requeridos",
              },
            })}
          />
          {errors.apellidos && (
            <span className="text-red-500 text-sm">
              {errors.apellidos.message as string}
            </span>
          )}

          {/* Email */}
          <label htmlFor="email" className="font-medium">
            Email (opcional):
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="email"
            id="email"
            {...register("email")}
          />

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

          <button className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors">
            Agregar Cliente
          </button>

          <Link
            href="/dashboard/clientes"
            className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow-md transition-colors inline-block"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
