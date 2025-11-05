"use client";

import { useRouter, useParams } from "next/navigation";

import { useValidateToken } from "@/app/lib/useValidateToken";
import { getInventarioById } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { Inventario, Product } from "@/app/lib/definitions";
import ProductFillData from "@/app/ui/products/productFIllData";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DetailsPage() {
  const router = useRouter();
  useValidateToken();

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Producto no seleccionado");
    setTimeout(() => {
      router.push("/dashboard/product");
    }, 2000);

    return;
  }

  const [respProduct, setRespProduct] = useState<Inventario>();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProduct = async () => {
      try {
        const data = await getInventarioById(token, id);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor inicia sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        const inventario: Inventario = data as Inventario;
        setRespProduct(inventario);
      } catch (error: any) {
        toast.error(error.message);
        await sleep(2000);
        router.push("/dashboard/product");
      }
    };

    fetchProduct();
  }, [router]);

  const returnProducts = () => {
    router.push("/dashboard/product");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />
      <button
        onClick={returnProducts}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        <HiArrowLeft />
        Regresar
      </button>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Descripcion de Producto
      </h1>
      <ProductFillData inventario={respProduct} editable={false}/>
    </div>
  );
}
