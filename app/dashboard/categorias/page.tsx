"use client";

import { useRouter } from "next/navigation";

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import { getCategorias } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Categoria, ProductsPaginated } from "@/app/lib/definitions";
import TablaCategorias from "@/app/ui/categorias/tablaCategorias";
import { CreateCategoria } from "@/app/ui/categorias/buttons";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CategoriasPage() {
  const router = useRouter();
  useValidateToken();
  useValidateAdmin();

  // States for total and current page
  //const [total, setTotal] = useState(0);
  //const [page, setPage] = useState(1);
  // Products per page
  //const sizeProducts: number = 5;

  const [respCategorias, setRespCategorias] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchProducts = async () => {
      try {
        const data = await getCategorias(token);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const categorias: Categoria[] = data as Categoria[];
        setRespCategorias(categorias);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchProducts();
  }, [router]);

  return (
    <div className="w-full">
      <Toaster position="top-center" richColors />
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Categorias</h1>
      </div>
      <div className="mt-4 flex items-center gap-2 md:mt-8 text-end justify-end">
        <CreateCategoria />
      </div>
      <div>
        <TablaCategorias
          categorias={respCategorias}
          onDeleted={(deletedId) => {
            setRespCategorias((prev: Categoria[]) =>
              prev.filter((p) => p.id !== deletedId)
            );
          }}
        />
      </div>
    </div>
  );
}
