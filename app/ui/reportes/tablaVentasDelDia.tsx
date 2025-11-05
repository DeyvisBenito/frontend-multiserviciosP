import { getBestClientesPorVenta, getVentasDelDia } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { BestCliente, VentaDelDia } from "@/app/lib/definitions";
import { useValidateAdmin } from "@/app/lib/useValidateToken";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function TablaVentasDelDia() {
  useValidateAdmin();
  const router = useRouter();
  const [ventas, setVentas] = useState<VentaDelDia[]>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const obterDatos = async () => {
      try {
        const data = await getVentasDelDia(token);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const ventasData: VentaDelDia[] = data as VentaDelDia[];
        setVentas(ventasData);
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
                  No. Venta
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  No. Cliente
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Nit Cliente
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Cliente
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
              </tr>
            </thead>
            <tbody className="bg-white">
              {ventas?.map((venta) => (
                <tr
                  key={venta.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3 max-w-[120px] overflow-hidden">
                      <p className="truncate">{venta.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{venta.clienteId}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {venta.nitCliente}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {venta.cliente}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {venta.sucursal}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    Q. {venta.total}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {new Date(venta.fechaCreacion).toLocaleDateString("es-GT")}
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
