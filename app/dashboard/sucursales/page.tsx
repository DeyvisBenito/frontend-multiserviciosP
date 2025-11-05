"use client";

import { useRouter } from "next/navigation";

import { CreateProduct } from "@/app/ui/products/buttons";
import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import { getBodegas, getSucursales } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Sucursal } from "@/app/lib/definitions";
import TablaBodegas from "@/app/ui/sucursales/tablaSucursales";
import TablaSucursales from "@/app/ui/sucursales/tablaSucursales";
import { PlusIcon } from "@heroicons/react/24/outline";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function SucursalesPage() {
  const router = useRouter();
  useValidateToken();
  useValidateAdmin();

  // States for total and current page
  //const [total, setTotal] = useState(0);
  //const [page, setPage] = useState(1);
  // Products per page
  //const sizeProducts: number = 5;

  const [respSucursales, setRespSucursales] = useState<Sucursal[]>([]);
  const [msAddSucu, setMsAddSuc] = useState(false);

  const handleMensAddSucur = () => {
    setMsAddSuc(true);
    setTimeout(() => setMsAddSuc(false), 4000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchSucursales = async () => {
      try {
        const data = await getSucursales(token);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const sucursales: Sucursal[] = data as Sucursal[];
        setRespSucursales(sucursales);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchSucursales();
  }, [router]);

  return (
    <div className="w-full">
      <Toaster position="top-center" richColors />
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Sucursales</h1>
      </div>
      <div className="mt-4 flex items-center gap-2 md:mt-8 text-end justify-end">
        <button
          onClick={handleMensAddSucur}
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="hidden md:block">Agregar</span>
          <PlusIcon className="h-5 md:ml-4" />
        </button>
      </div>
      <div>
        {msAddSucu && (
          <div className="bg-gray-300 rounded-lg mt-4 flex items-center gap-2 md:mt-8 text-center justify-center p-3">
            Si desea agregar una nueva sucursal consulte al servicio del sistema
          </div>
        )}
      </div>

      <div>
        <TablaSucursales
          sucursales={respSucursales}
          onDeleted={(deletedId) => {
            setRespSucursales((prev: Sucursal[]) =>
              prev.filter((p) => p.id !== deletedId)
            );
          }}
        />
      </div>
    </div>
  );
}
