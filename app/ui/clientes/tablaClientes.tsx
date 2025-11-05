import { Cliente, TipoProducto, UsuarioGet } from "@/app/lib/definitions";
import { estados } from "@/app/lib/utilities/estadosEnum";
import { DeleteUser, SeeUser, UpdateUser } from "../usuarios/buttons";
import { DeleteCliente, SeeCliente, UpdateCliente } from "./buttons";

export default function TablaClientes({
  clientes,
  onDeleted,
}: {
  clientes: Cliente[];
  onDeleted: (id: number) => void;
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {clientes?.map((cliente) => (
              <div
                key={cliente.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{cliente.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{cliente.nit}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  {cliente.nombres} {cliente.apellidos}
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  {cliente.email}
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  {cliente.telefono}
                </div>
                <div className="flex justify-end gap-2">
                  <SeeCliente id={cliente.id} />
                  <UpdateCliente id={cliente.id} />
                  <DeleteCliente id={cliente.id} onDeleted={onDeleted} />
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
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Telefono
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {clientes?.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3 max-w-[120px] overflow-hidden">
                      <p className="truncate">{cliente.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{cliente.nit}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {cliente.nombres}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {cliente.apellidos}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {cliente.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {cliente.telefono}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <SeeCliente id={cliente.id} />
                      <UpdateCliente id={cliente.id} />
                      <DeleteCliente id={cliente.id} onDeleted={onDeleted} />
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
