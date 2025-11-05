"use client";
import { useRouter, useParams } from "next/navigation";

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import { getSucursalById } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import SucursalFillData from "@/app/ui/sucursales/sucursalFillData";
import { Sucursal } from "@/app/lib/definitions";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DetailSucursalPage() {
  const router = useRouter();
  useValidateToken();
  useValidateAdmin();

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Sucursal no seleccionada");
    setTimeout(() => {
      router.push("/dashboard/sucursales");
    }, 2000);

    return;
  }

  const [respSucursal, setRespSucursal] = useState<Sucursal>();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchSucursal = async () => {
      try {
        const data = await getSucursalById(token, id);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor inicia sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        const sucursal: Sucursal = data as Sucursal;
        setRespSucursal(sucursal);
      } catch (error: any) {
        toast.error(error.message);
        await sleep(2000);
        router.push("/dashboard/sucursales");
      }
    };

    fetchSucursal();
  }, [router]);

  const returnSucursales = () => {
    router.push("/dashboard/sucursales");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />
      <button
        onClick={returnSucursales}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        <HiArrowLeft />
        Regresar
      </button>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Descripción
      </h1>
      <SucursalFillData sucursal={respSucursal} editable={false}/>
    </div>
  );
}
