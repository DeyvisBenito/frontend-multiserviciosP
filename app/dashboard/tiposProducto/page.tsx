"use client";

import { useRouter } from "next/navigation";

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import { getTiposProductos } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { TipoProducto } from "@/app/lib/definitions";
import TablaTiposProducto from "@/app/ui/tiposProducto/tablaTiposProducto";
import { CreateTipoProducto } from "@/app/ui/tiposProducto/buttons";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function TiposProductoPage() {
  const router = useRouter();
  useValidateToken();
  useValidateAdmin();

  // States for total and current page
  //const [total, setTotal] = useState(0);
  //const [page, setPage] = useState(1);
  // Products per page
  //const sizeProducts: number = 5;

  const [respTiposProducto, setRespTiposProducto] = useState<TipoProducto[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchTiposProducto = async () => {
      try {
        const data = await getTiposProductos(token);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const tiposPro: TipoProducto[] = data as TipoProducto[];
        setRespTiposProducto(tiposPro);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchTiposProducto();
  }, [router]);

  return (
    <div className="w-full">
      <Toaster position="top-center" richColors />
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Tipos de producto</h1>
      </div>
      <div className="mt-4 flex items-center gap-2 md:mt-8 text-end justify-end">
        <CreateTipoProducto />
      </div>
      <div>
        <TablaTiposProducto
          tiposProducto={respTiposProducto}
          onDeleted={(deletedId) => {
            setRespTiposProducto((prev: TipoProducto[]) =>
              prev.filter((p) => p.id !== deletedId)
            );
          }}
        />
      </div>
    </div>
  );
}
