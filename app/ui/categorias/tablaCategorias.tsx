import { Categoria } from "@/app/lib/definitions";
import { DeleteCategoria, UpdateCategoria } from "./buttons";

export default function TablaCategorias({
  categorias,
  onDeleted,
}: {
  categorias: Categoria[];
  onDeleted: (id: number) => void;
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {categorias?.map((Categoria) => (
              <div
                key={Categoria.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{Categoria.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{Categoria.nombre}</p>
                  </div>
                  <p>{Categoria.nombre} </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className={`text-xl font-medium ${Categoria.estado === "Activo" ? "text-green-600" : "text-red-600"}`}>
                      {Categoria.estado}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateCategoria id={Categoria.id} />
                    <DeleteCategoria id={Categoria.id} onDeleted={onDeleted} />
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
              {categorias?.map((Categoria) => (
                <tr
                  key={Categoria.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{Categoria.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {Categoria.nombre}
                  </td>
                  <td className={`whitespace-nowrap px-3 py-3 ${Categoria.estado === "Activo" ? "text-green-600" : "text-red-600"}`}>
                    {Categoria.estado}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateCategoria id={Categoria.id} />
                      <DeleteCategoria id={Categoria.id} onDeleted={onDeleted} />
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
