"use client";

import { useParams, useRouter } from "next/navigation";

import {
  DetalleCompra,
  DetalleCompraCreacion,
  Inventario,
  ProveedorCreacion,
  TipoProducto,
  UnidadMedida,
} from "@/app/lib/definitions";
import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import {
  getInventarioByCodigo,
  getTipoProductoById,
  getTiposProductos,
  getUnidadesMedida,
  updateDetCompra,
  updateProveedor,
} from "@/app/lib/api";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { estados } from "@/app/lib/utilities/estadosEnum";
import { useEffect, useState } from "react";
import { UnidadMedidaEnum } from "@/app/lib/utilities/unidadMedidaEnum";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DetalleFillData({
  detalle,
  editable,
  idCompra,
  idDet,
}: {
  detalle: DetalleCompra | null;
  editable: boolean;
  idCompra: string;
  idDet: string;
}) {
  useValidateToken();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const unidadSeleccionada = watch("unidadMedida");
  const unidadMedidaIdActual = detalle?.unidadMedidaId;

  const [tipoProduct, setTipoProduct] = useState<TipoProducto>();
  const [unidadMedida, setUnidadMedida] = useState<UnidadMedida[]>([]);
  const uMTipoPro = unidadMedida.filter(
    (x) => x.tipoMedidaId === tipoProduct?.tipoMedidaId
  );

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const token = localStorage.getItem("token");
    const button = document.getElementById("submitButton") as HTMLButtonElement;
    button.disabled = true;
    let unidadesC = null;
    if (data.unidadesCaja !== undefined && data.unidadesCaja !== null) {
      unidadesC = data.unidadesCaja;
    }
    const detalleCreacion: DetalleCompraCreacion = {
          EstadoId: estados.Activo,
          Cantidad: data.cantidad,
          CompraId: Number(idCompra),
          InventarioId: detalle?.inventario.id,
          PrecioCosto: data.precioCosto,
          UnidadMedidaId: data.unidadMedida,
          UnidadesPorCaja: unidadesC,
        };
    try {
      const data = await updateDetCompra(token, idDet, idCompra, detalleCreacion);

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

      toast.success("Detalle de compra actualizado correctamente", {
        description: "Volviendo a la compra...",
      });

      await sleep(2000);
      button.disabled = false;
      router.push(`/dashboard/compras/${idCompra}/detallesCompra`);
    } catch (error: any) {
      toast.error(error.message);
      button.disabled = false;
    }
  });

  useEffect(() => {
    if (!detalle) return;
    const token = localStorage.getItem("token");
    const getDatos = async () => {
      try {
        const dataTipoProducto = await getTipoProductoById(
          token,
          detalle?.inventario.tipoProductoId
        );
        const dataUnidadMedida = await getUnidadesMedida(token);

        if (dataTipoProducto === 403 || dataUnidadMedida === 403) {
          toast.error("No tienes autorización", {
            description: "Inicia sesión, por favor",
          });

          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }

        const tiposProductoData: TipoProducto =
          dataTipoProducto as TipoProducto;
        const unidadMedidaData: UnidadMedida[] =
          dataUnidadMedida as UnidadMedida[];
        setUnidadMedida(unidadMedidaData);
        setTipoProduct(tiposProductoData);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    getDatos();
  }, [router, detalle]);

  return (
    <form onSubmit={onSubmit}>
      {detalle && (
        <div className="flex flex-col gap-4">
          {/* Id */}
          <label htmlFor="id" className="font-medium">
            Id:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="number"
            id="id"
            defaultValue={detalle.id}
            readOnly={true}
          />

          {/* Codigo inventario */}
          <label htmlFor="codigo" className="font-medium">
            Codigo Inventario:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="codigo"
            defaultValue={detalle.inventario.codigo}
            readOnly={true}
          />

          {/* Nombre inventario */}
          <label htmlFor="inventario" className="font-medium">
            Inventario:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="inventario"
            defaultValue={detalle.inventario.nombre}
            readOnly={true}
          />

          {/* Unidad de medida */}
          <label htmlFor="unidadMedida" className="font-medium mt-4">
            Unidad de medida:
          </label>
          <select
            id="unidadMedida"
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
            {...register("unidadMedida", {
              required: "La unidad de medida es requerida",
            })}
          >
            <option value={detalle.unidadMedidaId}>
              {detalle.unidadMedida}
            </option>
            {uMTipoPro
              .filter((u) => u.id !== detalle.unidadMedidaId) 
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.medida}
                </option>
              ))}
          </select>
          {errors.unidadMedida && (
            <span className="text-red-500 text-sm">
              {errors.unidadMedida.message as string}
            </span>
          )}

          {/* Input cuando la unidad es caja */}
          {Number(unidadSeleccionada) === UnidadMedidaEnum.caja && (
            <div className="mt-3">
              <label htmlFor="unidadesCaja" className="font-medium">
                Unidades por caja:
              </label>
              <input
                id="unidadesCaja"
                type="number"
                min={1}
                max={1000}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 w-full"
                {...register("unidadesCaja", {
                  required: "Las unidades por caja son requeridas",
                  min: { value: 1, message: "Debe ser al menos 1 unidad" },
                  max: {
                    value: 1000,
                    message: "No puede exceder las 1000 unidades",
                  },
                })}
                defaultValue={detalle?.unidadesPorCaja || ""}
              />
              {errors.unidadesCaja && (
                <span className="text-red-500 text-sm">
                  {errors.unidadesCaja.message as string}
                </span>
              )}
            </div>
          )}

          {/* Cantidad */}
          <label htmlFor="cantidad" className="font-medium">
            Cantidad:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="number"
            min={1}
            id="cantidad"
            defaultValue={detalle.cantidad}
            readOnly={!editable}
            {...register("cantidad", {
              required: "La cantidad es requerida",
              min: { value: 1, message: "Debe ser al menos 1 cantidad" },
            })}
          />
          {errors.cantidad && (
            <span className="text-red-500 text-sm">
              {errors.cantidad.message as string}
            </span>
          )}

          {/* Precio Costo */}
          <label htmlFor="precioCosto" className="font-medium">
            Precio Costo por unidad de medida:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="number"
            min={1}
            id="precioCosto"
            readOnly={!editable}
            defaultValue={detalle.precioCosto}
            {...register("precioCosto", {
              required: "El precio de costo es requerido",
              min: { value: 1, message: "Debe ser al menos 1" },
            })}
          />
          {errors.precioCosto && (
            <span className="text-red-500 text-sm">
              {errors.precioCosto.message as string}
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
