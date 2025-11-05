"use client";

import { postCartDetail } from "@/app/lib/api";
import { CarritoDetCreacion } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function ModalAddProductoCart({
  id,
  nombre,
  precio,
  stock,
  isOpen,
  onClose,
}: {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [total, setTotal] = useState<number>(precio);
  const router = useRouter();

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const calcularTotal = (cantidad: number) => {
    const tot = precio * cantidad;
    if (Number.isNaN(tot)) {
      setTotal(0);
      return;
    }
    setTotal(tot);
  };

  const onSubmit = handleSubmit(async (data) => {
    const buttonSub = document.getElementById("btnSubmit") as HTMLButtonElement;
    const buttonCan = document.getElementById("btnCan") as HTMLButtonElement;
    buttonSub.disabled = true;
    buttonCan.disabled = true;

    const token = localStorage.getItem("token");
    const postCarritoDet: CarritoDetCreacion = {
      InventarioId: id,
      Cantidad: data.cantidad,
    };
    try {
      const data = await postCartDetail(token, postCarritoDet);
      if (data === 403) {
        toast.error("No tienes autorización", {
          description: "Inicia sesión, por favor",
        });

        await sleep(2000);
        localStorage.removeItem("token");
        buttonSub.disabled = false;
        buttonCan.disabled = false;
        router.push("/auth/login");
        return;
      }

      toast.success("Producto agregado a la caja correctamente");

      await sleep(2000);
      buttonSub.disabled = false;
      buttonCan.disabled = false;
      onClose();
    } catch (error: any) {
      toast.error(error.message);
      buttonSub.disabled = false;
      buttonCan.disabled = false;
    }
  });

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleOverlayClick}
      >
        <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow ">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
            <div>
              <h3 className="text-lg font-semibold">
                Agregar producto al carrito
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-500 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
          <div>
            <p className="text-md font-semibold mb-5">Producto: {nombre}</p>
            <p className="text-md font-semibold mb-5">Precio: Q. {precio}</p>

            <form onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="cantidad"
                  className="text-md font-semibold mb-5 mr-2"
                >
                  Cantidad:
                </label>
                <input
                  type="number"
                  id="cantidad"
                  min={1}
                  max={stock}
                  step={1}
                  defaultValue={1}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 mb-5 w-24"
                  {...register("cantidad", {
                    required: "La cantidad es requerida",
                    valueAsNumber: true,
                    min: { value: 1, message: "La cantidad mínima es 1" },
                    max: {
                      value: stock,
                      message: `La cantidad máxima es ${stock}`,
                    },
                    onChange: (e) => {
                      const value = parseInt(e.target.value);
                      if (value > stock) {
                        e.target.value = stock;
                        calcularTotal(stock);
                        return;
                      }
                      if (value < 1) {
                        e.target.value = "1";
                        calcularTotal(1);
                        return;
                      }
                      calcularTotal(value);
                    },
                  })}
                />

                {errors.cantidad && (
                  <span className="text-red-500 text-sm">
                    {errors.cantidad.message as string}
                  </span>
                )}

                <p className="text-md font-semibold mb-5">Total: Q. {total}</p>
              </div>
              <div className="flex grid-cols-2 space-x-5">
                <button
                  id="btnSubmit"
                  type="submit"
                  className="w-full bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800"
                >
                  Confirmar
                </button>
                <button
                  id="btnCan"
                  onClick={onClose}
                  type="submit"
                  className="w-full bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
          <hr />
        </div>
      </div>
    </>
  );
}
