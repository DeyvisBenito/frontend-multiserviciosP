import { Venta } from "@/app/lib/definitions";

import { estados } from "@/app/lib/utilities/estadosEnum";
import { useUserRole, useUserSucursal } from "@/app/lib/decodeToken";
import { useRouter } from "next/navigation";
import { ContinuoVenta, DeleteVenta, SeeVenta, UpdateVenta } from "./buttons";

export default function TablaVentas({
  ventas,
  onDeleted,
}: {
  ventas: Venta[];
  onDeleted: (id: number) => void;
}) {
  const router = useRouter();
  const rol = useUserRole();
  const sucursalId = useUserSucursal();

  const ventaSucursal = ventas.filter((x) => {
    if (rol === "admin") {
      return true;
    } else {
      return (
        x.sucursalId === Number(sucursalId) && x.estadoId !== estados.Eliminado
      );
    }
  });

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {ventaSucursal?.map((venta) => (
              <div
                key={venta.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{venta.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {venta.cliente.nombres}
                    </p>
                    <p className="text-sm text-gray-500">{venta.sucursal}</p>
                    <p className="text-sm text-gray-500">
                      Q.
                      {venta.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {
                        new Date(venta.fechaCreacion)
                          .toISOString()
                          .split("T")[0]
                      }
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p
                      className={`text-xl font-medium ${
                        venta.estadoId === estados.Finalizado
                          ? "text-blue-700"
                          : "text-red-600"
                      }`}
                    >
                      {venta.estado}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {rol &&
                      (rol === "vendedor" ? (
                        <>
                          {venta.estadoId === estados.Pendiente ? (
                            <ContinuoVenta id={venta.id} />
                          ) : null}
                          <SeeVenta id={venta.id} />
                          <UpdateVenta id={venta.id} />
                          <DeleteVenta id={venta.id} onDeleted={onDeleted} />
                        </>
                      ) : null)}

                    {rol !== "vendedor" && <SeeVenta id={venta.id} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Id
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Cliente
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Productos
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Sucursal
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Estado
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {ventaSucursal?.map((venta) => (
                <tr
                  key={venta.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{venta.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {venta.cliente.nombres}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {venta.detallesVenta.length}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {venta.sucursal}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    Q.
                    {venta.total.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {new Date(venta.fechaCreacion).toISOString().split("T")[0]}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-3 ${
                      venta.estadoId === estados.Finalizado
                        ? "text-blue-700"
                        : "text-red-600"
                    }`}
                  >
                    {venta.estado}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {rol &&
                        (rol === "vendedor" ? (
                          <>
                            {venta.estadoId === estados.Pendiente ? (
                              <ContinuoVenta id={venta.id} />
                            ) : null}
                            <SeeVenta id={venta.id} />
                            <UpdateVenta id={venta.id} />
                            <DeleteVenta id={venta.id} onDeleted={onDeleted} />
                          </>
                        ) : null)}

                      {rol !== "vendedor" && <SeeVenta id={venta.id} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
