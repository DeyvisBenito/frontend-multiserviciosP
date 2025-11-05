"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useValidateToken } from "@/app/lib/useValidateToken";
import { postCompra } from "@/app/lib/api";
import { CompraCreacion, CompraCreacionResp } from "@/app/lib/definitions";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CompraCreatePage() {
  useValidateToken();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const buttonCreacion = document.getElementById(
      "submitButton"
    ) as HTMLButtonElement;
    const buttonCancel = document.getElementById(
      "cancelButton"
    ) as HTMLButtonElement;
    buttonCreacion.disabled = true;
    buttonCancel.disabled = true;

    const token = localStorage.getItem("token");
    const compraCreacion: CompraCreacion = {
      ProveedorNit: data.proveedor,
      Total: 0,
    };
    try {
      const data = await postCompra(token, compraCreacion);

      if (data === 403) {
        toast.error("No tienes autorización", {
          description: "Inicia sesión, por favor",
        });

        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Exito, continue el proceso de compra", {
        description: "Redirigiendo al apartado de detalles...",
      });

      await sleep(2000);
      const compra: CompraCreacionResp = data as CompraCreacionResp;
      router.push(`/dashboard/compras/${compra.id}/detallesCompra`);
    } catch (error: any) {
      toast.error(error.message);
      buttonCreacion.disabled = false;
      buttonCancel.disabled = false;
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
        {/* Nit */}
        <label htmlFor="proveedor" className="font-medium">
          Nit de proveedor:
        </label>
        <input
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
          type="text"
          id="proveedor"
          {...register("proveedor", { required: "El nit es requerido" })}
        />
        {errors.proveedor && (
          <span className="text-red-500 text-sm">
            {errors.proveedor.message as string}
          </span>
        )}

        {/* Botones */}
        <button
          id="submitButton"
          className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
        >
          Continuar
        </button>

        <Link
          id="cancelButton"
          href="/dashboard/compras"
          className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow-md transition-colors inline-block"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
