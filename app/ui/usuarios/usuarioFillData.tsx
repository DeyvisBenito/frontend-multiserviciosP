"use client";

import { useParams, useRouter } from "next/navigation";

import { ProveedorCreacion, Sucursal, UsuarioGet, UsuarioUpdate } from "@/app/lib/definitions";
import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import { updateProveedor, updateUsuario } from "@/app/lib/api";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { estados } from "@/app/lib/utilities/estadosEnum";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function UsuarioFillData({
  usuario,
  editable,
  sucursales,
}: {
  usuario: UsuarioGet | null;
  editable: boolean;
  sucursales: Sucursal[] | null;
}) {
  useValidateToken();
  useValidateAdmin();

  const params = useParams();
  // Agarra el primer elemento si es que viene un array en el param
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Usuario no seleccionado");
    setTimeout(() => {
      router.push("/dashboard/usuarios");
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

    const usuarioUpdate: UsuarioUpdate = {
      Email: data.email,
      SucursalId: data.sucursal,
      EstadoId: data.estado
    };
    try {
      const data = await updateUsuario(token, id, usuarioUpdate);

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

      toast.success("Usuario actualizado correctamente", {
        description: "Volviendo al dashboard...",
      });

      await sleep(2000);
      button.disabled = false;
      router.push("/dashboard/usuarios");
    } catch (error: any) {
      toast.error(error.message);
      button.disabled = false;
    }
  });
  let sucursalesActivas;
  if (sucursales) {
    sucursalesActivas = sucursales.filter((x) => {
      if (x.estadoId !== estados.Activo) {
        return false;
      }
      return true;
    });
  }

  return (
    <form onSubmit={onSubmit}>
      {usuario && sucursalesActivas && (
        <div className="flex flex-col gap-4">
          {/* Id */}
          <label htmlFor="id" className="font-medium">
            Id:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="id"
            defaultValue={usuario.id}
            readOnly={true}
          />

          {/* Email */}
          <label htmlFor="email" className="font-medium">
            Email:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="email"
            id="email"
            defaultValue={usuario.email}
            readOnly={!editable}
            {...register("email", {
              required: {
                value: true,
                message: "El email es requerido",
              },
            })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">
              {errors.email.message as string}
            </span>
          )}

          {/* Sucursal */}
          <label htmlFor="sucursal" className="font-medium mt-4">
            Sucursal:
          </label>
          {editable ? (
            <>
              <select
                id="sucursal"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
                {...register("sucursal", {
                  required: "La sucursal es requerida",
                })}
              >
                <option value={usuario.sucursalId}>
                  {usuario.sucursal?.nombre}
                </option>
                {sucursalesActivas
                  .filter((s) => s.id !== usuario.sucursalId)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
              </select>
              {errors.sucursal && (
                <span className="text-red-500 text-sm">
                  {errors.sucursal.message as string}
                </span>
              )}
            </>
          ) : (
            <>
              <select
                id="sucursal"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
              >
                <option value={usuario.sucursalId}>{usuario.sucursal?.nombre}</option>
              </select>
            </>
          )}

          {/* Estado */}
          <label htmlFor="estado" className="font-medium mt-4">
            Estado:
          </label>
          {editable ? (
            <>
              <select
                id="estado"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
                {...register("estado", { required: "El estado es requerido" })}
              >
                <option value={usuario.estadoId}>{usuario.estado}</option>
                {usuario.estadoId == estados.Activo ? (
                  <option value={estados.Inactivo}>Inactivo</option>
                ) : (
                  <option value={estados.Activo}>Activo</option>
                )}
              </select>
              {errors.estado && (
                <span className="text-red-500 text-sm">
                  {errors.estado.message as string}
                </span>
              )}
            </>
          ) : (
            <>
              <select
                id="estados"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
              >
                <option value={usuario.estadoId}>{usuario.estado}</option>
              </select>
            </>
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
