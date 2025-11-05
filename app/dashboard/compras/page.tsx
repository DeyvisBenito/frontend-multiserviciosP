"use client";

import { useRouter } from "next/navigation";

import { useValidateToken } from "@/app/lib/useValidateToken";
import { getCompras } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Compra } from "@/app/lib/definitions";
import { useUserRole } from "@/app/lib/decodeToken";
import TablaCompras from "@/app/ui/compras/tablaCompras";
import { CreateCompra } from "@/app/ui/compras/buttons";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ComprasPage() {
  const rol = useUserRole();
  const router = useRouter();
  useValidateToken();

  const [respCompras, setRespCompras] = useState<Compra[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchCompras = async () => {
      try {
        const data = await getCompras(token);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const compras: Compra[] = data as Compra[];
        setRespCompras(compras);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchCompras();
  }, [router]);

  return (
    <div className="w-full">
      <Toaster position="top-center" richColors />
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Historial de Compras</h1>
      </div>
      {rol &&
        (rol === "vendedor" ? (
          <div className="mt-4 flex items-center gap-2 md:mt-8 text-end justify-end">
            <CreateCompra />
          </div>
        ) : null)}
      <div>
        <TablaCompras
          compras={respCompras}
          onDeleted={(deletedId) => {
            setRespCompras((prev: Compra[]) =>
              prev.filter((p) => p.id !== deletedId)
            );
          }}
        />
      </div>
    </div>
  );
}
