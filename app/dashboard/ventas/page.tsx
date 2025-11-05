"use client";

import { useRouter } from "next/navigation";

import { useValidateToken } from "@/app/lib/useValidateToken";
import { getCompras, getVentas } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Compra, Venta } from "@/app/lib/definitions";
import { useUserRole } from "@/app/lib/decodeToken";
import TablaCompras from "@/app/ui/compras/tablaCompras";
import { CreateCompra } from "@/app/ui/compras/buttons";
import TablaVentas from "@/app/ui/ventas/tablaVentas";
import { CreateVenta } from "@/app/ui/ventas/buttons";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function VentasPage() {
  const rol = useUserRole();
  const router = useRouter();
  useValidateToken();

  const [ventas, setVentas] = useState<Venta[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchVentas = async () => {
      try {
        const data = await getVentas(token);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const ventas: Venta[] = data as Venta[];
        setVentas(ventas);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchVentas();
  }, [router]);

  return (
    <div className="w-full">
      <Toaster position="top-center" richColors />
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Historial de Ventas</h1>
      </div>
      {rol &&
        (rol === "vendedor" ? (
          <div className="mt-4 flex items-center gap-2 md:mt-8 text-end justify-end">
            <CreateVenta />
          </div>
        ) : null)}
      <div>
        <TablaVentas
          ventas={ventas}
          onDeleted={(deletedId) => {
            setVentas((prev: Venta[]) =>
              prev.filter((p) => p.id !== deletedId)
            );
          }}
        />
      </div>
    </div>
  );
}
