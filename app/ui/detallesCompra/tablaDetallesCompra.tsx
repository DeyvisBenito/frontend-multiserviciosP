import { DetalleCompra } from "@/app/lib/definitions";

import { DeleteDetC, UpdateDetC } from "./buttons";

export default function TablaDetallesCompra({
  idCompra,
  detalles,
  onDeleted,
  mostrarBtns,
}: {
  idCompra: string;
  mostrarBtns: boolean;
  detalles: DetalleCompra[];
  onDeleted: (id: number) => void;
}) {
  let total = 0;
  detalles.forEach((det) => {
    total = total + det.cantidad * det.precioCosto;
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
                      Costo: Q{detalle.precioCosto}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    {mostrarBtns && (
                      <>
                        <UpdateDetC idCompra={idCompra} idDet={detalle.id} />
                        <DeleteDetC
                          idCompra={idCompra}
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
                    <strong>Q. {total}</strong>
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
                  Precio Costo
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Subtotal
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
                    Q.{detalle.precioCosto}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    Q.{detalle.precioCosto * detalle.cantidad}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {mostrarBtns && (
                        <>
                          <UpdateDetC idCompra={idCompra} idDet={detalle.id} />
                          <DeleteDetC
                            idCompra={idCompra}
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
                <td className="whitespace-nowrap px-3 py-3">
                  <strong className="underline">Q.{total}</strong>
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
