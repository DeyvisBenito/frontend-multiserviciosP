"use client";
import { useRouter, useParams } from "next/navigation";

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import { getProveedor } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { Proveedor } from "@/app/lib/definitions";
import ProveedorFillData from "@/app/ui/proveedores/proveedorFillData";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ProveedorDetailsPage() {
  const router = useRouter();
  useValidateToken();
  useValidateAdmin();

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Proveedor no seleccionado");
    setTimeout(() => {
      router.push("/dashboard/proveedores");
    }, 2000);

    return;
  }

  const [proveedor, setProveedor] = useState<Proveedor | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProveedor = async () => {
      try {
        const data = await getProveedor(token, id);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor inicia sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        const proveedorData: Proveedor = data as Proveedor;
        setProveedor(proveedorData);
      } catch (error: any) {
        toast.error(error.message);
        await sleep(2000);
        router.push("/dashboard/proveedores");
      }
    };

    fetchProveedor();
  }, [router]);

  const returnProveedores = () => {
    router.push("/dashboard/proveedores");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />
      <button
        onClick={returnProveedores}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        <HiArrowLeft />
        Regresar
      </button>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Descripción
      </h1>
      <ProveedorFillData proveedor={proveedor} editable={false}/>
    </div>
  );
}
