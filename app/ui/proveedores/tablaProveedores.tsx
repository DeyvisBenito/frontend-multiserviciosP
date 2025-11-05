import { Proveedor } from "@/app/lib/definitions";
import { DeleteProveedor, SeeProveedor, UpdateProveedor } from "./buttons";
import { estados } from "@/app/lib/utilities/estadosEnum";

export default function TablaProveedores({
  proveedores,
  onDeleted,
}: {
  proveedores: Proveedor[];
  onDeleted: (id: number) => void;
}) {
  const provDisponibles = proveedores.filter((x) => {
    if (x.estadoId === estados.Eliminado) {
      return false;
    }
    return true;
  });
  
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {provDisponibles?.map((prov) => (
              <div
                key={prov.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{prov.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{prov.nombres}</p>
                    <p className="text-sm text-gray-500">{prov.apellidos}</p>
                    <p className="text-sm text-gray-500">{prov.estado}</p>
                  </div>
                  <p>{prov.nit}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p
                      className={`text-xl font-medium ${
                        prov.estadoId === estados.Activo
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {prov.estado}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <SeeProveedor id={prov.id} />
                    <UpdateProveedor id={prov.id} />
                    <DeleteProveedor id={prov.id} onDeleted={onDeleted} />
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
                  Nit
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Nombres
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Apellidos
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Estado
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {provDisponibles?.map((prov) => (
                <tr
                  key={prov.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{prov.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{prov.nit}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {prov.nombres}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {prov.apellidos}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-3 ${
                      prov.estadoId === estados.Activo
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {prov.estado}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <SeeProveedor id={prov.id} />
                      <UpdateProveedor id={prov.id} />
                      <DeleteProveedor id={prov.id} onDeleted={onDeleted} />
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
