"use client";

import { useRouter, useParams } from "next/navigation";

import { useValidateToken } from "@/app/lib/useValidateToken";

import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { getCompra, getVenta } from "@/app/lib/api";
import { Compra, Venta } from "@/app/lib/definitions";
import CompraFillData from "@/app/ui/compras/comprasFillData";
import VentaFillData from "@/app/ui/ventas/ventasFillData";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function UpdateVentaPage() {
  const router = useRouter();
  useValidateToken();


  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Venta no seleccionado");
    setTimeout(() => {
      router.push("/dashboard/ventas");
    }, 2000);

    return;
  }
  const [venta, setVenta] = useState<Venta | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchVenta = async () => {
      try {
        const data = await getVenta(token, id);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor inicia sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        const ventaData: Venta = data as Venta;
        setVenta(ventaData);
      } catch (error: any) {
        toast.error(error.message);
        await sleep(2000);
        router.push("/dashboard/ventas");
      }
    };

    fetchVenta();
  }, [router]);

  const returnVentas = () => {
    router.push("/dashboard/ventas");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />
      <button
        onClick={returnVentas}
        className="mb-2 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        <HiArrowLeft />
        Regresar
      </button>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Actualizar Cliente de Venta
      </h1>
      <VentaFillData venta={venta} editable={true} />
    </div>
  );
}
