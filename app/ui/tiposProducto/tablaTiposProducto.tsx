import { TipoProducto } from "@/app/lib/definitions";
import { DeleteTipoProducto, UpdateTipoProducto } from "./buttons";
import { estados } from "@/app/lib/utilities/estadosEnum";

export default function TablaTiposProducto({
  tiposProducto,
  onDeleted,
}: {
  tiposProducto: TipoProducto[];
  onDeleted: (id: number) => void;
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {tiposProducto?.map((tipo) => (
              <div
                key={tipo.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{tipo.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{tipo.nombre}</p>
                    <p className="text-sm text-gray-500">{tipo.categoria}</p>
                    <p className="text-sm text-gray-500">{tipo.tipoMedida}</p>
                  </div>
                  <p>{tipo.nombre} </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className={`text-xl font-medium ${tipo.estadoId === estados.Activo ? "text-green-600" : "text-red-600"}`}>
                      {tipo.estado}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateTipoProducto id={tipo.id} />
                    <DeleteTipoProducto id={tipo.id} onDeleted={onDeleted} />
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
                  Categoria
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Tipo de Medida
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Estado
                </th>
                <th>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {tiposProducto?.map((tipo) => (
                <tr
                  key={tipo.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{tipo.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {tipo.nombre}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {tipo.categoria}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {tipo.tipoMedida}
                  </td>
                  <td className={`whitespace-nowrap px-3 py-3 ${tipo.estadoId === estados.Activo ? "text-green-600" : "text-red-600"}`}>
                    {tipo.estado}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateTipoProducto id={tipo.id} />
                      <DeleteTipoProducto id={tipo.id} onDeleted={onDeleted} />
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
