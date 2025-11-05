"use client";
import { useRouter, useParams } from "next/navigation";

import { useValidateToken } from "@/app/lib/useValidateToken";
import { getCompra, getDetallesCompra, getDetallesVenta, getVenta } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { Compra, DetalleCompra, DetalleVenta, Venta } from "@/app/lib/definitions";
import CompraFillData from "@/app/ui/compras/comprasFillData";
import TablaDetallesCompra from "@/app/ui/detallesCompra/tablaDetallesCompra";
import { useUserRole } from "@/app/lib/decodeToken";
import { estados } from "@/app/lib/utilities/estadosEnum";
import VentaFillData from "@/app/ui/ventas/ventasFillData";
import TablaDetallesVenta from "@/app/ui/detallesVenta/tablaDetallesVenta";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function VentaDetailsPage() {
  const router = useRouter();
  useValidateToken();
  var rol = useUserRole();

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Venta no seleccionada");
    setTimeout(() => {
      router.push("/dashboard/ventas");
    }, 2000);

    return;
  }

  const [venta, setVenta] = useState<Venta | null>(null);
  const [detV, setDetV] = useState<DetalleVenta[] | null>(null);
  const [isVentaValida, setIsVentaValida] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchVenta = async () => {
      try {
        const data = await getVenta(token, id);
        const dataDetV = await getDetallesVenta(token, id);

        if (data === 403 || dataDetV === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor inicia sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        const VentaData: Venta = data as Venta;
        const detVData: DetalleVenta[] = dataDetV as DetalleVenta[];
        setVenta(VentaData);
        setDetV(detVData);
      } catch (error: any) {
        toast.error(error.message);
        setIsVentaValida(false);
        await sleep(2000);
        router.push("/dashboard/ventas");
      }
    };

    fetchVenta();
  }, [router]);

  const returnVentas = () => {
    router.push("/dashboard/ventas");
  };

  useEffect(() => {
    if (venta && rol !== "admin") {
      if (venta.estadoId === estados.Eliminado) {
        setIsVentaValida(false);
        toast.error("La venta buscada no existe");
        sleep(1000).then(() => router.push("/dashboard/ventas"));
      }
    }
  }, [venta, rol, router]);

  if (!isVentaValida) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Toaster position="top-center" richColors />
        <p className="text-lg text-gray-700">Redirigiendo...</p>
      </div>
    );
  }
  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
        <Toaster position="top-center" richColors />
        <button
          onClick={returnVentas}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          <HiArrowLeft />
          Regresar
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          Descripción de Venta
        </h1>
        <VentaFillData venta={venta} editable={false} />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700 mt-6">
        Detalles de Venta
      </h2>
      {detV && (
        <TablaDetallesVenta
          mostrarBtns={false}
          detalles={detV}
          idVenta={id}
          onDeleted={() => {}}
        />
      )}
    </>
  );
}
