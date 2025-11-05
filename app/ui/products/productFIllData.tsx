"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Inventario } from "@/app/lib/definitions";

import { useValidateToken } from "@/app/lib/useValidateToken";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ProductFillData({
  inventario,
  editable,
}: {
  inventario: Inventario | undefined;
  editable: boolean;
}) {
  useValidateToken();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {});

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {inventario && (
        <>
          {/* Código */}
          <label className="font-medium">Código:</label>
          <input
            type="text"
            readOnly
            defaultValue={inventario.codigo}
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          />

          {/* Inventario */}
          <label className="font-medium">Inventario:</label>
          <input
            type="text"
            readOnly
            defaultValue={inventario.nombre}
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          />

          {/* Tipo de producto */}
          <label className="font-medium">Tipo de producto:</label>
          <input
            type="text"
            readOnly
            defaultValue={inventario.tipoProducto}
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          />

          {/* Marca */}
          <label className="font-medium">Marca:</label>
          <input
            type="text"
            readOnly
            defaultValue={inventario.marca}
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          />

          {/* Sucursal */}
          <label className="font-medium">Sucursal:</label>
          <input
            type="text"
            readOnly
            defaultValue={inventario.sucursal}
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          />

          {/* Precio costo promedio */}
          <label className="font-medium">Precio Costo Promedio:</label>
          <input
            type="text"
            readOnly
            defaultValue={"Q. " + inventario.precioCostoPromedio}
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          />

          {/* Precio venta */}
          <label className="font-medium">Precio Venta:</label>
          <input
            type="text"
            readOnly
            defaultValue={"Q. " + inventario.precioVenta}
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          />

          {/* Stock disponible */}
          <label className="font-medium">Stock disponible:</label>
          <input
            type="text"
            readOnly
            defaultValue={inventario.stock}
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          />

          {/* Foto */}
          <label className="font-medium">Foto:</label>
          <div className="h-72 w-full overflow-hidden rounded-lg">
            <img
              src={inventario.urlFoto}
              alt={inventario.nombre}
              className="w-full max-h-72 object-contain mx-auto transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Descripción */}
          <label className="font-medium">Descripción:</label>
          <textarea
            readOnly
            defaultValue={inventario.descripcion}
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          />

          {editable && (
            <button
              id="btnActualizar"
              className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
            >
              Actualizar detalle
            </button>
          )}
        </>
      )}
    </form>
  );
}
