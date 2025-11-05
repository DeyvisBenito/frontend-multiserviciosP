import { DetalleVenta } from "@/app/lib/definitions";

import { DeleteDetV, UpdateDetV } from "./buttons";
import { useEffect } from "react";
import {
  EquivalenciasConteoUnidades,
  EquivalenciasMasaLibras,
  UnidadMedidaEnum,
} from "@/app/lib/utilities/unidadMedidaEnum";

export default function TablaDetallesVenta({
  idVenta,
  detalles,
  onDeleted,
  mostrarBtns,
}: {
  idVenta: string;
  mostrarBtns: boolean;
  detalles: DetalleVenta[];
  onDeleted: (id: number) => void;
}) {
  let total = 0;
  detalles.forEach((det) => {
    total = total + det.total;
  });

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {detalles?.map((detalle) => (
              <div
                key={detalle.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{detalle.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {detalle.inventario.nombre}
                    </p>
                    <p className="text-sm text-gray-500">
                      Por {detalle.unidadMedida}
                    </p>
                    <p className="text-sm text-gray-500">
                      Cantidad: {detalle.cantidad}
                    </p>
                    <p className="text-sm text-gray-500">
                      Precio: Q.
                      {detalle.unidadMedidaId === UnidadMedidaEnum.libra
                        ? (
                            detalle.precioVenta * EquivalenciasMasaLibras.libra
                          ).toFixed(2)
                        : detalle.unidadMedidaId === UnidadMedidaEnum.arroba
                        ? (
                            detalle.precioVenta * EquivalenciasMasaLibras.arroba
                          ).toFixed(2)
                        : detalle.unidadMedidaId === UnidadMedidaEnum.quintal
                        ? (
                            detalle.precioVenta *
                            EquivalenciasMasaLibras.quintal
                          ).toFixed(2)
                        : detalle.unidadMedidaId === UnidadMedidaEnum.unidad
                        ? (
                            detalle.precioVenta *
                            EquivalenciasConteoUnidades.unidad
                          ).toFixed(2)
                        : detalle.unidadMedidaId === UnidadMedidaEnum.docena
                        ? (
                            detalle.precioVenta *
                            EquivalenciasConteoUnidades.docena
                          ).toFixed(2)
                        : detalle.unidadMedidaId === UnidadMedidaEnum.caja
                        ? (
                            detalle.precioVenta * detalle.unidadesPorCaja
                          ).toFixed(2)
                        : detalle.precioVenta.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Descuento: {Math.round(detalle.descuento * 100)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      Precio con descuento: Q.
                      {detalle.unidadMedidaId === UnidadMedidaEnum.libra
                        ? (
                            detalle.precioVentaConDescuento *
                            EquivalenciasMasaLibras.libra
                          ).toFixed(2)
                        : detalle.unidadMedidaId === UnidadMedidaEnum.arroba
                        ? (
                            detalle.precioVentaConDescuento *
                            EquivalenciasMasaLibras.arroba
                          ).toFixed(2)
                        : detalle.unidadMedidaId === UnidadMedidaEnum.quintal
                        ? (
                            detalle.precioVentaConDescuento *
                            EquivalenciasMasaLibras.quintal
                          ).toFixed(2)
                        : detalle.unidadMedidaId === UnidadMedidaEnum.unidad
                        ? (
                            detalle.precioVentaConDescuento *
                            EquivalenciasConteoUnidades.unidad
                          ).toFixed(2)
                        : detalle.unidadMedidaId === UnidadMedidaEnum.docena
                        ? (
                            detalle.precioVentaConDescuento *
                            EquivalenciasConteoUnidades.docena
                          ).toFixed(2)
                        : detalle.unidadMedidaId === UnidadMedidaEnum.caja
                        ? (
                            detalle.precioVentaConDescuento *
                            detalle.unidadesPorCaja
                          ).toFixed(2)
                        : detalle.precioVentaConDescuento.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    {mostrarBtns && (
                      <>
                        <UpdateDetV idVenta={idVenta} idDet={detalle.id} />
                        <DeleteDetV
                          idVenta={idVenta}
                          idDet={detalle.id}
                          onDeleted={onDeleted}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="mb-2 w-full rounded-md bg-white p-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="mb-2 flex items-center">
                    <p>Total por todas las unidades:</p>
                  </div>
                  <p className="mb-2 flex justify-end underline">
                    <strong>Q. {Math.ceil(total * 100) / 100}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Id
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Codigo Producto
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Producto
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Unidad de Medida
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Cantidad
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Unidades por caja
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Precio
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Descuento
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Precio con descuento
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  SubTotal
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {detalles?.map((detalle) => (
                <tr
                  key={detalle.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{detalle.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {detalle.inventario.codigo}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {detalle.inventario.nombre}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {detalle.unidadMedida}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {detalle.cantidad}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {detalle.unidadesPorCaja ? detalle.unidadesPorCaja : <>/</>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    Q.
                    {detalle.unidadMedidaId === UnidadMedidaEnum.libra
                      ? (
                          detalle.precioVenta * EquivalenciasMasaLibras.libra
                        ).toFixed(2)
                      : detalle.unidadMedidaId === UnidadMedidaEnum.arroba
                      ? (
                          detalle.precioVenta * EquivalenciasMasaLibras.arroba
                        ).toFixed(2)
                      : detalle.unidadMedidaId === UnidadMedidaEnum.quintal
                      ? (
                          detalle.precioVenta * EquivalenciasMasaLibras.quintal
                        ).toFixed(2)
                      : detalle.unidadMedidaId === UnidadMedidaEnum.unidad
                      ? (
                          detalle.precioVenta *
                          EquivalenciasConteoUnidades.unidad
                        ).toFixed(2)
                      : detalle.unidadMedidaId === UnidadMedidaEnum.docena
                      ? (
                          detalle.precioVenta *
                          EquivalenciasConteoUnidades.docena
                        ).toFixed(2)
                      : detalle.unidadMedidaId === UnidadMedidaEnum.caja
                      ? (detalle.precioVenta * detalle.unidadesPorCaja).toFixed(
                          2
                        )
                      : detalle.precioVenta.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {Math.round(detalle.descuento * 100)}%
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    Q.
                    {detalle.unidadMedidaId === UnidadMedidaEnum.libra
                      ? (
                          detalle.precioVentaConDescuento *
                          EquivalenciasMasaLibras.libra
                        ).toFixed(2)
                      : detalle.unidadMedidaId === UnidadMedidaEnum.arroba
                      ? (
                          detalle.precioVentaConDescuento *
                          EquivalenciasMasaLibras.arroba
                        ).toFixed(2)
                      : detalle.unidadMedidaId === UnidadMedidaEnum.quintal
                      ? (
                          detalle.precioVentaConDescuento *
                          EquivalenciasMasaLibras.quintal
                        ).toFixed(2)
                      : detalle.unidadMedidaId === UnidadMedidaEnum.unidad
                      ? (
                          detalle.precioVentaConDescuento *
                          EquivalenciasConteoUnidades.unidad
                        ).toFixed(2)
                      : detalle.unidadMedidaId === UnidadMedidaEnum.docena
                      ? (
                          detalle.precioVentaConDescuento *
                          EquivalenciasConteoUnidades.docena
                        ).toFixed(2)
                      : detalle.unidadMedidaId === UnidadMedidaEnum.caja
                      ? (
                          detalle.precioVentaConDescuento *
                          detalle.unidadesPorCaja
                        ).toFixed(2)
                      : detalle.precioVentaConDescuento.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    Q.{detalle.total}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {mostrarBtns && (
                        <>
                          <UpdateDetV idVenta={idVenta} idDet={detalle.id} />
                          <DeleteDetV
                            idVenta={idVenta}
                            idDet={detalle.id}
                            onDeleted={onDeleted}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                <td className="whitespace-nowrap px-3 py-3">Total:</td>
                <td className="whitespace-nowrap px-3 py-3"></td>
                <td className="whitespace-nowrap px-3 py-3"></td>
                <td className="whitespace-nowrap px-3 py-3"></td>
                <td className="whitespace-nowrap px-3 py-3"></td>
                <td className="whitespace-nowrap px-3 py-3"></td>
                <td className="whitespace-nowrap px-3 py-3"></td>
                <td className="whitespace-nowrap px-3 py-3"></td>
                <td className="whitespace-nowrap px-3 py-3"></td>
                <td className="whitespace-nowrap px-3 py-3">
                  <strong className="underline">
                    Q.{Math.ceil(total * 100) / 100}
                  </strong>
                </td>
                <td className="whitespace-nowrap px-3 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
