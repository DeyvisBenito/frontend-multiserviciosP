import { getBestClientesPorVenta } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { BestCliente } from "@/app/lib/definitions";
import { useValidateAdmin } from "@/app/lib/useValidateToken";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function TablaBestClientes() {
  useValidateAdmin();
  const router = useRouter();
  const [clientes, setClientes] = useState<BestCliente[]>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const obterDatos = async () => {
      try {
        const clientes = await getBestClientesPorVenta(token);
        if (clientes === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const clientesData: BestCliente[] = clientes as BestCliente[];
        setClientes(clientesData);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    obterDatos();
  }, []);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
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
                <th scope="col" className="px-3 py-5 font-medium">
                  Cantidad de Ventas
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total gastado
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
                  <td className="whitespace-nowrap px-3 py-3">
                    {cliente.cantidadVentas}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    Q.{cliente.totalGastado}
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
