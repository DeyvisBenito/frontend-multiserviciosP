"use client";
import { useRouter, useParams } from "next/navigation";

import { useValidateToken } from "@/app/lib/useValidateToken";
import { getCompra, getDetallesCompra, getProveedor } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { Compra, DetalleCompra, Proveedor } from "@/app/lib/definitions";
import ProveedorFillData from "@/app/ui/proveedores/proveedorFillData";
import CompraFillData from "@/app/ui/compras/comprasFillData";
import TablaDetallesCompra from "@/app/ui/detallesCompra/tablaDetallesCompra";
import { useUserRole } from "@/app/lib/decodeToken";
import { estados } from "@/app/lib/utilities/estadosEnum";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ComprasDetailsPage() {
  const router = useRouter();
  useValidateToken();
  var rol = useUserRole();

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Compra no seleccionada");
    setTimeout(() => {
      router.push("/dashboard/compras");
    }, 2000);

    return;
  }

  const [compra, setCompra] = useState<Compra | null>(null);
  const [detC, setDetC] = useState<DetalleCompra[] | null>(null);
  const [isCompraValida, setIsCompraValida] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCompra = async () => {
      try {
        const data = await getCompra(token, id);
        const dataDetC = await getDetallesCompra(token, id);

        if (data === 403 || dataDetC === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor inicia sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        const compraData: Compra = data as Compra;
        const detCData: DetalleCompra[] = dataDetC as DetalleCompra[];
        setCompra(compraData);
        setDetC(detCData);
      } catch (error: any) {
        toast.error(error.message);
        setIsCompraValida(false);
        await sleep(2000);
        router.push("/dashboard/compras");
      }
    };

    fetchCompra();
  }, [router]);

  const returnCompras = () => {
    router.push("/dashboard/compras");
  };

  useEffect(() => {
    if (compra && rol !== "admin") {
      if (compra.estadoId === estados.Eliminado) {
        setIsCompraValida(false);
        toast.error("La compra buscada no existe");
        sleep(1000).then(() => router.push("/dashboard/compras"));
      }
    }
  }, [compra, rol, router]);

  if (!isCompraValida) {
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
          onClick={returnCompras}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          <HiArrowLeft />
          Regresar
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          Descripción de Compra
        </h1>
        <CompraFillData compra={compra} editable={false} />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700 mt-6">
        Detalles de Compra
      </h2>
      {detC && (
        <TablaDetallesCompra
          mostrarBtns={false}
          detalles={detC}
          idCompra={id}
          onDeleted={() => {}}
        />
      )}
    </>
  );
}
