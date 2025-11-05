"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

import { toast } from "sonner";
import { deleteCliente, deleteUsuario } from "@/app/lib/api";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function SeeCliente({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/clientes/details/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}

export function CreateCliente() {
  return (
    <Link
      href="/dashboard/clientes/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span>Agregar Cliente</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCliente({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/clientes/update/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteCliente({
  id,
  onDeleted,
}: {
  id: number;
  onDeleted: (id: number) => void;
}) {
  const router = useRouter();

  const fetchDeleteCliente = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = await deleteCliente(token, id);
      if (data === 403) {
        toast.error("No tienes acceso a este recurso", {
          description: "Por favor, inicie sesion",
        });
        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Cliente eliminado correctamente");
      await sleep(2000);
      // Mandando al padre la confirmacion que se elimino el usuario
      onDeleted(id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = () => {
    toast.custom((t) => (
      <div className="bg-white p-4 border border-orange-400 rounded shadow-md flex flex-col gap-2">
        <p className="text-gray-800">
          ¿Seguro que desea eliminar este Cliente?
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
              fetchDeleteCliente();
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
