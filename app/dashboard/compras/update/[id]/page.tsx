"use client";

import { useRouter, useParams } from "next/navigation";

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { getCompra, getProveedor, getTipoProductoById } from "@/app/lib/api";
import { Compra, Proveedor } from "@/app/lib/definitions";
import TipoProductFillData from "@/app/ui/tiposProducto/tipoproductFillData";
import ProveedorFillData from "@/app/ui/proveedores/proveedorFillData";
import CompraFillData from "@/app/ui/compras/comprasFillData";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function UpdateCompraPage() {
  const router = useRouter();
  useValidateToken();


  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Compra no seleccionado");
    setTimeout(() => {
      router.push("/dashboard/compras");
    }, 2000);

    return;
  }
  const [compra, setCompra] = useState<Compra | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCompra = async () => {
      try {
        const data = await getCompra(token, id);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor inicia sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        const compraData: Compra = data as Compra;
        setCompra(compraData);
      } catch (error: any) {
        toast.error(error.message);
        await sleep(2000);
        router.push("/dashboard/compras");
      }
    };

    fetchCompra();
  }, [router]);

  const returnCompras = () => {
    router.push("/dashboard/compras");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />
      <button
        onClick={returnCompras}
        className="mb-2 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        <HiArrowLeft />
        Regresar
      </button>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Actualizar Proveedor de compra
      </h1>
      <CompraFillData compra={compra} editable={true} />
    </div>
  );
}
