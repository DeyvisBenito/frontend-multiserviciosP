"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useValidateToken } from "@/app/lib/useValidateToken";
import { postCliente, postVenta } from "@/app/lib/api";
import {
  ClienteCreacion,
  VentaCreacion,
  VentaCreacionResp,
} from "@/app/lib/definitions";
import { useState } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function VentaCreatePage() {
  useValidateToken();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    register: registerCliente,
    handleSubmit: handleSubmitCliente,
    formState: { errors: errorsCliente },
    reset: resetNuevoCliente,
  } = useForm();

  const router = useRouter();
  const [clienteCrear, setClienteCrear] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    const button = document.getElementById("submitButton") as HTMLButtonElement;
    button.disabled = true;

    const token = localStorage.getItem("token");
    const ventaCreacion: VentaCreacion = {
      ClienteNit: data.cliente,
      Total: 0,
    };
    try {
      const data = await postVenta(token, ventaCreacion);

      if (data === 403) {
        toast.error("No tienes autorización", {
          description: "Inicia sesión, por favor",
        });

        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        button.disabled = false;
        return;
      }

      toast.success("Exito, continue el proceso de venta", {
        description: "Redirigiendo al apartado de detalles...",
      });

      await sleep(2000);
      const venta: VentaCreacionResp = data as VentaCreacionResp;
      router.push(`/dashboard/ventas/${venta.id}/detallesVenta`);
      button.disabled = false;
    } catch (error: any) {
      setClienteCrear(true);
      toast.warning(error.message, {
        description: "Proceda a registrarlo",
      });
      button.disabled = false;
    }
  });

  const onRegistrarNuevoCliente = async (data: any) => {
    const clienteCreacion: ClienteCreacion = {
      Nit: data.nit,
      Nombres: data.nombres,
      Apellidos: data.apellidos,
      Email: data.email ? data.email : null,
      Telefono: data.telefono,
    };
    const token = localStorage.getItem("token");
    const buttonCrear = document.getElementById(
      "buttonCrear"
    ) as HTMLButtonElement;
    buttonCrear.disabled = true;
    try {
      const data = await postCliente(token, clienteCreacion);

      if (data === 403) {
        toast.error("No tienes autorización", {
          description: "Inicia sesión, por favor",
        });

        await sleep(2000);
        localStorage.removeItem("token");
        buttonCrear.disabled = false;
        router.push("/auth/login");
        return;
      }
      await sleep(2000);
      toast.success("Cliente agregado correctamente");
      setClienteCrear(false);
      buttonCrear.disabled = false;
      resetNuevoCliente();
    } catch (error: any) {
      toast.error(error.message);
      buttonCrear.disabled = false;
    }
  };

  const onClickCancelarCreacion = () => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded shadow-md flex flex-col gap-2">
        <p className="text-gray-800">
          ¿Seguro que desea cancelar la creacion? todo se borrará
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              toast.dismiss();
            }}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              resetNuevoCliente();
              setClienteCrear(false);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Confirmar
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          {/* Nit */}
          <label htmlFor="cliente" className="font-medium">
            Nit del Cliente:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="cliente"
            {...register("cliente", { required: "El nit es requerido" })}
          />
          {errors.cliente && (
            <span className="text-red-500 text-sm">
              {errors.cliente.message as string}
            </span>
          )}

          {/* Botones */}
          <button
            id="submitButton"
            className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
          >
            Continuar
          </button>

          <Link
            href="/dashboard/ventas"
            className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow-md transition-colors inline-block"
          >
            Cancelar
          </Link>
        </div>
      </form>
      {/* Si no existe cliente, crearlo */}
      {clienteCrear === true && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold text-center text-red-600 mb-4">
            Registrar nuevo Cliente
          </h2>
          <form
            onSubmit={handleSubmitCliente(onRegistrarNuevoCliente)}
            className="flex flex-col gap-4"
          >
            {/* Nit */}
            <label htmlFor="nit" className="font-medium">
              Nit:
            </label>
            <input
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
              type="text"
              id="nit"
              {...registerCliente("nit", {
                required: "El Nit es requerido",
              })}
            />
            {errorsCliente.nit && (
              <span className="text-red-500 text-sm">
                {errorsCliente.nit.message as string}
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
              {...registerCliente("nombres", {
                required: "Los nombres son requeridos",
              })}
            />
            {errorsCliente.nombres && (
              <span className="text-red-500 text-sm">
                {errorsCliente.nombres.message as string}
              </span>
            )}

            {/* Apellidos */}
            <label htmlFor="apellidos" className="font-medium mt-4">
              Apellidos:
            </label>
            <input
              className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
              type="text"
              id="apellidos"
              {...registerCliente("apellidos", {
                required: "Los apellidos son requeridos",
              })}
            />
            {errorsCliente.apellidos && (
              <span className="text-red-500 text-sm">
                {errorsCliente.apellidos.message as string}
              </span>
            )}

            {/* Email */}
            <label htmlFor="email" className="font-medium mt-4">
              Email (opcional):
            </label>
            <input
              className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
              type="email"
              id="email"
              {...registerCliente("email")}
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
              {...registerCliente("telefono", {
                required: "El telefono es requerido",
                pattern: {
                  value: /^[0-9]{8,15}$/,
                  message: "Ingresa un número de teléfono válido",
                },
              })}
            />
            {errorsCliente.telefono && (
              <span className="text-red-500 text-sm">
                {errorsCliente.telefono.message as string}
              </span>
            )}

            <button
              id="buttonCrear"
              className="bg-green-500 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Registrar Cliente
            </button>
            <button
              onClick={onClickCancelarCreacion}
              className="bg-gray-200 hover:bg-gray-300 py-2 rounded-lg font-semibold transition"
            >
              Cancelar Registro
            </button>
          </form>
        </div>
      )}
    </>
  );
}
