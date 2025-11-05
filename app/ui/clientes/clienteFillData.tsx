"use client";

import { useParams, useRouter } from "next/navigation";

import { Cliente, ClienteCreacion } from "@/app/lib/definitions";
import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import { updateCliente } from "@/app/lib/api";

import { toast } from "sonner";
import { useForm } from "react-hook-form";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ClienteFillData({
  cliente,
  editable,
}: {
  cliente: Cliente | null;
  editable: boolean;
}) {
  useValidateToken();
  useValidateAdmin();

  const params = useParams();
  // Agarra el primer elemento si es que viene un array en el param
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Cliente no seleccionado");
    setTimeout(() => {
      router.push("/dashboard/clientes");
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

    const clienteUpdate: ClienteCreacion = {
      Nit: data.nit,
      Nombres: data.nombres,
      Apellidos: data.apellidos,
      Email: data.email ? data.email : null,
      Telefono: data.telefono,
    };
    try {
      const data = await updateCliente(token, id, clienteUpdate);

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

      toast.success("Cliente actualizado correctamente", {
        description: "Volviendo al dashboard...",
      });

      await sleep(2000);
      button.disabled = false;
      router.push("/dashboard/clientes");
    } catch (error: any) {
      toast.error(error.message);
      button.disabled = false;
    }
  });

  return (
    <form onSubmit={onSubmit}>
      {cliente && (
        <div className="flex flex-col gap-4">
          {/* Id */}
          <label htmlFor="id" className="font-medium">
            Id:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="id"
            defaultValue={cliente.id}
            readOnly={true}
          />

        {/* Nit */}
          <label htmlFor="nit" className="font-medium">
            Nit:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="nit"
            defaultValue={cliente.nit}
            readOnly={!editable}
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
          <label htmlFor="nombres" className="font-medium">
            Nombres:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="nombres"
            defaultValue={cliente.nombres}
            readOnly={!editable}
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
          <label htmlFor="apellidos" className="font-medium">
            Apellidos:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="apellidos"
            defaultValue={cliente.apellidos}
            readOnly={!editable}
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
            Email{editable ? "(opcional)" : ""}:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="email"
            id="email"
            defaultValue={cliente.email ? cliente.email : ""}
            readOnly={!editable}
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">
              {errors.email.message as string}
            </span>
          )}

          {/* Telefono */}
          <label htmlFor="telefono" className="font-medium">
            Telefono{editable ? "(todo junto)" : ""}:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="tel"
            id="telefono"
            readOnly={!editable}
            defaultValue={cliente.telefono}
            placeholder="00000000"
            {...register("telefono", {
              required: "El Telefono es requerido",
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
  );
}
