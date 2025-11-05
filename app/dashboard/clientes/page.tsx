"use client";

import { useRouter } from "next/navigation";

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import { getClientes, getUsuarios } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Cliente, UsuarioGet } from "@/app/lib/definitions";
import TablaUsuarios from "@/app/ui/usuarios/TablaUsuarios";
import { CreateUserVendedor } from "@/app/ui/usuarios/buttons";
import { estados } from "@/app/lib/utilities/estadosEnum";
import TablaClientes from "@/app/ui/clientes/tablaClientes";
import { CreateCliente } from "@/app/ui/clientes/buttons";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ClientesPage() {
  const router = useRouter();
  useValidateToken();
  useValidateAdmin();

  // States for total and current page
  //const [total, setTotal] = useState(0);
  //const [page, setPage] = useState(1);
  // Products per page
  //const sizeProducts: number = 5;

  const [respClientes, setRespClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchClientes = async () => {
      try {
        const data = await getClientes(token);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const clientesData: Cliente[] = data as Cliente[];
        setRespClientes(clientesData);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchClientes();
  }, [router]);

  return (
    <div className="w-full">
      <Toaster position="top-center" richColors />
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Clientes</h1>
      </div>
      <div className="mt-4 flex items-center gap-2 md:mt-8 text-end justify-end">
        <CreateCliente />
      </div>
      <div>
        <TablaClientes
          clientes={respClientes}
          onDeleted={(deletedId) => {
            setRespClientes((prev: Cliente[]) =>
              prev.filter((p) => p.id !== deletedId)
            );
          }}
        />
      </div>
    </div>
  );
}
