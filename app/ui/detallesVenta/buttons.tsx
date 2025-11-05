"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

import { toast } from "sonner";
import { cancelVenta, deleteDetalleVenta, procesarVenta } from "@/app/lib/api";
import { DetalleVenta } from "@/app/lib/definitions";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function UpdateDetV({
  idVenta,
  idDet,
}: {
  idVenta: string;
  idDet: number;
}) {
  return (
    <Link
      href={`/dashboard/ventas/${idVenta}/detallesVenta/update/${idDet}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteDetV({
  idVenta,
  idDet,
  onDeleted,
}: {
  idVenta: string;
  idDet: number;
  onDeleted: (id: number) => void;
}) {
  const router = useRouter();

  const fetchDeleteDetVent = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = await deleteDetalleVenta(token, idVenta, idDet);
      if (data === 403) {
        toast.error("No tienes acceso a este recurso", {
          description: "Por favor, inicie sesion",
        });
        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Detalle de venta eliminado correctamente");
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
          ¿Seguro que desea eliminar este detalle de la venta?
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
              fetchDeleteDetVent();
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

export function CancelarVenta({ idVenta }: { idVenta: string }) {
  const router = useRouter();

  const fetchCancelVenta = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = await cancelVenta(token, idVenta);
      if (data === 403) {
        toast.error("No tienes acceso a este recurso", {
          description: "Por favor, inicie sesion",
        });
        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Venta Cancelada", {
        description: "Volviendo al dashbord...",
      });
      await sleep(2000);
      router.push("/dashboard/ventas");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = () => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2 border-orange-300 border-2">
        <p className="text-gray-800">
          ¿Seguro que desea Cancelar esta venta? Se eliminarán los detalles ya
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
              fetchCancelVenta();
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
        Cancelar Venta
      </button>
    </>
  );
}

/* export function ProcesarVenta({
  idVenta,
  detalles,
}: {
  idVenta: string;
  detalles: DetalleVenta[];
}) {
  const router = useRouter();

  const fetchProcesarVenta = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = await procesarVenta(token, idVenta);
      if (data === 403) {
        toast.error("No tienes acceso a este recurso", {
          description: "Por favor, inicie sesion",
        });
        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Venta procesada correctamente", {
        description: "Volviendo al dashbord...",
      });
      await sleep(2000);
      router.push("/dashboard/ventas");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleProcess = () => {
    if (detalles.length <= 0) {
      toast.error("La Venta no cuenta con detalles a agregar");
      return;
    }
    toast.custom((t) => (
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2 border-green-300 border-2">
        <p className="text-gray-800">
          ¿Seguro que desea procesar la venta? Despues no podrá volver atras ⚠️
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
              fetchProcesarVenta();
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
        onClick={handleProcess}
        type="submit"
        className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
      >
        Procesar Venta
      </button>
    </>
  );
} */
