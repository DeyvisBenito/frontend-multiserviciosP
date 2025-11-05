import { Sucursal } from "@/app/lib/definitions";
import { estados } from "@/app/lib/utilities/estadosEnum";
import { SeeSucursal } from "./buttons";

export default function TablaSucursales({
  sucursales,
  onDeleted,
}: {
  sucursales: Sucursal[];
  onDeleted: (id: number) => void;
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {sucursales?.map((sucursal) => (
              <div
                key={sucursal.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{sucursal.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{sucursal.nombre}</p>
                  </div>
                  <p>{sucursal.nombre} </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p
                      className={`text-xl font-medium ${
                        sucursal.estadoId === estados.Activo
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {sucursal.estado}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <SeeSucursal id={sucursal.id} />
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
                  Nombre
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Estado
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sucursales?.map((sucursal) => (
                <tr
                  key={sucursal.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{sucursal.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sucursal.nombre}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-3 ${
                      sucursal.estadoId === estados.Activo
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {sucursal.estado}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <SeeSucursal id={sucursal.id} />
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
