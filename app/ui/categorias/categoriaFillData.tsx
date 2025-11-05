"use client";

import { useParams, useRouter } from "next/navigation";

import {
  Categoria,
  CategoriaCreacion,
} from "@/app/lib/definitions";
import { useValidateToken } from "@/app/lib/useValidateToken";
import { updateCategoria } from "@/app/lib/api";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useUserRole } from "@/app/lib/decodeToken";
import { estados } from "@/app/lib/utilities/estadosEnum";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CategoriaFillData({
  categoria,
  editable,
}: {
  categoria: Categoria;
  editable: boolean;
}) {
  useValidateToken();
  const role = useUserRole();

  const params = useParams();
  // Agarra el primer elemento si es que viene un array en el param
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Categoria no seleccionada");
    setTimeout(() => {
      router.push("/dashboard/categorias");
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

    const postCategoriaCreacion: CategoriaCreacion = {
      Nombre: data.nombre,
      IdEstado: data.estado
    };

    try {
      const data = await updateCategoria(token, id, postCategoriaCreacion);

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

      toast.success("Categoria actualizado correctamente", {
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
      {categoria && (
        <div className="flex flex-col gap-4">
          {/* Nombre */}
          <label htmlFor="nombre" className="font-medium">
            Nombre
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="nombre"
            defaultValue={categoria.nombre}
            readOnly={!editable}
            {...register("nombre", {
              required: {
                value: true,
                message: "Name es requerido",
              },
            })}
          />
          {errors.nombre && (
            <span className="text-red-500 text-sm">
              {errors.nombre.message as string}
            </span>
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
                <option value={categoria.estadoId}>{categoria.estado}</option>
                {categoria.estadoId == estados.Activo ? (
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
                id="tipo"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
              >
                <option value={categoria.estadoId}>{categoria.estado}</option>
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
