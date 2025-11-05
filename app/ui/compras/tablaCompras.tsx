import { Compra } from "@/app/lib/definitions";

import { estados } from "@/app/lib/utilities/estadosEnum";
import { useUserRole, useUserSucursal } from "@/app/lib/decodeToken";
import { useRouter } from "next/navigation";
import {
  ContinuoCompra,
  DeleteCompra,
  SeeCompra,
  UpdateCompra,
} from "./buttons";

export default function TablaCompras({
  compras,
  onDeleted,
}: {
  compras: Compra[];
  onDeleted: (id: number) => void;
}) {
  const router = useRouter();
  const rol = useUserRole();
  const sucursalId = useUserSucursal();

  const comprasSucursal = compras.filter((x) => {
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
            {comprasSucursal?.map((compra) => (
              <div
                key={compra.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{compra.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {compra.proveedor.nombres}
                    </p>
                    <p className="text-sm text-gray-500">{compra.sucursal}</p>
                    <p className="text-sm text-gray-500">
                      Q.
                      {compra.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {
                        new Date(compra.fechaCreacion)
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
                        compra.estadoId === estados.Finalizado
                          ? "text-blue-700"
                          : "text-red-600"
                      }`}
                    >
                      {compra.estado}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {rol &&
                      (rol === "vendedor" ? (
                        <>
                          {compra.estadoId === estados.Pendiente ? (
                            <ContinuoCompra id={compra.id} />
                          ) : null}
                          <SeeCompra id={compra.id} />
                          <UpdateCompra id={compra.id} />
                          <DeleteCompra id={compra.id} onDeleted={onDeleted} />
                        </>
                      ) : null)}

                    {rol !== "vendedor" && <SeeCompra id={compra.id} />}
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
                  Proveedor
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
              {comprasSucursal?.map((compra) => (
                <tr
                  key={compra.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{compra.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {compra.proveedor.nombres}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {compra.detallesCompra.length}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {compra.sucursal}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    Q. {compra.total.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {new Date(compra.fechaCreacion).toISOString().split("T")[0]}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-3 ${
                      compra.estadoId === estados.Finalizado
                        ? "text-blue-700"
                        : "text-red-600"
                    }`}
                  >
                    {compra.estado}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {rol &&
                        (rol === "vendedor" ? (
                          <>
                            {compra.estadoId === estados.Pendiente ? (
                              <ContinuoCompra id={compra.id} />
                            ) : null}
                            <SeeCompra id={compra.id} />
                            <UpdateCompra id={compra.id} />
                            <DeleteCompra
                              id={compra.id}
                              onDeleted={onDeleted}
                            />
                          </>
                        ) : null)}

                      {rol !== "vendedor" && <SeeCompra id={compra.id} />}
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
