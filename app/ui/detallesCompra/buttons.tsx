"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

import { toast } from "sonner";
import { cancelCompra, deleteDetalle, procesarCompra } from "@/app/lib/api";
import { DetalleCompra } from "@/app/lib/definitions";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function UpdateDetC({
  idCompra,
  idDet,
}: {
  idCompra: string;
  idDet: number;
}) {
  return (
    <Link
      href={`/dashboard/compras/${idCompra}/detallesCompra/update/${idDet}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteDetC({
  idCompra,
  idDet,
  onDeleted,
}: {
  idCompra: string;
  idDet: number;
  onDeleted: (id: number) => void;
}) {
  const router = useRouter();

  const fetchDeleteDetComp = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = await deleteDetalle(token, idCompra, idDet);
      if (data === 403) {
        toast.error("No tienes acceso a este recurso", {
          description: "Por favor, inicie sesion",
        });
        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Detalle de compra eliminado correctamente");
      await sleep(2000);
      // Mandando al padre la confirmacion que se elimino el producto
      onDeleted(idDet);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = () => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded shadow-md flex flex-col gap-2">
        <p className="text-gray-800">
          ¿Seguro que desea eliminar este detalle de la compra?
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
              fetchDeleteDetComp();
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

export function CancelarCompra({ idCompra }: { idCompra: string }) {
  const router = useRouter();

  const fetchCancelCompra = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = await cancelCompra(token, idCompra);
      if (data === 403) {
        toast.error("No tienes acceso a este recurso", {
          description: "Por favor, inicie sesion",
        });
        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Compra Cancelada", {
        description: "Volviendo al dashbord...",
      });
      await sleep(2000);
      router.push("/dashboard/compras");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = () => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2 border-orange-300 border-2">
        <p className="text-gray-800">
          ¿Seguro que desea Cancelar esta compra? Se eliminarán los detalles ya
          seleccionados ⚠️
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

              // Solicitando endpoint de cancelar compra
              fetchCancelCompra();
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
        className="mt-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
      >
        Cancelar Compra
      </button>
    </>
  );
}

export function ProcesarCompra({
  idCompra,
  detalles,
}: {
  idCompra: string;
  detalles: DetalleCompra[];
}) {
  const router = useRouter();

  const fetchProcesarCompra = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = await procesarCompra(token, idCompra);
      if (data === 403) {
        toast.error("No tienes acceso a este recurso", {
          description: "Por favor, inicie sesion",
        });
        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Compra procesada correctamente", {
        description: "Volviendo al dashbord...",
      });
      await sleep(2000);
      router.push("/dashboard/compras");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = () => {
    if (detalles.length <= 0) {
      toast.error("La compra no cuenta con detalles a agregar");
      return;
    }
    toast.custom((t) => (
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2 border-green-300 border-2">
        <p className="text-gray-800">
          ¿Seguro que desea procesar la compra? Despues no podrá volver atras ⚠️
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

              // Solicitando endpoint de procesar compra
              fetchProcesarCompra();
            }}
            className="px-3 py-1 bg-green-500 text-white rounded"
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
        className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
      >
        Procesar Compra
      </button>
    </>
  );
}
