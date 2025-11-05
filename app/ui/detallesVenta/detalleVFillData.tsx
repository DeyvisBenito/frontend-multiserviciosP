"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DetalleVenta,
  DetalleVentaCreacion,
  TipoProducto,
  UnidadMedida,
} from "@/app/lib/definitions";
import {
  detalleExistInVentaUpd,
  getDescuento,
  getDetallesVenta,
  getTipoProductoById,
  getUnidadesMedida,
  PutDetalleVenta,
} from "@/app/lib/api";
import { estados } from "@/app/lib/utilities/estadosEnum";
import {
  EquivalenciasConteoUnidades,
  EquivalenciasMasaLibras,
  UnidadMedidaEnum,
} from "@/app/lib/utilities/unidadMedidaEnum";
import { useValidateToken } from "@/app/lib/useValidateToken";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DetalleVEditar({
  detalle,
  editable,
  idVenta,
  idDet,
}: {
  detalle: DetalleVenta | null;
  editable: boolean;
  idVenta: string;
  idDet: string;
}) {
  useValidateToken();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const [tipoProducto, setTipoProducto] = useState<TipoProducto>();
  const [unidadMedida, setUnidadMedida] = useState<UnidadMedida[]>([]);
  const [descuento, setDescuento] = useState<number>(detalle?.descuento ?? 0);
  const [totalUnidadesMin, setTotalUnidadesMin] = useState<number>(0);
  const [unidadesDisponibles, setUnidadesDisponibles] = useState<number>(0);

  const unidadSeleccionada = watch("unidadMedida");
  const cantitadSeleccionada = watch("cantidad");
  const unidadesCaja = watch("unidadesCaja");

  const medidaSeleccionada = unidadMedida?.find(
    (u) => u.id === parseInt(unidadSeleccionada)
  )?.medida;

  const unidadesMedidasTipo = unidadMedida.filter(
    (u) => u.tipoMedidaId === tipoProducto?.tipoMedidaId
  );

  useEffect(() => {
    if (!detalle) return;
    const token = localStorage.getItem("token");
    setUnidadesDisponibles(detalle.inventario!.stock);
    const obtenerDetalles = async () => {
      try {
        const data = await getDetallesVenta(token, idVenta);

        if (data === 403) {
          toast.error("No tienes autorización", {
            description: "Inicia sesión, por favor",
          });

          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const detalles: DetalleVenta[] = data as DetalleVenta[];
        let disponibles = detalle.inventario!.stock;

        detalles.forEach((det) => {
          if (det.id === Number(idDet)) return; // ignoramos el detalle que estamos editando
          if (det.inventarioId === detalle.inventario.id) {
            switch (det.unidadMedidaId) {
              case UnidadMedidaEnum.libra:
                disponibles -= det.cantidad * EquivalenciasMasaLibras.libra;
                break;
              case UnidadMedidaEnum.arroba:
                disponibles -= det.cantidad * EquivalenciasMasaLibras.arroba;
                break;
              case UnidadMedidaEnum.quintal:
                disponibles -= det.cantidad * EquivalenciasMasaLibras.quintal;
                break;
              case UnidadMedidaEnum.unidad:
                disponibles -=
                  det.cantidad * EquivalenciasConteoUnidades.unidad;
                break;
              case UnidadMedidaEnum.docena:
                disponibles -=
                  det.cantidad * EquivalenciasConteoUnidades.docena;
                break;
              case UnidadMedidaEnum.caja:
                disponibles -= det.cantidad * det.unidadesPorCaja;
                break;
            }
          }
        });

        setUnidadesDisponibles(disponibles); // actualizamos el estado solo una vez
      } catch (error: any) {
        toast.warning(error.message);
      }
    };
    obtenerDetalles();
  }, [detalle]);

  useEffect(() => {
    if (Number(unidadSeleccionada) === UnidadMedidaEnum.libra) {
      setTotalUnidadesMin(cantitadSeleccionada * EquivalenciasMasaLibras.libra);
    } else if (Number(unidadSeleccionada) === UnidadMedidaEnum.arroba) {
      setTotalUnidadesMin(
        cantitadSeleccionada * EquivalenciasMasaLibras.arroba
      );
    } else if (Number(unidadSeleccionada) === UnidadMedidaEnum.quintal) {
      setTotalUnidadesMin(
        cantitadSeleccionada * EquivalenciasMasaLibras.quintal
      );
    } else if (Number(unidadSeleccionada) === UnidadMedidaEnum.unidad) {
      setTotalUnidadesMin(
        cantitadSeleccionada * EquivalenciasConteoUnidades.unidad
      );
    } else if (Number(unidadSeleccionada) === UnidadMedidaEnum.docena) {
      setTotalUnidadesMin(
        cantitadSeleccionada * EquivalenciasConteoUnidades.docena
      );
    } else if (Number(unidadSeleccionada) === UnidadMedidaEnum.caja) {
      setTotalUnidadesMin(cantitadSeleccionada * unidadesCaja);
    }
  }, [cantitadSeleccionada, unidadSeleccionada, unidadesCaja]);

  useEffect(() => {
    if (!detalle || !detalle.inventario) return;
    if (detalle!.inventario !== null) {
      let precioUnitario = detalle!.inventario.precioVenta;
      if (unidadSeleccionada) {
        if (unidadSeleccionada === UnidadMedidaEnum.libra) {
          precioUnitario = detalle!.inventario.precioVenta;
        } else if (unidadSeleccionada == UnidadMedidaEnum.arroba) {
          precioUnitario =
            detalle!.inventario.precioVenta * EquivalenciasMasaLibras.arroba;
        } else if (unidadSeleccionada == UnidadMedidaEnum.quintal) {
          precioUnitario =
            detalle!.inventario.precioVenta * EquivalenciasMasaLibras.quintal;
        } else if (unidadSeleccionada == UnidadMedidaEnum.unidad) {
          precioUnitario = detalle!.inventario.precioVenta;
        } else if (unidadSeleccionada == UnidadMedidaEnum.docena) {
          precioUnitario =
            detalle!.inventario.precioVenta *
            EquivalenciasConteoUnidades.docena;
        } else if (unidadSeleccionada == UnidadMedidaEnum.caja) {
          precioUnitario =
            detalle.inventario.precioVenta *
            Number(unidadesCaja || detalle.unidadesPorCaja || 0);
        }
      }
      precioUnitario = Math.ceil(precioUnitario * 100) / 100;
      setValue("precioVentaUnMedida", precioUnitario);
    }
  }, [descuento, unidadesCaja, unidadSeleccionada, cantitadSeleccionada]);

  useEffect(() => {
    if (!detalle) return;
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const dataTipoProducto = await getTipoProductoById(
          token,
          detalle.inventario.tipoProductoId
        );
        const dataUnidades = await getUnidadesMedida(token);

        if (dataTipoProducto === 403 || dataUnidades === 403) {
          toast.error("No tienes autorización", {
            description: "Inicia sesión, por favor",
          });
          await sleep(1500);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }

        setTipoProducto(dataTipoProducto as TipoProducto);
        setUnidadMedida(dataUnidades as UnidadMedida[]);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    fetchData();
  }, [detalle]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (unidadSeleccionada) {
      const getDes = async () => {
        var data = await getDescuento(
          token,
          detalle!.inventario!.unidadMedidaId,
          Number(unidadSeleccionada)
        );
        if (data === 403) {
          toast.error("No tienes autorización", {
            description: "Inicia sesión, por favor",
          });

          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const descuentoData: number = data as number;
        setDescuento(descuentoData);
      };
      getDes();
    }
  }, [unidadSeleccionada]);

  useEffect(() => {
    if (!detalle || !detalle.inventario) return;
    if (detalle!.inventario !== null) {
      const precioConDescuento =
        Math.ceil(
          (detalle!.inventario.precioVenta -
            detalle!.inventario.precioVenta * descuento) *
            100
        ) / 100;

      const nuevoPrecio =
        Math.ceil(precioConDescuento * totalUnidadesMin * 100) / 100;

      setValue("totalVenta", nuevoPrecio);
    }
  }, [descuento, totalUnidadesMin, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const token = localStorage.getItem("token");
    const button = document.getElementById(
      "btnActualizar"
    ) as HTMLButtonElement;
    button.disabled = true;

    try {
      let unidadesC = null;
      if (data.unidadesCaja !== undefined && data.unidadesCaja !== null) {
        unidadesC = data.unidadesCaja;
      }

      const detalleCreacion: DetalleVentaCreacion = {
        VentaId: Number(idVenta),
        InventarioId: detalle!.inventario!.id,
        EstadoId: estados.Activo,
        UnidadMedidaId: data.unidadMedida,
        UnidadesPorCaja: unidadesC,
        Cantidad: data.cantidad,
        PrecioVenta: data.precioVenta,
        Descuento: descuento,
        PrecioVentaConDescuento:
          Math.ceil((data.precioVenta - data.precioVenta * descuento) * 100) /
          100,
        Total: data.totalVenta,
      };
      const token = localStorage.getItem("token");
      const detExist = await detalleExistInVentaUpd(
        token,
        detalle!.inventario?.id,
        idVenta,
        detalleCreacion.UnidadMedidaId,
        detalle!.id
      );

      if (detExist) {
        toast.warning(
          "El inventario con su unidad de medida ya existe en la venta",
          {
            description:
              "Si desea otra cantidad, edite el detalle de venta existente",
          }
        );
        button.disabled = false;
        return;
      }

      const detallesData = await getDetallesVenta(token, idVenta);
      const detalles: DetalleVenta[] = detallesData as DetalleVenta[];

      let cantidadYaAgregada = 0;
      detalles.forEach((det) => {
        if (
          det.inventarioId === detalle!.inventario!.id &&
          det.unidadMedidaId !== detalleCreacion.UnidadMedidaId
        ) {
          if (det.id === Number(idDet))
            return; // ignoramos el detalle que estamos editando
          else if (det.unidadMedidaId == UnidadMedidaEnum.libra) {
            cantidadYaAgregada += det.cantidad * EquivalenciasMasaLibras.libra;
          } else if (det.unidadMedidaId == UnidadMedidaEnum.arroba) {
            cantidadYaAgregada += det.cantidad * EquivalenciasMasaLibras.arroba;
          } else if (det.unidadMedidaId == UnidadMedidaEnum.quintal) {
            cantidadYaAgregada +=
              det.cantidad * EquivalenciasMasaLibras.quintal;
          } else if (det.unidadMedidaId == UnidadMedidaEnum.unidad) {
            cantidadYaAgregada +=
              det.cantidad * EquivalenciasConteoUnidades.unidad;
          } else if (det.unidadMedidaId == UnidadMedidaEnum.docena) {
            cantidadYaAgregada +=
              det.cantidad * EquivalenciasConteoUnidades.docena;
          } else if (det.unidadMedidaId == UnidadMedidaEnum.caja) {
            cantidadYaAgregada += det.cantidad * det.unidadesPorCaja;
          }
        }
      });

      if (detalleCreacion.UnidadMedidaId == UnidadMedidaEnum.libra) {
        if (
          detalle!.inventario.stock <
          cantidadYaAgregada +
            detalleCreacion.Cantidad * EquivalenciasMasaLibras.libra
        ) {
          toast.warning("No hay stock suficiente para esta venta", {
            description:
              "Unidades disponibles: " +
              (detalle!.inventario.stock - cantidadYaAgregada) +
              " - Unidades solicitadas: " +
              detalleCreacion.Cantidad * EquivalenciasMasaLibras.libra,
          });
          button.disabled = false;
          return;
        }
      } else if (detalleCreacion.UnidadMedidaId == UnidadMedidaEnum.arroba) {
        if (
          detalle!.inventario.stock <
          cantidadYaAgregada +
            detalleCreacion.Cantidad * EquivalenciasMasaLibras.arroba
        ) {
          toast.warning("No hay stock suficiente para esta venta", {
            description:
              "Unidades disponibles: " +
              (detalle!.inventario.stock - cantidadYaAgregada) +
              " - Unidades solicitadas: " +
              detalleCreacion.Cantidad * EquivalenciasMasaLibras.arroba,
          });
          button.disabled = false;
          return;
        }
      } else if (detalleCreacion.UnidadMedidaId == UnidadMedidaEnum.quintal) {
        if (
          detalle!.inventario.stock <
          cantidadYaAgregada +
            detalleCreacion.Cantidad * EquivalenciasMasaLibras.quintal
        ) {
          toast.warning("No hay stock suficiente para esta venta", {
            description:
              "Unidades disponibles: " +
              (detalle!.inventario.stock - cantidadYaAgregada) +
              " - Unidades solicitadas: " +
              detalleCreacion.Cantidad * EquivalenciasMasaLibras.quintal,
          });
          button.disabled = false;
          return;
        }
      } else if (detalleCreacion.UnidadMedidaId == UnidadMedidaEnum.unidad) {
        if (
          detalle!.inventario.stock <
          cantidadYaAgregada +
            detalleCreacion.Cantidad * EquivalenciasConteoUnidades.unidad
        ) {
          toast.warning("No hay stock suficiente para esta venta", {
            description:
              "Unidades disponibles: " +
              (detalle!.inventario.stock - cantidadYaAgregada) +
              " - Unidades solicitadas: " +
              detalleCreacion.Cantidad * EquivalenciasConteoUnidades.unidad,
          });
          button.disabled = false;
          return;
        }
      } else if (detalleCreacion.UnidadMedidaId == UnidadMedidaEnum.docena) {
        if (
          detalle!.inventario.stock <
          cantidadYaAgregada +
            detalleCreacion.Cantidad * EquivalenciasConteoUnidades.docena
        ) {
          toast.warning("No hay stock suficiente para esta venta", {
            description:
              "Unidades disponibles: " +
              (detalle!.inventario.stock - cantidadYaAgregada) +
              " - Unidades solicitadas: " +
              detalleCreacion.Cantidad * EquivalenciasConteoUnidades.docena,
          });
          button.disabled = false;
          return;
        }
      } else if (detalleCreacion.UnidadMedidaId == UnidadMedidaEnum.caja) {
        if (
          detalle!.inventario.stock <
          cantidadYaAgregada +
            detalleCreacion.Cantidad * Number(detalleCreacion!.UnidadesPorCaja)
        ) {
          toast.warning("No hay stock suficiente para esta venta", {
            description:
              "Unidades disponibles: " +
              (detalle!.inventario.stock - cantidadYaAgregada) +
              " - Unidades solicitadas: " +
              detalleCreacion.Cantidad *
                Number(detalleCreacion!.UnidadesPorCaja),
          });
          button.disabled = false;
          return;
        }
      }

      const resp = await PutDetalleVenta(
        token,
        detalleCreacion,
        idVenta,
        detalle!.id
      );

      if (resp === 403) {
        toast.error("No tienes autorización", {
          description: "Inicia sesión, por favor",
        });
        await sleep(1500);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Detalle de venta actualizado correctamente", {
        description: "Volviendo a la venta...",
      });
      button.disabled = false;
      await sleep(2000);
      router.push(`/dashboard/ventas/${idVenta}/detallesVenta`);
    } catch (error: any) {
      toast.error(error.message);
      button.disabled = false;
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {detalle && (
        <>
          <label className="font-medium">Id:</label>
          <input
            type="number"
            readOnly
            defaultValue={detalle.id}
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          />

          <label className="font-medium">Inventario:</label>
          <input
            type="text"
            readOnly
            defaultValue={detalle.inventario.nombre}
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          />

          {/* Unidades disponibles */}
          <label htmlFor="stock" className="font-medium">
            Unidades disponibles:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="number"
            id="stock"
            value={unidadesDisponibles}
            readOnly={true}
          />

          {/* Unidad de medida */}
          <label htmlFor="unidadMedida" className="font-medium mt-4">
            Unidad de medida:
          </label>
          <select
            id="unidadMedida"
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
            {...register("unidadMedida", {
              required: "La unidad de medida es requerida",
            })}
          >
            <option value={detalle.unidadMedidaId}>
              {detalle.unidadMedida}
            </option>
            {unidadesMedidasTipo
              .filter((u) => u.id !== detalle.unidadMedidaId)
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.medida}
                </option>
              ))}
          </select>
          {errors.unidadMedida && (
            <span className="text-red-500 text-sm">
              {errors.unidadMedida.message as string}
            </span>
          )}

          {Number(unidadSeleccionada) === UnidadMedidaEnum.caja && (
            <>
              <label className="font-medium">Unidades por caja:</label>
              <input
                type="number"
                min={1}
                max={1000}
                defaultValue={detalle.unidadesPorCaja || ""}
                {...register("unidadesCaja", {
                  required: "Las unidades por caja son requeridas",
                })}
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
              />
              {errors.unidadesCaja && (
                <span className="text-red-500 text-sm">
                  {errors.unidadesCaja.message as string}
                </span>
              )}
            </>
          )}

          <label className="font-medium">Cantidad:</label>
          <input
            type="number"
            min={1}
            defaultValue={detalle.cantidad}
            {...register("cantidad", {
              required: "La cantidad es requerida",
              min: { value: 1, message: "Debe ser al menos 1" },
            })}
            readOnly={!editable}
            className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
          />
          {errors.cantidad && (
            <span className="text-red-500 text-sm">
              {errors.cantidad.message as string}
            </span>
          )}

          {/* Precio Venta unitario oculto*/}
          <label htmlFor="precioVenta" className="font-medium hidden">
            Precio de venta unitario Q:
          </label>
          <input
            className="hidden px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="number"
            value={detalle.inventario.precioVenta}
            readOnly={true}
            id="precioVenta"
            {...register("precioVenta")}
          />

          {/* Precio Venta por unidad de medida*/}
          <label htmlFor="precioVentaUnMedida" className="font-medium">
            Precio de venta por {medidaSeleccionada ? medidaSeleccionada : "—"}{" "}
            Q:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="number"
            readOnly={true}
            id="precioVentaUnMedida"
            {...register("precioVentaUnMedida")}
          />

          {/* Descuento */}
          <label htmlFor="descuento" className="font-medium">
            Descuento:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            readOnly={true}
            value={Math.round(descuento * 100) + "%"}
            id="descuento"
            {...register("descuento")}
          />

          {/* Total */}
          <label htmlFor="totalVenta" className="font-medium">
            Total Q:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="number"
            readOnly={true}
            id="totalVenta"
            {...register("totalVenta")}
          />
          {editable && (
            <button
              id="btnActualizar"
              className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
            >
              Actualizar detalle
            </button>
          )}
        </>
      )}
    </form>
  );
}
