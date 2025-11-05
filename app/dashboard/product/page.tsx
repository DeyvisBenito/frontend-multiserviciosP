"use client";

import { useRouter } from "next/navigation";

import { CreateProduct, ShoppingCar } from "@/app/ui/products/buttons";
import { useValidateToken } from "@/app/lib/useValidateToken";
import { getInventario } from "@/app/lib/api";
import { Inventario, Product } from "@/app/lib/definitions";
import { useUserRole } from "@/app/lib/decodeToken";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import ListaProductos from "@/app/ui/products/table";
import { CreateVenta } from "@/app/ui/ventas/buttons";
import { CreateCompra } from "@/app/ui/compras/buttons";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ProductsPage() {
  const router = useRouter();
  useValidateToken();

  // States for total and current page
  // const [total, setTotal] = useState(0);
  //  const [page, setPage] = useState(1);
  // Products per page

  const [respProduct, setRespProduct] = useState<Inventario[]>([]);
  const role = useUserRole();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchProducts = async () => {
      try {
        const data = await getInventario(token);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const products: Inventario[] = data as Inventario[];
        setRespProduct(products);
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
        {role === "admin" ? (
          <h1 className={`text-2xl`}>Inventario de Productos</h1>
        ) : (
          <h1 className={`text-2xl`}>Productos</h1>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 md:mt-8 text-end justify-end">
        {role === "vendedor" ? <CreateVenta /> : null}
        {role === "vendedor" ? <CreateCompra /> : null}
      </div>
      <div>
        <ListaProductos
          inventarios={respProduct}
          onDeleted={(deletedId) => {
            setRespProduct((prev: Inventario[]) =>
              prev.filter((p) => p.id !== deletedId)
            );
          }}
        />
      </div>
    </div>
  );
}
