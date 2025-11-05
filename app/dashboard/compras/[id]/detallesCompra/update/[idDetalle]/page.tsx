"use client";

import { useRouter, useParams } from "next/navigation";

import { useValidateToken } from "@/app/lib/useValidateToken";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { getDetalleCompraById } from "@/app/lib/api";
import { DetalleCompra } from "@/app/lib/definitions";
import DetalleFillData from "@/app/ui/detallesCompra/detalleCFillData";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function UpdateDetCPage() {
  const router = useRouter();
  useValidateToken();

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const params = useParams();
  const idCompra = Array.isArray(params.id)
    ? params.id[0]
    : params.id;
  const idDet = Array.isArray(params.idDetalle) ? params.idDetalle[0] : params.idDetalle;
  if (!idDet || !idCompra) {
    if (!idCompra) {
      toast.error("Compra no seleccionada");
      setTimeout(() => {
        router.push(`/dashboard/compras`);
      }, 2000);
    }
    toast.error("Detalle de compra no seleccionado");
    setTimeout(() => {
      router.push(`/dashboard/compras/${idCompra}/detallesCompra`);
    }, 2000);

    return;
  }
  const [detalle, setDetalle] = useState<DetalleCompra | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDetalle = async () => {
      try {
        const data = await getDetalleCompraById(token, idCompra, idDet);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor inicia sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        const detalleData: DetalleCompra = data as DetalleCompra;
        setDetalle(detalleData);
      } catch (error: any) {
        toast.error(error.message);
        await sleep(2000);
        router.push(`/dashboard/compras/${idCompra}/detallesCompra`);
      }
    };

    fetchDetalle();
  }, [router]);

  const returnDetalles = () => {
    router.push(`/dashboard/compras/${idCompra}/detallesCompra`);
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
      <DetalleFillData detalle={detalle} editable={true} idCompra={idCompra} idDet={idDet}/>
    </div>
  );
}
