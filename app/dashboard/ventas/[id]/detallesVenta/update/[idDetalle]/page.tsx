"use client";

import { useRouter, useParams } from "next/navigation";

import { useValidateToken } from "@/app/lib/useValidateToken";

import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { getDetalleVentaById } from "@/app/lib/api";
import { DetalleVenta } from "@/app/lib/definitions";
import DetalleVFillData from "@/app/ui/detallesVenta/detalleVFillData";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function UpdateDetVPage() {
  const router = useRouter();
  useValidateToken();

  const params = useParams();
  const idVenta = Array.isArray(params.id)
    ? params.id[0]
    : params.id;
  const idDet = Array.isArray(params.idDetalle) ? params.idDetalle[0] : params.idDetalle;
  if (!idDet || !idVenta) {
    if (!idVenta) {
      toast.error("Venta no seleccionada");
      setTimeout(() => {
        router.push(`/dashboard/ventas`);
      }, 2000);
    }
    toast.error("Detalle de venta no seleccionado");
    setTimeout(() => {
      router.push(`/dashboard/ventas/${idVenta}/detallesVenta`);
    }, 2000);

    return;
  }
  const [detalle, setDetalle] = useState<DetalleVenta | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDetalle = async () => {
      try {
        const data = await getDetalleVentaById(token, idVenta, idDet);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor inicia sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        const detalleData: DetalleVenta = data as DetalleVenta;
        setDetalle(detalleData);
      } catch (error: any) {
        toast.error(error.message);
        await sleep(2000);
        router.push(`/dashboard/ventas/${idVenta}/detallesVenta`);
      }
    };

    fetchDetalle();
  }, [router]);

  const returnDetalles = () => {
    router.push(`/dashboard/ventas/${idVenta}/detallesVenta`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />
      <button
        onClick={returnDetalles}
        className="mb-2 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        <HiArrowLeft />
        Regresar
      </button>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Actualizar Detalle
      </h1>
      <DetalleVFillData detalle={detalle} editable={true} idVenta={idVenta} idDet={idDet}/>
    </div>
  );
}
