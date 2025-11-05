"use client";

import { useParams, useRouter } from "next/navigation";

import {
  Categoria,
  TipoMedida,
  TipoProducto,
  TipoProductoCreacion,
} from "@/app/lib/definitions";
import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import { getCategorias, getTiposMedida, updateTipoProducto } from "@/app/lib/api";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useUserRole } from "@/app/lib/decodeToken";
import { estados } from "@/app/lib/utilities/estadosEnum";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function TipoProductFillData({
  tipoProduct,
  editable,
}: {
  tipoProduct: TipoProducto | null;
  editable: boolean;
}) {
  useValidateToken();
  useValidateAdmin();
  const role = useUserRole();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tiposMedida, setTiposMedida] = useState<TipoMedida[]>([]);

  const params = useParams();
  // Agarra el primer elemento si es que viene un array en el param
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Tipo de producto no seleccionado");
    setTimeout(() => {
      router.push("/dashboard/tiposProducto");
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

    const postTipProduc: TipoProductoCreacion = {
      Nombre: data.nombre,
      EstadoId: data.estado,
      CategoriaId: data.categoria,
      TipoMedidaId: data.tipoMedida
    };
    try {
      const data = await updateTipoProducto(token, id, postTipProduc);

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

      toast.success("Tipo de producto actualizado correctamente", {
        description: "Volviendo al dashboard...",
      });

      await sleep(2000);
      button.disabled = false;
      router.push("/dashboard/tiposProducto");
    } catch (error: any) {
      toast.error(error.message);
      button.disabled = false;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const obterDatos = async () => {
      try {
        const categoriasdata = await getCategorias(token);
        if (categoriasdata === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const categorias: Categoria[] = categoriasdata as Categoria[];
        setCategorias(categorias);

        const dataTiposMedida = await getTiposMedida(token);
        if (dataTiposMedida === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const tiposMedida: TipoMedida[] = dataTiposMedida as TipoMedida[];
        setTiposMedida(tiposMedida);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    obterDatos();
  }, [router]);

  return (
    <form onSubmit={onSubmit}>
      {tipoProduct && (
        <div className="flex flex-col gap-4">
          {/* Nombre */}
          <label htmlFor="nombre" className="font-medium">
            Nombre
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="nombre"
            defaultValue={tipoProduct.nombre}
            readOnly={!editable}
            {...register("nombre", {
              required: {
                value: true,
                message: "El Nombre es requerido",
              },
            })}
          />
          {errors.nombre && (
            <span className="text-red-500 text-sm">
              {errors.nombre.message as string}
            </span>
          )}

          {/* Categoria */}
          <label htmlFor="categoria" className="font-medium mt-4">
            Categoria:
          </label>
          {editable ? (
            <>
              <select
                id="categoria"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
                {...register("categoria", {
                  required: "La categoria requerida",
                })}
              >
                <option value={tipoProduct.categoriaId}>
                  {tipoProduct.categoria}
                </option>
                {categorias
                  ?.filter((cat) => cat.estadoId === estados.Activo)
                  .map((cat) =>
                    cat.id != tipoProduct.categoriaId ? (
                      <option value={cat.id} key={cat.id}>
                        {cat.nombre}
                      </option>
                    ) : null
                  )}
              </select>
              {errors.categoria && (
                <span className="text-red-500 text-sm">
                  {errors.categoria.message as string}
                </span>
              )}
            </>
          ) : (
            <>
              <select
                id="categoria"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
              >
                <option value={tipoProduct.categoriaId}>
                  {tipoProduct.categoria}
                </option>
              </select>
            </>
          )}

          {/* TipoMedida */}
          <label htmlFor="tipoMedida" className="font-medium mt-4">
            Tipo de Medida:
          </label>
          {editable ? (
            <>
              <select
                id="tipoMedida"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
                {...register("tipoMedida", { required: "El tipo de medida es requerido" })}
              >
                <option value={tipoProduct.tipoMedidaId}>{tipoProduct.tipoMedida}</option>
                {tiposMedida
                  ?.map((tip) =>
                    tipoProduct.tipoMedidaId != tip.id ? (
                      <option value={tip.id} key={tip.id}>
                        {tip.nombre}
                      </option>
                    ) : null
                  )}
              </select>
              {errors.tipoMedida && (
                <span className="text-red-500 text-sm">
                  {errors.tipoMedida.message as string}
                </span>
              )}
            </>
          ) : (
            <>
              <select
                id="tipoMedida"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
              >
                <option value={tipoProduct.tipoMedidaId}>{tipoProduct.tipoMedida}</option>
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
                <option value={tipoProduct.estadoId}>{tipoProduct.estado}</option>
                {tipoProduct.estadoId == estados.Activo ? (
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
                <option value={tipoProduct.estadoId}>{tipoProduct.estado}</option>
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
