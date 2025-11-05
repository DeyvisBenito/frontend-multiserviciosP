"use client";

import { useRouter, useParams } from "next/navigation";

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { getProveedor, getTipoProductoById } from "@/app/lib/api";
import { Proveedor, TipoProducto } from "@/app/lib/definitions";
import TipoProductFillData from "@/app/ui/tiposProducto/tipoproductFillData";
import ProveedorFillData from "@/app/ui/proveedores/proveedorFillData";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function UpdateProveedorPage() {
  const router = useRouter();
  useValidateToken();
  useValidateAdmin();

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        className="mb-2 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        <HiArrowLeft />
        Regresar
      </button>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Actualizar Proveedor
      </h1>
      <ProveedorFillData proveedor={proveedor} editable={true} />
    </div>
  );
}
