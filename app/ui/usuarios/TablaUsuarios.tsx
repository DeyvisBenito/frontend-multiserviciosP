import { TipoProducto, UsuarioGet } from "@/app/lib/definitions";
import { estados } from "@/app/lib/utilities/estadosEnum";
import { DeleteUser, SeeUser, UpdateUser } from "./buttons";

export default function TablaUsuarios({
  usuarios,
  onDeleted,
}: {
  usuarios: UsuarioGet[];
  onDeleted: (id: string) => void;
}) {
  const usuariosVendedor = usuarios.filter((u) =>
    u.claims.some((c) => c.type === "rol" && c.value === "vendedor")
  );

  const usuariosAdmin = usuarios.filter((u) =>
    u.claims.some((c) => c.type === "rol" && c.value === "admin")
  );

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <h2 className="text-center text-lg font-bold border-gray-300 pb-2 pt-4">
            Administradores
          </h2>
          <div className="md:hidden">
            {usuariosAdmin?.map((uAd) => (
              <div key={uAd.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{uAd.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{uAd.email}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4"></div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p
                      className={`text-xl font-medium ${
                        uAd.estadoId === estados.Activo
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {uAd.estado}
                    </p>
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
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {usuariosAdmin?.map((uAd) => (
                <tr
                  key={uAd.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3 max-w-[120px] overflow-hidden">
                      <p className="truncate" title={uAd.id}>
                        {uAd.id}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{uAd.email}</td>
                  <td
                    className={`whitespace-nowrap px-3 py-3 ${
                      uAd.estadoId === estados.Activo
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {uAd.estado}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-b-4 mb-10"></div>
          <h2 className="text-center text-lg font-bold border-b-2 border-gray-300 pb-2">
            Vendedores
          </h2>
          <div className="md:hidden">
            {usuariosVendedor?.map((uVen) => (
              <div
                key={uVen.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{uVen.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{uVen.email}</p>
                    <p className="text-sm text-gray-500">
                      Sucursal: {uVen.sucursal?.nombre}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p
                      className={`text-xl font-medium ${
                        uVen.estadoId === estados.Activo
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {uVen.estado}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <SeeUser id={uVen.id} />
                    <UpdateUser id={uVen.id} />
                    <DeleteUser id={uVen.id} onDeleted={onDeleted} />
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
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Sucursal
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {usuariosVendedor?.map((uVen) => (
                <tr
                  key={uVen.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3 max-w-[120px] overflow-hidden">
                      <p className="truncate" title={uVen.id}>
                        {uVen.id}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{uVen.email}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {uVen.sucursal?.nombre}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-3 ${
                      uVen.estadoId === estados.Activo
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {uVen.estado}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <SeeUser id={uVen.id} />
                      <UpdateUser id={uVen.id} />
                      <DeleteUser id={uVen.id} onDeleted={onDeleted} />
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
