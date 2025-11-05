"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useValidateToken } from "@/app/lib/useValidateToken";
import { getCategorias, getTiposMedida, postTipoProducto } from "@/app/lib/api";
import {
    Categoria,
  TipoMedida,
  TipoProductoCreacion,
} from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { estados } from "@/app/lib/utilities/estadosEnum";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function TipoProductFormCreate() {
  useValidateToken();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [tipoMedida, setTipoMedida] = useState<TipoMedida[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const button = document.getElementById("submitButton") as HTMLButtonElement;
    button.disabled = true;

    const token = localStorage.getItem("token");
    const postTipoProductoData: TipoProductoCreacion = {
      Nombre : data.nombre,
      EstadoId : estados.Activo,
      CategoriaId: data.categoria,
      TipoMedidaId: data.tipoMedida
    };
    try {
      const data = await postTipoProducto(token, postTipoProductoData);

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

      toast.success("Tipo de Producto agregado correctamente", {
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
        const dataCategorias = await getCategorias(token);
        if (dataCategorias === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const categorias: Categoria[] = dataCategorias as Categoria[];
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
        setTipoMedida(tiposMedida);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    obterDatos();
  }, [router]);

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
          {...register("nombre", { required: "El nombre es requerido" })}
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
        <select
          id="categoria"
          className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          {...register("categoria", {
            required: "La categoria es requerida",
          })}
        >
          <option value="">
            Seleccione una categoria
          </option>
          {categorias
            ?.filter((cat) => cat.estadoId === estados.Activo)
            .map((cat) => (
              <option value={cat.id} key={cat.id}>
                {cat.nombre}
              </option>
            ))}
        </select>
        {errors.categoria && (
          <span className="text-red-500 text-sm">
            {errors.categoria.message as string}
          </span>
        )}

        {/* Tipos Medida */}
        <label htmlFor="tipoMedida" className="font-medium mt-4">
          Tipo de Medida:
        </label>
        <select
          id="tipoMedida"
          className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          {...register("tipoMedida", { required: "El Tipo de Medida es requerido" })}
        >
          <option value="">
            Seleccione un tipo de Medida:
          </option>
          {tipoMedida
            ?.map((tipoM) => (
              <option value={tipoM.id} key={tipoM.id}>
                {tipoM.nombre}
              </option>
            ))}
        </select>
        {errors.tipoMedida && (
          <span className="text-red-500 text-sm">
            {errors.tipoMedida.message as string}
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
          href="/dashboard/tiposProducto"
          className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow-md transition-colors inline-block"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
