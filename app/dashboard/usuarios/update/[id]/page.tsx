"use client";

import { useRouter, useParams } from "next/navigation";

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { getSucursales, getTipoProductoById, getUsuarioById } from "@/app/lib/api";
import { Sucursal, TipoProducto, UsuarioGet } from "@/app/lib/definitions";
import TipoProductFillData from "@/app/ui/tiposProducto/tipoproductFillData";
import UsuarioFillData from "@/app/ui/usuarios/usuarioFillData";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function UpdateUsuario() {
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
    toast.error("Usuario no seleccionado");
    setTimeout(() => {
      router.push("/dashboard/usuarios");
    }, 2000);

    return;
  }

  const onSubmit = handleSubmit(async (data) => {});
  const [respUsuario, setRespUsuario] = useState<UsuarioGet | null>(null);
  const [sucursales, setSucursales] = useState<Sucursal[] | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const data = await getUsuarioById(token, id);
        const dataSucursales = await getSucursales(token);
        if (data === 403 || dataSucursales === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor inicia sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        const usuarioData: UsuarioGet = data as UsuarioGet;
        const sucursalesData: Sucursal[] = dataSucursales as Sucursal[];
        setRespUsuario(usuarioData);
        setSucursales(sucursalesData);
      } catch (error: any) {
        toast.error(error.message);
        await sleep(2000);
        router.push("/dashboard/usuarios");
      }
    };

    fetchData();
  }, [router]);

  const returnUsuarios = () => {
    router.push("/dashboard/usuarios");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />
      <button
        onClick={returnUsuarios}
        className="mb-2 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        <HiArrowLeft />
        Regresar
      </button>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Actualizar Usuario
      </h1>
      <UsuarioFillData usuario={respUsuario} editable={true} sucursales={sucursales}/>
    </div>
  );
}
