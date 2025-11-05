"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

import { useValidateToken } from "@/app/lib/useValidateToken";
import { getCart, getCartDetails, updateCartDetails } from "@/app/lib/api";
import {
  Carrito,
  CarritoDetails,
  CarritoDetCreacion,
} from "@/app/lib/definitions";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ListaCaja({
  onSetHasConflict,
}: {
  onSetHasConflict: (hasConflict: boolean) => void;
}) {
  useValidateToken();
  const router = useRouter();

  const [actualizacionCantidades, setactualizacionCantidades] =
    useState<boolean>(true);
  const [carritoId, setCarritoId] = useState<number>();
  const [carritoDetails, setCarritoDetails] = useState<CarritoDetails[]>([]);

  const actualizarCantidad = async (id: number, cambio: number) => {
    const token = localStorage.getItem("token");
    const detalleAActu = carritoDetails.find((x) => x.id === id);
    const nuevaCantidad = detalleAActu!.cantidad + cambio;
    try {
      const carritoDetUpdate: CarritoDetCreacion = {
        InventarioId: detalleAActu!.inventarioId,
        Cantidad: nuevaCantidad,
      };
      const resp = await updateCartDetails(token, id, carritoDetUpdate);
      if (resp === 403) {
        toast.error("Sesion no iniciada", {
          description: "Por favor inicie sesion",
        });
        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
      }

      setactualizacionCantidades(!actualizacionCantidades);
    } catch (error: any) {
      toast.error("Advertencia: " + error.message);
    }
  };

  // llamada a la api
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchCarrito = async () => {
      try {
        const response = await getCart(token);

        if (response === 403) {
          toast.error("Sesion no iniciada", {
            description: "Por favor inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        const data = response as Carrito;
        setCarritoId(data.id);
      } catch (error) {
        toast.error(
          "Ha ocurrido un error al obtener los productos del carrito"
        );
        await sleep(2000);
        router.push("/auth/login");
      }
    };

    const fetchCarritoDetails = async () => {
      try {
        const resp = await getCartDetails(token);
        if (resp === 403) {
          toast.error("Sesion no iniciada", {
            description: "Por favor inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
        }

        const data: CarritoDetails[] = resp as CarritoDetails[];
        setCarritoDetails(data);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchCarrito();
    fetchCarritoDetails();
  }, [router, actualizacionCantidades]);

  // verificar si hay conflictos
  useEffect(() => {
    if (carritoDetails.length > 0) {
      const hayConflictos = carritoDetails.some((c) => c.hasConflict);
      onSetHasConflict(hayConflictos);
    }
  }, [carritoDetails]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {carritoDetails.map((carritoDet) => (
          <div
            key={carritoDet.id}
            className={`rounded-lg shadow p-4 flex flex-col ${
              carritoDet.hasConflict ? "bg-orange-200" : "bg-white"
            }`}
          >
            {carritoDet.hasConflict ? (
              <>
                <div className="mb-4 h-48 w-full overflow-hidden rounded-lg">
                  <img
                    src={carritoDet.inventario.urlFoto}
                    alt={carritoDet.inventario.nombre}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-3 text-lg font-semibold">
                  {carritoDet.inventario.nombre}
                </h3>
                <div className="flex items-center gap-2">
                  <span>Total: </span>
                  <span className="text-green-600 font-bold ">
                    Q {carritoDet.subTotal}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-red-500 text-sm">
                    ⚠️ Cantidad no disponible.
                  </span>
                  <span className="text-red-500 text-sm">
                    Unidades disponibles: {carritoDet.inventario.stock}
                  </span>
                </div>

                <div className="flex justify-center gap-3 mt-3">
                  <button
                    onClick={() => actualizarCantidad(carritoDet.id, -1)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    disabled={carritoDet.cantidad == 1}
                  >
                    -
                  </button>
                  <span className="min-w-[30px] text-center">
                    {carritoDet.cantidad}
                  </span>
                  <button
                    onClick={() => actualizarCantidad(carritoDet.id, 1)}
                    className={`px-3 py-1 bg-green-500 text-white rounded-lg ${
                      !carritoDet.hasConflict && "hover:bg-green-600"
                    }`}
                    disabled={
                      carritoDet.cantidad >= carritoDet.inventario.stock
                    }
                  >
                    +
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 h-48 w-full overflow-hidden rounded-lg">
                  <img
                    src={carritoDet.inventario.urlFoto}
                    alt={carritoDet.inventario.nombre}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-3 text-lg font-semibold">
                  {carritoDet.inventario.nombre}
                </h3>
                <div className="flex items-center gap-2">
                  <span>Total: </span>
                  <span className="text-green-600 font-bold ">
                    Q {carritoDet.subTotal}
                  </span>
                </div>
                <span>Disponibilidad: {carritoDet.inventario.stock}</span>

                <div className="flex justify-center gap-3 mt-auto">
                  <button
                    onClick={() => actualizarCantidad(carritoDet.id, -1)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    disabled={carritoDet.cantidad == 1}
                  >
                    -
                  </button>
                  <span className="min-w-[30px] text-center">
                    {carritoDet.cantidad}
                  </span>
                  <button
                    onClick={() => actualizarCantidad(carritoDet.id, 1)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    disabled= {carritoDet.cantidad == carritoDet.inventario.stock}
                  >
                    +
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
