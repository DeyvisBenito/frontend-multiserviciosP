"use client";

import { useRouter, useParams } from "next/navigation";

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";

import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { getClienteById } from "@/app/lib/api";
import { Cliente } from "@/app/lib/definitions";
import ClienteFillData from "@/app/ui/clientes/clienteFillData";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function UpdateCliente() {
  const router = useRouter();
  useValidateToken();
  useValidateAdmin();

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) {
    toast.error("Cliente no seleccionado");
    setTimeout(() => {
      router.push("/dashboard/usuarios");
    }, 2000);

    return;
  }

  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const data = await getClienteById(token, id);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor inicia sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        const clienteData: Cliente = data as Cliente;
        setCliente(clienteData);
      } catch (error: any) {
        toast.error(error.message);
        await sleep(2000);
        router.push("/dashboard/clientes");
      }
    };

    fetchData();
  }, [router]);

  const returnClientes = () => {
    router.push("/dashboard/clientes");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />
      <button
        onClick={returnClientes}
        className="mb-2 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        <HiArrowLeft />
        Regresar
      </button>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Actualizar Cliente
      </h1>
      <ClienteFillData cliente={cliente} editable={true}/>
    </div>
  );
}
