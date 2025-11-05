"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";

import { toast } from "sonner";
import { deleteCompra } from "@/app/lib/api";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function SeeCompra({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/compras/details/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}
export function ContinuoCompra({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/compras/${id}/detallesCompra`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <ArrowTrendingUpIcon className="w-5" />
    </Link>
  );
}

export function UpdateCompra({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/compras/update/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function CreateCompra() {
  return (
    <Link
      href="/dashboard/compras/create"
      className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Agregar Compra</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function DeleteCompra({
  id,
  onDeleted,
}: {
  id: number;
  onDeleted: (id: number) => void;
}) {
  const router = useRouter();

  const fetchDeleteCompra = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = await deleteCompra(token, id);
      if (data === 403) {
        toast.error("No tienes acceso a este recurso", {
          description: "Por favor, inicie sesion",
        });
        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Compra eliminada correctamente");
      await sleep(2000);
      // Mandando al padre la confirmacion que se elimino el producto
      onDeleted(id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = () => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded shadow-md flex flex-col gap-2">
        <p className="text-gray-800">
          ¿Seguro que quieres eliminar esta compra del registro?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              toast.dismiss();
            }}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              toast.dismiss();

              // Solicitando endpoint de delete
              fetchDeleteCompra();
            }}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Confirmar
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <button
        onClick={handleDelete}
        type="submit"
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </>
  );
}