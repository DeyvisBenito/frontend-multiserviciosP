"use client";

import { useRouter } from "next/navigation";

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import { getProveedores } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Proveedor, TipoProducto } from "@/app/lib/definitions";
import TablaTiposProducto from "@/app/ui/tiposProducto/tablaTiposProducto";
import { CreateProveedor } from "@/app/ui/proveedores/buttons";
import TablaProveedores from "@/app/ui/proveedores/tablaProveedores";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ProveedoresPage() {
  const router = useRouter();
  useValidateToken();
  useValidateAdmin();

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchProveedores = async () => {
      try {
        const data = await getProveedores(token);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const proveedoresData: Proveedor[] = data as Proveedor[];
        setProveedores(proveedoresData);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchProveedores();
  }, [router]);

  return (
    <div className="w-full">
      <Toaster position="top-center" richColors />
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Proveedores</h1>
      </div>
      <div className="mt-4 flex items-center gap-2 md:mt-8 text-end justify-end">
        <CreateProveedor />
      </div>
      <div>
        <TablaProveedores
          proveedores ={proveedores}
          onDeleted={(deletedId) => {
            setProveedores((prev: Proveedor[]) =>
              prev.filter((p) => p.id !== deletedId)
            );
          }}
        />
      </div>
    </div>
  );
}
