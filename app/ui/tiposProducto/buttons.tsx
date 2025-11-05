"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

import { toast } from "sonner";
import { deleteInventario, deleteTipoProducto } from "@/app/lib/api";
import ConfirmarCompra from "../caja/confirmarCompra";
import { useState } from "react";
import ModalAddProductoCart from "../caja/modalAddproductoCart";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function CreateTipoProducto() {
  return (
    <Link
      href="/dashboard/tiposProducto/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Agregar</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateTipoProducto({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/tiposProducto/update/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteTipoProducto({
  id,
  onDeleted,
}: {
  id: number;
  onDeleted: (id: number) => void;
}) {
  const router = useRouter();

  const fetchDeleteTipProd = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = await deleteTipoProducto(token, id);
      if (data === 403) {
        toast.error("No tienes acceso a este recurso", {
          description: "Por favor, inicie sesion",
        });
        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Producto eliminado correctamente");
      await sleep(2000);
      // Mandando al padre la confirmacion que se elimino el producto
      onDeleted(id);
    } catch (error: any) {
      toast.error(error.mensajeError);
    }
  };

  const handleDelete = () => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded shadow-md flex flex-col gap-2">
        <p className="text-gray-800">
          ¿Seguro que desea eliminar este tipo de producto?
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
              fetchDeleteTipProd();
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

export function ShoppingCar() {
  return (
    <Link
      href="/dashboard/caja"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Caja</span>
      <ShoppingCartIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function AddProductoToCart({
  id,
  nombre,
  precio,
  stock
}: {
  id: number;
  nombre: string;
  precio: number;
  stock: number
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const total = 10; // TODO: Hacer calculo de total
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <div className="flex items-center">
          <ShoppingCartIcon className="w-5" />
          <PlusIcon className="h-4 w-4" />
        </div>
      </button>

      <ModalAddProductoCart
        id={id}
        nombre={nombre}
        precio={precio}
        stock={stock}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export function ButtonConfirmarCompra({
  hasConflict,
}: {
  hasConflict: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 items-center rounded-lg bg-green-500 px-4 text-sm font-medium text-white transition-colors hover:bg-green-200"
      >
        <span className="hidden md:block">Confirmar compra</span>
        <ShoppingBagIcon className="h-5 md:ml-4" />
      </button>

      <ConfirmarCompra
        isOpen={isOpen}
        hasConflict={hasConflict}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
