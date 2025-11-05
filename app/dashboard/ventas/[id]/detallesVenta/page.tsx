"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { redirect, useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "sonner";
import {
  detalleExistInVenta,
  getDescuento,
  getDetallesVenta,
  getInventarioByCodigo,
  getInventarioById,
  getTiposProductos,
  getUnidadesMedida,
  getVenta,
  postDetalleVenta,
} from "@/app/lib/api";
import {
  DetalleVenta,
  DetalleVentaCreacion,
  Inventario,
  TipoProducto,
  UnidadMedida,
  Venta,
} from "@/app/lib/definitions";
import { estados } from "@/app/lib/utilities/estadosEnum";
import {
  EquivalenciasConteoUnidades,
  EquivalenciasMasaLibras,
  UnidadMedidaEnum,
} from "@/app/lib/utilities/unidadMedidaEnum";
import TablaDetallesVenta from "@/app/ui/detallesVenta/tablaDetallesVenta";
import { CancelarVenta } from "@/app/ui/detallesVenta/buttons";
import ModalProcessVenta from "@/app/ui/ventas/modalProcesarVenta";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function DetallesVentaPage() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();
  if (!id) {
    toast.error("Venta no seleccionada");
    setTimeout(() => {
      router.push("/dashboard/ventas");
    }, 2000);

    return;
  }

  const {
    register: registerBuscar,
    handleSubmit: handleSubmitBuscar,
    formState: { errors: errorsBuscar },
    reset: resetBuscar,
  } = useForm();

  const {
    register: registerDetalle,
    handleSubmit: handleSubmitDetalle,
    watch,
    formState: { errors: errorsDetalle },
    reset: resetDetalle,
    setValue,
  } = useForm();

  const [inventario, setInventario] = useState<Inventario | null>(null);
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
  const [tipoProducts, setTipoProducts] = useState<TipoProducto[]>([]);
  const [unidadMedida, setUnidadMedida] = useState<UnidadMedida[]>([]);
  const [ventaPend, setVentaPend] = useState<Venta>();
  const [descuento, setDescuento] = useState<number>(0);
  const [totalUnidadesMin, setTotalUnidadesMin] = useState<number>(0);
  const [unidadesDisponibles, setUnidadesDisponiblres] = useState<number>(0);
  const [modalProccVent, setModalProcessVent] = useState<boolean>(false);

  const tipoProductoSelect = tipoProducts.find(
    (tp) => tp.id === inventario?.tipoProductoId
  );
  const unidadSeleccionada = watch("unidadM");
  const cantitadSeleccionada = watch("cantidad");
  const cantidadPorCaja = watch("unidadesCaja") || 1;

  const medidaSeleccionada = unidadMedida?.find(
    (u) => u.id === parseInt(unidadSeleccionada)
  )?.medida;

  useEffect(() => {
    if (inventario !== null) {
      let precioUnitario = inventario.precioVenta;
      if (unidadSeleccionada) {
        if (unidadSeleccionada === UnidadMedidaEnum.libra) {
          precioUnitario = inventario.precioVenta;
        } else if (unidadSeleccionada == UnidadMedidaEnum.arroba) {
          precioUnitario =
            inventario.precioVenta * EquivalenciasMasaLibras.arroba;
        } else if (unidadSeleccionada == UnidadMedidaEnum.quintal) {
          precioUnitario =
            inventario.precioVenta * EquivalenciasMasaLibras.quintal;
        } else if (unidadSeleccionada == UnidadMedidaEnum.unidad) {
          precioUnitario = inventario.precioVenta;
        } else if (unidadSeleccionada == UnidadMedidaEnum.docena) {
          precioUnitario =
            inventario.precioVenta * EquivalenciasConteoUnidades.docena;
        } else if (unidadSeleccionada == UnidadMedidaEnum.caja) {
          precioUnitario = inventario.precioVenta * Number(cantidadPorCaja);
        }
      }
      precioUnitario = Math.ceil(precioUnitario * 100) / 100;
      setValue("precioVentaUnMedida", precioUnitario);
    }
  }, [
    inventario,
    descuento,
    cantidadPorCaja,
    unidadSeleccionada,
    cantitadSeleccionada,
  ]);

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
      setTotalUnidadesMin(cantitadSeleccionada * cantidadPorCaja);
    }
  }, [cantitadSeleccionada, unidadSeleccionada, cantidadPorCaja]);

  useEffect(() => {
    if (inventario !== null) {
      const precioConDescuento =
        Math.ceil(
          (inventario.precioVenta - inventario.precioVenta * descuento) * 100
        ) / 100;

      const nuevoPrecio =
        Math.ceil(precioConDescuento * totalUnidadesMin * 100) / 100;

      setValue("totalVenta", nuevoPrecio);
    }
  }, [descuento, totalUnidadesMin, setValue]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (unidadSeleccionada) {
      const getDes = async () => {
        var data = await getDescuento(
          token,
          inventario!.unidadMedidaId,
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

  const onSubmitBuscarByCodigo = async (data: any) => {
    const codigo = data.codigoInventario.trim();
    const token = localStorage.getItem("token");
    const buttonBuscarByCodigo = document.getElementById(
      "btnBuscarByCodigo"
    ) as HTMLButtonElement;
    buttonBuscarByCodigo.disabled = true;
    try {
      const data = await getInventarioByCodigo(token, codigo);

      if (data === 403) {
        toast.error("No tienes autorización", {
          description: "Inicia sesión, por favor",
        });

        await sleep(2000);
        localStorage.removeItem("token");
        buttonBuscarByCodigo.disabled = false;
        router.push("/auth/login");
        return;
      }

      toast.success("Inventario encontrado");
      buttonBuscarByCodigo.disabled = false;
      const inventarioData: Inventario = data as Inventario;
      setInventario(inventarioData);
      setUnidadesDisponiblres(inventarioData.stock);

      detalles.forEach((detalle) => {
        if (detalle.inventarioId === inventarioData.id) {
          if (detalle.unidadMedidaId == UnidadMedidaEnum.libra) {
            setUnidadesDisponiblres(
              (prev) => prev - detalle.cantidad * EquivalenciasMasaLibras.libra
            );
          } else if (detalle.unidadMedidaId == UnidadMedidaEnum.arroba) {
            setUnidadesDisponiblres(
              (prev) => prev - detalle.cantidad * EquivalenciasMasaLibras.arroba
            );
          } else if (detalle.unidadMedidaId == UnidadMedidaEnum.quintal) {
            setUnidadesDisponiblres(
              (prev) =>
                prev - detalle.cantidad * EquivalenciasMasaLibras.quintal
            );
          } else if (detalle.unidadMedidaId == UnidadMedidaEnum.unidad) {
            setUnidadesDisponiblres(
              (prev) =>
                prev - detalle.cantidad * EquivalenciasConteoUnidades.unidad
            );
          } else if (detalle.unidadMedidaId == UnidadMedidaEnum.docena) {
            setUnidadesDisponiblres(
              (prev) =>
                prev - detalle.cantidad * EquivalenciasConteoUnidades.docena
            );
          } else if (detalle.unidadMedidaId == UnidadMedidaEnum.caja) {
            setUnidadesDisponiblres(
              (prev) => prev - detalle.cantidad * detalle.unidadesPorCaja
            );
          }
        }
      });
      resetBuscar();
    } catch (error: any) {
      toast.warning(error.message);
      buttonBuscarByCodigo.disabled = false;
      setInventario(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getDatos = async () => {
      try {
        const dataVenta = await getVenta(token, id);
        const dataTipoProducto = await getTiposProductos(token);
        const dataUnidadMedida = await getUnidadesMedida(token);
        const dataDetVenta = await getDetallesVenta(token, id);

        if (
          dataTipoProducto === 403 ||
          dataUnidadMedida === 403 ||
          dataDetVenta === 403 ||
          dataVenta === 403
        ) {
          toast.error("No tienes autorización", {
            description: "Inicia sesión, por favor",
          });

          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const tiposProducto: TipoProducto[] =
          dataTipoProducto as TipoProducto[];
        const unidadMedidaData: UnidadMedida[] =
          dataUnidadMedida as UnidadMedida[];
        const detVentaData: DetalleVenta[] = dataDetVenta as DetalleVenta[];
        const ventaData: Venta = dataVenta as Venta;
        setVentaPend(ventaData);
        setUnidadMedida(unidadMedidaData);
        setTipoProducts(tiposProducto);
        setDetalles(detVentaData);
      } catch (error: any) {
        toast.error(error.message);
        await sleep(1000);
        router.push("/dashboard/ventas");
      }
    };

    getDatos();
  }, [router]);

  if (ventaPend) {
    if (ventaPend.estadoId !== estados.Pendiente) {
      redirect(`/dashboard/ventas`);
    }
  }

  const onSubmitRegistrarDetalle = async (data: any) => {
    let unidadesC = null;
    if (data.unidadesCaja !== undefined && data.unidadesCaja !== null) {
      unidadesC = data.unidadesCaja;
    }

    const detalleCreacion: DetalleVentaCreacion = {
      VentaId: Number(id),
      InventarioId: inventario!.id,
      EstadoId: estados.Activo,
      UnidadMedidaId: data.unidadM,
      UnidadesPorCaja: unidadesC,
      Cantidad: data.cantidad,
      PrecioVenta: inventario!.precioVenta,
      Descuento: descuento,
      PrecioVentaConDescuento:
        Math.ceil((inventario!.precioVenta - inventario!.precioVenta * descuento) * 100) /
        100,
      Total: data.totalVenta,
    };
    const token = localStorage.getItem("token");
    const btnCrearDetalle = document.getElementById(
      "btnCrearDetalle"
    ) as HTMLButtonElement;
    btnCrearDetalle.disabled = true;
    try {
      const detExist = await detalleExistInVenta(
        token,
        inventario?.id,
        id,
        detalleCreacion.UnidadMedidaId
      );

      if (detExist) {
        toast.error(
          "El inventario con su unidad de medida ya existe en la venta",
          {
            description: "Si desea otra cantidad, edite el detalle de venta",
          }
        );
        btnCrearDetalle.disabled = false;
        return;
      }

      let cantidadYaAgregada = 0;
      detalles.forEach((detalle) => {
        if (
          detalle.inventarioId === inventario!.id &&
          detalle.unidadMedidaId !== detalleCreacion.UnidadMedidaId
        ) {
          if (detalle.unidadMedidaId == UnidadMedidaEnum.libra) {
            cantidadYaAgregada +=
              detalle.cantidad * EquivalenciasMasaLibras.libra;
          } else if (detalle.unidadMedidaId == UnidadMedidaEnum.arroba) {
            cantidadYaAgregada +=
              detalle.cantidad * EquivalenciasMasaLibras.arroba;
          } else if (detalle.unidadMedidaId == UnidadMedidaEnum.quintal) {
            cantidadYaAgregada +=
              detalle.cantidad * EquivalenciasMasaLibras.quintal;
          } else if (detalle.unidadMedidaId == UnidadMedidaEnum.unidad) {
            cantidadYaAgregada +=
              detalle.cantidad * EquivalenciasConteoUnidades.unidad;
          } else if (detalle.unidadMedidaId == UnidadMedidaEnum.docena) {
            cantidadYaAgregada +=
              detalle.cantidad * EquivalenciasConteoUnidades.docena;
          } else if (detalle.unidadMedidaId == UnidadMedidaEnum.caja) {
            cantidadYaAgregada += detalle.cantidad * detalle.unidadesPorCaja;
          }
        }
      });

      const inventarioStock = await getInventarioById(token, inventario!.id);
      if (inventarioStock === 403) {
        toast.error("No tienes autorización", {
          description: "Inicia sesión, por favor",
        });

        await sleep(2000);
        localStorage.removeItem("token");
        btnCrearDetalle.disabled = false;
        router.push("/auth/login");
        return;
      }
      const inv = inventarioStock as Inventario;
      const stockDip = inv.stock;

      if (detalleCreacion.UnidadMedidaId == UnidadMedidaEnum.libra) {
        if (
          stockDip <
          cantidadYaAgregada +
            detalleCreacion.Cantidad * EquivalenciasMasaLibras.libra
        ) {
          toast.warning("No hay stock suficiente para esta venta", {
            description:
              "Unidades disponibles: " +
              (stockDip - cantidadYaAgregada) +
              " - Unidades solicitadas: " +
              detalleCreacion.Cantidad * EquivalenciasMasaLibras.libra,
          });
          btnCrearDetalle.disabled = false;
          return;
        }
      } else if (detalleCreacion.UnidadMedidaId == UnidadMedidaEnum.arroba) {
        if (
          stockDip <
          cantidadYaAgregada +
            detalleCreacion.Cantidad * EquivalenciasMasaLibras.arroba
        ) {
          toast.warning("No hay stock suficiente para esta venta", {
            description:
              "Unidades disponibles: " +
              (stockDip - cantidadYaAgregada) +
              " - Unidades solicitadas: " +
              detalleCreacion.Cantidad * EquivalenciasMasaLibras.arroba,
          });
          btnCrearDetalle.disabled = false;
          return;
        }
      } else if (detalleCreacion.UnidadMedidaId == UnidadMedidaEnum.quintal) {
        if (
          stockDip <
          cantidadYaAgregada +
            detalleCreacion.Cantidad * EquivalenciasMasaLibras.quintal
        ) {
          toast.warning("No hay stock suficiente para esta venta", {
            description:
              "Unidades disponibles: " +
              (stockDip - cantidadYaAgregada) +
              " - Unidades solicitadas: " +
              detalleCreacion.Cantidad * EquivalenciasMasaLibras.quintal,
          });
          btnCrearDetalle.disabled = false;
          return;
        }
      } else if (detalleCreacion.UnidadMedidaId == UnidadMedidaEnum.unidad) {
        if (
          stockDip <
          cantidadYaAgregada +
            detalleCreacion.Cantidad * EquivalenciasConteoUnidades.unidad
        ) {
          toast.warning("No hay stock suficiente para esta venta", {
            description:
              "Unidades disponibles: " +
              (stockDip - cantidadYaAgregada) +
              " - Unidades solicitadas: " +
              detalleCreacion.Cantidad * EquivalenciasConteoUnidades.unidad,
          });
          btnCrearDetalle.disabled = false;
          return;
        }
      } else if (detalleCreacion.UnidadMedidaId == UnidadMedidaEnum.docena) {
        if (
          stockDip <
          cantidadYaAgregada +
            detalleCreacion.Cantidad * EquivalenciasConteoUnidades.docena
        ) {
          toast.warning("No hay stock suficiente para esta venta", {
            description:
              "Unidades disponibles: " +
              (stockDip - cantidadYaAgregada) +
              " - Unidades solicitadas: " +
              detalleCreacion.Cantidad * EquivalenciasConteoUnidades.docena,
          });
          btnCrearDetalle.disabled = false;
          return;
        }
      } else if (detalleCreacion.UnidadMedidaId == UnidadMedidaEnum.caja) {
        if (
          stockDip <
          cantidadYaAgregada +
            detalleCreacion.Cantidad * Number(detalleCreacion!.UnidadesPorCaja)
        ) {
          toast.warning("No hay stock suficiente para esta venta", {
            description:
              "Unidades disponibles: " +
              (stockDip - cantidadYaAgregada) +
              " - Unidades solicitadas: " +
              detalleCreacion.Cantidad *
                Number(detalleCreacion!.UnidadesPorCaja),
          });
          btnCrearDetalle.disabled = false;
          return;
        }
      }

      const resp = await postDetalleVenta(token, detalleCreacion);

      if (resp === 403) {
        toast.error("No tienes autorización", {
          description: "Inicia sesión, por favor",
        });

        await sleep(2000);
        localStorage.removeItem("token");
        btnCrearDetalle.disabled = false;
        router.push("/auth/login");
        return;
      }

      toast.success("Detalle de venta agregado correctamente");
      btnCrearDetalle.disabled = false;
      const dataDetVenta = await getDetallesVenta(token, id);
      const detallesData: DetalleVenta[] = dataDetVenta as DetalleVenta[];
      setDetalles(detallesData);
      resetDetalle();
      setInventario(null);
      setUnidadesDisponiblres(0);
    } catch (error: any) {
      toast.error(error.message);
      btnCrearDetalle.disabled = false;
    }
  };

  const onProcesarPago = () => {
    setModalProcessVent(true);
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Procesando Venta
        </h1>

        {/* Busqueda de inventario */}
        <form
          onSubmit={handleSubmitBuscar(onSubmitBuscarByCodigo)}
          className="flex flex-col gap-4"
        >
          <div className="font-medium text-center">Busqueda de inventario</div>
          <label htmlFor="codigoInventario" className="font-medium">
            Código de inventario:
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="text"
            id="codigoInventario"
            {...registerBuscar("codigoInventario", {
              required: "El código es requerido",
            })}
          />
          {errorsBuscar.codigoInventario && (
            <span className="text-red-500 text-sm">
              {errorsBuscar.codigoInventario.message as string}
            </span>
          )}

          <button
            id="btnBuscarByCodigo"
            type="submit"
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
          >
            Buscar
          </button>
        </form>

        {/* SI EXISTE INVENTARIO */}
        {inventario && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">
              Inventario encontrado ✅
            </h2>
            <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">
              {inventario?.nombre}
            </h2>

            <form
              onSubmit={handleSubmitDetalle(onSubmitRegistrarDetalle)}
              className="flex flex-col gap-4"
            >
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

              {/* Unidad de medida de ingreso */}
              <label htmlFor="unidadM" className="font-medium mt-4">
                Unidad de medida de venta:
              </label>
              <select
                id="unidadM"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
                {...registerDetalle("unidadM", {
                  required: "La unidad de medida del producto es requerido",
                })}
              >
                <option value="">Seleccione una unidad de medida</option>
                {unidadMedida
                  ?.filter(
                    (u) => u.tipoMedidaId === tipoProductoSelect?.tipoMedidaId
                  )
                  .map((u) => (
                    <option value={u.id} key={u.id}>
                      {u.medida}
                    </option>
                  ))}
              </select>
              {errorsDetalle.unidadM && (
                <span className="text-red-500 text-sm">
                  {errorsDetalle.unidadM.message as string}
                </span>
              )}

              {/* Input cuando la unidad es caja */}
              {Number(unidadSeleccionada) === UnidadMedidaEnum.caja && (
                <div className="mt-3">
                  <label htmlFor="unidadesCaja" className="font-medium">
                    Unidades por caja:
                  </label>
                  <input
                    id="unidadesCaja"
                    type="number"
                    min={1}
                    max={1000}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 w-full"
                    {...registerDetalle("unidadesCaja", {
                      required:
                        "Las unidades por caja es requerido cuando se selecciona por caja",
                      min: { value: 1, message: "Debe ser al menos 1 unidad" },
                      max: {
                        value: 1000,
                        message: "No puede exceder las 1000 unidades",
                      },
                    })}
                  />
                  {errorsDetalle.unidadesCaja && (
                    <span className="text-red-500 text-sm">
                      {errorsDetalle.unidadesCaja.message as string}
                    </span>
                  )}
                </div>
              )}

              {/* Cantidad */}
              <label htmlFor="cantidad" className="font-medium">
                Cantidad:
              </label>
              <input
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
                type="number"
                min={1}
                id="cantidad"
                {...registerDetalle("cantidad", {
                  required: "La cantidad es requerida",
                  min: { value: 1, message: "Debe ser al menos 1 cantidad" },
                })}
              />
              {errorsDetalle.cantidad && (
                <span className="text-red-500 text-sm">
                  {errorsDetalle.cantidad.message as string}
                </span>
              )}

              {/* Precio Venta por unidad de medida*/}
              <label htmlFor="precioVentaUnMedida" className="font-medium">
                Precio de venta por{" "}
                {medidaSeleccionada ? medidaSeleccionada : "—"} Q:
              </label>
              <input
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
                type="number"
                readOnly={true}
                id="precioVentaUnMedida"
                {...registerDetalle("precioVentaUnMedida")}
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
                {...registerDetalle("descuento")}
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
                {...registerDetalle("totalVenta")}
              />
              <button
                id="btnCrearDetalle"
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Registrar detalle a la venta
              </button>
            </form>
          </div>
        )}
      </div>
      {/* TABLA DE REGISTROS */}
      {detalles.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
            Detalles de Venta
          </h2>
          <TablaDetallesVenta
            idVenta={id}
            detalles={detalles}
            mostrarBtns={true}
            onDeleted={(deletedId) => {
              setDetalles((prev: DetalleVenta[]) =>
                prev.filter((p) => p.id !== deletedId)
              );
            }}
          />
        </div>
      )}
      <div className="mt-10 border-t pt-6 flex flex-col gap-4">
        <button className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
        onClick={onProcesarPago}
        >
          Procesar Pago
        </button>
        {modalProccVent && (
          <ModalProcessVenta
            idVenta={id}
            isOpen={modalProccVent}
            onClose={() => setModalProcessVent(false)}
            detalles={detalles}
          />
        )}

        <CancelarVenta idVenta={id} />
      </div>
    </>
  );
}
