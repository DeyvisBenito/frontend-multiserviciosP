"use client";

import { useParams, useRouter } from "next/navigation";

import {
  Compra,
  CompraUpdate,
  ProveedorCreacionNit,
} from "@/app/lib/definitions";
import { useValidateToken } from "@/app/lib/useValidateToken";
import { updateCompra } from "@/app/lib/api";

import { toast } from "sonner";
import { useForm } from "react-hook-form";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CompraFillData({
  compra,
  editable,
}: {
  compra: Compra | null;
  editable: boolean;
}) {
  useValidateToken();

  const params = useParams();
  // Agarra el primer elemento si es que viene un array en el param
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Compra no seleccionado");
    setTimeout(() => {
      router.push("/dashboard/compras");
    }, 2000);

    return;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const token = localStorage.getItem("token");
    const button = document.getElementById("submitButton") as HTMLButtonElement;
    button.disabled = true;

    const proveedorCreacion: ProveedorCreacionNit = {
      Nit: data.nit,
    };
    const compraCreacion: CompraUpdate = {
      NitProveedor: data.nit,
    };
    try {
      const data = await updateCompra(token, id, compraCreacion);

      if (data === 403) {
        toast.error("No tienes autorización", {
          description: "Inicia sesión, por favor",
        });

        await sleep(1500);
        localStorage.removeItem("token");
        button.disabled = false;
        router.push("/auth/login");
        return;
      }

      toast.success("Compra actualizado correctamente", {
        description: "Volviendo al dashboard...",
      });

      await sleep(2000);
      button.disabled = false;
      router.push("/dashboard/compras");
    } catch (error: any) {
      toast.error(error.message);
      button.disabled = false;
    }
  });

  return (
    <>
      <form onSubmit={onSubmit}>
        {compra && (
          <div className="flex flex-col gap-4">
            {/* Proveedor */}
            <div className="font-medium text-center mt-4">Proveedor</div>
            {/* Nit */}
            <label htmlFor="nit" className="font-medium">
              {editable ? (
                <>Nit (Colocar Nit del nuevo proveedor):</>
              ) : (
                <>Nit:</>
              )}
            </label>
            <input
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
              type="text"
              id="nit"
              defaultValue={compra.proveedor.nit}
              readOnly={!editable}
              {...register("nit", {
                required: {
                  value: true,
                  message: "El nit es requerido",
                },
              })}
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
              defaultValue={compra.proveedor.nombres}
              readOnly={true}
              {...register("nombres", {
                required: {
                  value: true,
                  message: "Los nombres son requeridos",
                },
              })}
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
              defaultValue={compra.proveedor.apellidos}
              readOnly={true}
              {...register("apellidos", {
                required: {
                  value: true,
                  message: "Los apellidos son requeridos",
                },
              })}
            />
            {errors.apellidos && (
              <span className="text-red-500 text-sm">
                {errors.apellidos.message as string}
              </span>
            )}

            {/* Telefono */}
            <label htmlFor="telefono" className="font-medium">
              Telefono:
            </label>
            <input
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
              type="number"
              id="telefono"
              placeholder="00000000"
              defaultValue={compra.proveedor.telefono}
              readOnly={true}
              {...register("telefono", {
                required: {
                  value: true,
                  message: "El telefono es requerido",
                },
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
              Ubicación:
            </label>
            <textarea
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
              id="ubicacion"
              defaultValue={compra.proveedor.ubicacion}
              readOnly={true}
              {...register("ubicacion", {
                required: {
                  value: true,
                  message: "La ubicacion es requerida",
                },
              })}
            />
            {errors.ubicacion && (
              <span className="text-red-500 text-sm">
                {errors.ubicacion.message as string}
              </span>
            )}

            {/* Compra */}
            <div className="font-medium mt-4 text-center">Compra</div>
            {/* Vendedor */}
            <label htmlFor="ubicacion" className="font-medium">
              Vendedor:
            </label>
            <input
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
              id="ubicacion"
              type="text"
              defaultValue={compra.emailUser}
              readOnly={true}
            />
            {/* Sucursal */}
            <label htmlFor="ubicacion" className="font-medium">
              Sucursal:
            </label>
            <input
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
              id="ubicacion"
              type="text"
              defaultValue={compra.sucursal}
              readOnly={true}
            />
            <label htmlFor="estado" className="font-medium mt-4">
              Estado:
            </label>
            <select
              id="estados"
              className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
            >
              <option value={compra.estadoId}>{compra.estado}</option>
            </select>

            {editable && (
              <button
                id="submitButton"
                className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
              >
                Actualizar
              </button>
            )}
          </div>
        )}
      </form>
    </>
  );
}
