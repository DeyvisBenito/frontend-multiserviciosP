"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { redirect, useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "sonner";
import {
  detalleExistInCompra,
  getCompra,
  getDetallesCompra,
  getInventarioByCodigo,
  getTiposProductos,
  getUnidadesMedida,
  postDetalleCompra,
  postInventario,
} from "@/app/lib/api";
import {
  Compra,
  DetalleCompra,
  DetalleCompraCreacion,
  Inventario,
  InventarioCreacion,
  TipoProducto,
  UnidadMedida,
} from "@/app/lib/definitions";
import { estados } from "@/app/lib/utilities/estadosEnum";
import { TipoMedidaEnum } from "@/app/lib/utilities/tipoMedidaEnum";
import { UnidadMedidaEnum } from "@/app/lib/utilities/unidadMedidaEnum";
import TablaDetallesCompra from "@/app/ui/detallesCompra/tablaDetallesCompra";
import { CancelarCompra, ProcesarCompra } from "@/app/ui/detallesCompra/buttons";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function DetallesCompraPage() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();
  if (!id) {
    toast.error("Compra no seleccionada");
    setTimeout(() => {
      router.push("/dashboard/compras");
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
    register: registerNuevo,
    handleSubmit: handleSubmitNuevo,
    formState: { errors: errorsNuevo },
    reset: resetNuevo,
  } = useForm();

  const {
    register: registerDetalle,
    handleSubmit: handleSubmitDetalle,
    watch,
    formState: { errors: errorsDetalle },
    reset: resetDetalle,
  } = useForm();

  const [crearInventario, setCrearInventarios] = useState<boolean | null>(null);
  const [inventario, setInventario] = useState<Inventario | null>(null);
  const [detalles, setDetalles] = useState<DetalleCompra[]>([]);
  const [tipoProducts, setTipoProducts] = useState<TipoProducto[]>([]);
  const [unidadMedida, setUnidadMedida] = useState<UnidadMedida[]>([]);
  const [compraPend, setCompraPend] = useState<Compra>();

  const tipoProductoSelect = tipoProducts.find(
    (tp) => tp.id === inventario?.tipoProductoId
  );
  const unidadSeleccionada = watch("unidadM");

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
      resetBuscar();
      setCrearInventarios(false);
      setInventario(inventarioData);
    } catch (error: any) {
      toast.warning(error.message, {
        description: "Proceda a crearlo.",
      });
      setCrearInventarios(true);
      buttonBuscarByCodigo.disabled = false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getDatos = async () => {
      try {
        const dataCompra = await getCompra(token, id);
        const dataTipoProducto = await getTiposProductos(token);
        const dataUnidadMedida = await getUnidadesMedida(token);
        const dataDetallesCompra = await getDetallesCompra(token, id);

        if (
          dataTipoProducto === 403 ||
          dataUnidadMedida === 403 ||
          dataDetallesCompra === 403 ||
          dataCompra === 403
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
        const detalleCompraData: DetalleCompra[] =
          dataDetallesCompra as DetalleCompra[];
        const compraData: Compra = dataCompra as Compra;
        setCompraPend(compraData);
        setUnidadMedida(unidadMedidaData);
        setTipoProducts(tiposProducto);
        setDetalles(detalleCompraData);
      } catch (error: any) {
        toast.error(error.message);
        await sleep(1000);
        router.push("/dashboard/compras");
      }
    };

    getDatos();
  }, [router]);

  if (compraPend) {
    if (compraPend.estadoId !== estados.Pendiente) {
      redirect(`/dashboard/compras`);
    }
  }

  const onRegistrarNuevoInventario = async (data: any) => {
    let tipoMedida = 0;
    let unidadMedidaId = 0;
    if (data.tipo) {
      const tipoProductoSeleccionado = tipoProducts.find(
        (tp) => tp.id === Number(data.tipo)
      );
      if (!tipoProductoSeleccionado) {
        toast.error("Tipo de producto no encontrado");
        return;
      }
      tipoMedida = tipoProductoSeleccionado.tipoMedidaId;
    }

    if (tipoMedida === TipoMedidaEnum.masa) {
      unidadMedidaId = UnidadMedidaEnum.libra;
    } else if (tipoMedida === TipoMedidaEnum.conteo) {
      unidadMedidaId = UnidadMedidaEnum.unidad;
    } else {
      toast.error("Tipo de medida del producto no encontrado");
      return;
    }

    const inventCreacion: InventarioCreacion = {
      Codigo: data.codigoCreacion,
      EstadoId: estados.Activo,
      Marca: data.marca,
      Nombre: data.nombre,
      TipoProductoId: data.tipo,
      Descripcion: data.description,
      Foto: data.foto,
      UnidadMedidaId: unidadMedidaId,
    };

    const token = localStorage.getItem("token");
    const buttonCrear = document.getElementById(
      "buttonCrear"
    ) as HTMLButtonElement;
    buttonCrear.disabled = true;
    try {
      const data = await postInventario(token, inventCreacion);

      if (data === 403) {
        toast.error("No tienes autorización", {
          description: "Inicia sesión, por favor",
        });

        await sleep(2000);
        localStorage.removeItem("token");
        buttonCrear.disabled = false;
        router.push("/auth/login");
        return;
      }
      await sleep(2000);
      buttonCrear.disabled = false;
      toast.success("Inventario agregado correctamente", {
        description: "Por favor vuelva a buscarlo por su código",
      });
      setCrearInventarios(null);
      resetNuevo();
    } catch (error: any) {
      toast.error(error.message);
      setCrearInventarios(true);
      buttonCrear.disabled = false;
    }
  };

  const onSubmitRegistrarDetalle = async (data: any) => {
    let unidadesC = null;
    if (data.unidadesCaja !== undefined && data.unidadesCaja !== null) {
      unidadesC = data.unidadesCaja;
    }

    const detalleCreacion: DetalleCompraCreacion = {
      EstadoId: estados.Activo,
      Cantidad: data.cantidad,
      CompraId: Number(id),
      InventarioId: inventario?.id,
      PrecioCosto: data.precioCosto,
      UnidadMedidaId: data.unidadM,
      UnidadesPorCaja: unidadesC,
    };
    const token = localStorage.getItem("token");
    const btnCrearDetalle = document.getElementById(
      "btnCrearDetalle"
    ) as HTMLButtonElement;
    btnCrearDetalle.disabled = true;
    try {
      const exist = await detalleExistInCompra(token, inventario?.id, id);
      if(exist){
        toast.error("El inventario ya existe en un detalle de esta compra");
        btnCrearDetalle.disabled = false;
        return;
      }
      const resp = await postDetalleCompra(token, detalleCreacion);

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

      toast.success("Detalle de compra agregado correctamente");
      btnCrearDetalle.disabled = false;
      const dataDetallesCompra = await getDetallesCompra(token, id);
      const detallesData: DetalleCompra[] =
        dataDetallesCompra as DetalleCompra[];
      setCrearInventarios(null);
      setDetalles(detallesData);
      resetDetalle();
    } catch (error: any) {
      toast.error(error.message);
      setCrearInventarios(null);
      btnCrearDetalle.disabled = false;
    }
  };

  const onClickCancelarCreacion = () => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded shadow-md flex flex-col gap-2">
        <p className="text-gray-800">
          ¿Seguro que desea cancelar la creacion? todo se borrará
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
              resetNuevo();
              setCrearInventarios(null);
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
      <Toaster position="top-center" richColors />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Procesando Compra
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

        {/* Si no existe inventario, crearlo */}
        {crearInventario === true && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-center text-red-600 mb-4">
              Registrar nuevo producto al Inventario
            </h2>
            <form
              onSubmit={handleSubmitNuevo(onRegistrarNuevoInventario)}
              className="flex flex-col gap-4"
            >
              {/* Codigo */}
              <label htmlFor="codigoCreacion" className="font-medium">
                Código de inventario:
              </label>
              <input
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
                type="text"
                id="codigoCreacion"
                {...registerNuevo("codigoCreacion", {
                  required: "El código es requerido",
                })}
              />
              {errorsNuevo.codigoCreacion && (
                <span className="text-red-500 text-sm">
                  {errorsNuevo.codigoCreacion.message as string}
                </span>
              )}
              {/* Nombre */}
              <label htmlFor="nombre" className="font-medium">
                Nombre:
              </label>
              <input
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
                type="text"
                id="nombre"
                {...registerNuevo("nombre", {
                  required: "El nombre es requerido",
                })}
              />
              {errorsNuevo.nombre && (
                <span className="text-red-500 text-sm">
                  {errorsNuevo.nombre.message as string}
                </span>
              )}

              {/* Tipo de Producto */}
              <label htmlFor="tipo" className="font-medium mt-4">
                Tipo de Producto:
              </label>
              <select
                id="tipo"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
                {...registerNuevo("tipo", {
                  required: "El tipo de producto es requerido",
                })}
              >
                <option value="">Seleccione un tipo</option>
                {tipoProducts
                  ?.filter((tipo) => tipo.estadoId === 1)
                  .map((tipo) => (
                    <option value={tipo.id} key={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
              </select>
              {errorsNuevo.tipo && (
                <span className="text-red-500 text-sm">
                  {errorsNuevo.tipo.message as string}
                </span>
              )}

              {/* Marca */}
              <label htmlFor="marca" className="font-medium mt-4">
                Marca:
              </label>
              <input
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
                type="text"
                id="marca"
                {...registerNuevo("marca", {
                  required: "La marca es requerida",
                })}
              />
              {errorsNuevo.marca && (
                <span className="text-red-500 text-sm">
                  {errorsNuevo.marca.message as string}
                </span>
              )}

              {/* Foto */}
              <label htmlFor="foto" className="font-medium mt-4">
                Foto:
              </label>
              <input
                type="file"
                id="foto"
                accept="image/*"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
                {...registerNuevo("foto", { required: "La foto es requerida" })}
              />
              {errorsNuevo.foto && (
                <span className="text-red-500 text-sm">
                  {errorsNuevo.foto.message as string}
                </span>
              )}

              {/* Descripción */}
              <label htmlFor="description" className="font-medium mt-4">
                Descripción:
              </label>
              <textarea
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
                id="description"
                {...registerNuevo("description", {
                  required: "La descripción es requerida",
                })}
              />
              {errorsNuevo.description && (
                <span className="text-red-500 text-sm">
                  {errorsNuevo.description.message as string}
                </span>
              )}

              <button
                id="buttonCrear"
                className="bg-green-500 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Registrar Inventario
              </button>
              <button
                onClick={onClickCancelarCreacion}
                className="bg-gray-200 hover:bg-gray-300 py-2 rounded-lg font-semibold transition"
              >
                Cancelar Registro
              </button>
            </form>
          </div>
        )}

        {/* SI EXISTE INVENTARIO */}
        {crearInventario === false && (
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
              {/* Unidad de medida de ingreso */}
              <label htmlFor="unidadM" className="font-medium mt-4">
                Unidad de medida de ingreso:
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

              {/* Precio Costo */}
              <label htmlFor="precioCosto" className="font-medium">
                Precio Costo por unidad de medida:
              </label>
              <input
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
                type="number"
                min={1}
                id="precioCosto"
                {...registerDetalle("precioCosto", {
                  required: "El precio de costo es requerido",
                  min: { value: 1, message: "Debe ser al menos 1" },
                })}
              />
              {errorsDetalle.precioCosto && (
                <span className="text-red-500 text-sm">
                  {errorsDetalle.precioCosto.message as string}
                </span>
              )}
              <button
                id="btnCrearDetalle"
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Registrar detalle a la compra
              </button>
            </form>
          </div>
        )}
      </div>
      {/* TABLA DE REGISTROS */}
      {detalles.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
            Detalles de Compra
          </h2>
          <TablaDetallesCompra
            idCompra={id}
            detalles={detalles}
            mostrarBtns={true}
            onDeleted={(deletedId) => {
              setDetalles((prev: DetalleCompra[]) =>
                prev.filter((p) => p.id !== deletedId)
              );
            }}
          />
        </div>
      )}
      <div className="mt-10 border-t pt-6 flex flex-col gap-4">
        <ProcesarCompra idCompra={id} detalles={detalles}/>
        <CancelarCompra idCompra={id} />
      </div>
    </>
  );
}
