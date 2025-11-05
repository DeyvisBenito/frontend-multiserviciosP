"use client";

import { useRouter, useParams } from "next/navigation";

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { getCategoriaById } from "@/app/lib/api";
import CategoriaFillData from "@/app/ui/categorias/categoriaFillData";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function UpdateCategoriasPage() {
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
    toast.error("Categoria no seleccionada");
    setTimeout(() => {
      router.push("/dashboard/categorias");
    }, 2000);

    return;
  }

  const onSubmit = handleSubmit(async (data) => {});
  const [respCategoria, setRespCategoria] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchGetCategoria = async () => {
      try {
        const data = await getCategoriaById(token, id);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor inicia sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        setRespCategoria(data);
      } catch (error: any) {
        toast.error(error.message);
        await sleep(2000);
        router.push("/dashboard/categorias");
      }
    };

    fetchGetCategoria();
  }, [router]);

  const returnCategorias = () => {
    router.push("/dashboard/categorias");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />
      <button
        onClick={returnCategorias}
        className="mb-2 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        <HiArrowLeft />
        Regresar
      </button>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Actualizar Categoria
      </h1>
      <CategoriaFillData categoria={respCategoria} editable={true} />
    </div>
  );
}
