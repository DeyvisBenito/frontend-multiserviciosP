"use client";

import { useRouter } from "next/navigation";

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import { getUsuarios } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { UsuarioGet } from "@/app/lib/definitions";
import { CreateTipoProducto } from "@/app/ui/tiposProducto/buttons";
import TablaUsuarios from "@/app/ui/usuarios/TablaUsuarios";
import { CreateUserVendedor } from "@/app/ui/usuarios/buttons";
import { estados } from "@/app/lib/utilities/estadosEnum";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function UsuariosPage() {
  const router = useRouter();
  useValidateToken();
  useValidateAdmin();

  // States for total and current page
  //const [total, setTotal] = useState(0);
  //const [page, setPage] = useState(1);
  // Products per page
  //const sizeProducts: number = 5;

  const [respUsuarios, setRespUsuarios] = useState<UsuarioGet[]>([]);
  
  const usersNoElim = respUsuarios.filter(
    (x) => x.estadoId !== estados.Eliminado
  );
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUsuarios = async () => {
      try {
        const data = await getUsuarios(token);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const usuariosData: UsuarioGet[] = data as UsuarioGet[];
        setRespUsuarios(usuariosData);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchUsuarios();
  }, [router]);

  return (
    <div className="w-full">
      <Toaster position="top-center" richColors />
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Usuarios</h1>
      </div>
      <div className="mt-4 flex items-center gap-2 md:mt-8 text-end justify-end">
        <CreateUserVendedor />
      </div>
      <div>
        <TablaUsuarios
          usuarios={usersNoElim}
          onDeleted={(deletedId) => {
            setRespUsuarios((prev: UsuarioGet[]) =>
              prev.filter((p) => p.id !== deletedId)
            );
          }}
        />
      </div>
    </div>
  );
}
