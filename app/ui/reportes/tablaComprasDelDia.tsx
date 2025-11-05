import { getComprasDelDia } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { CompraDelDia, VentaDelDia } from "@/app/lib/definitions";
import { useValidateAdmin } from "@/app/lib/useValidateToken";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function TablaComprasDelDia() {
  useValidateAdmin();
  const router = useRouter();
  const [compras, setCompras] = useState<CompraDelDia[]>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const obterDatos = async () => {
      try {
        const data = await getComprasDelDia(token);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const comprasData: CompraDelDia[] = data as CompraDelDia[];
        setCompras(comprasData);
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
                  No. Compra
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  No. Proveedor
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Nit Proveedor
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Proveedor
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
              {compras?.map((compra) => (
                <tr
                  key={compra.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3 max-w-[120px] overflow-hidden">
                      <p className="truncate">{compra.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{compra.proveedorId}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {compra.nitProveedor}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {compra.proveedor}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {compra.sucursal}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    Q. {compra.total}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {new Date(compra.fechaCreacion).toLocaleDateString("es-GT")}
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
