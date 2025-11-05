import { getClienteByVentaId, procesarVenta } from "@/app/lib/api";
import {
  Cliente,
  DetalleVenta,
  respVuelto,
  VentaPago,
} from "@/app/lib/definitions";
import { TipoPagoEnum } from "@/app/lib/utilities/tipoPagoEnum";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import TablaDetallesVenta from "../detallesVenta/tablaDetallesVenta";
import { useUserEmail, useUserSucursal } from "@/app/lib/decodeToken";
import {
  EquivalenciasConteoUnidades,
  EquivalenciasMasaLibras,
  UnidadMedidaEnum,
} from "@/app/lib/utilities/unidadMedidaEnum";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function ModalProcessVenta({
  isOpen,
  onClose,
  idVenta,
  detalles,
}: {
  isOpen: boolean;
  onClose: () => void;
  idVenta: string | number;
  detalles: DetalleVenta[];
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  let idVentaString: string = idVenta as string;
  let emailVendedor: string | null = useUserEmail();
  const [paymentMethod, setPaymentMethod] = useState<TipoPagoEnum>(
    TipoPagoEnum.Efectivo
  );
  const [vuelto, setVuelto] = useState<respVuelto>({ vuelto: 0 });
  const [pagoGlobal, setPagoGlobal] = useState<number>(0);
  const [mostrarVuelto, setMostrarVuelto] = useState<boolean>(false);
  const [cliente, setCliente] = useState<Cliente>();

  const hasShownToast = useRef(false);
  let total = 0;
  detalles.forEach((det) => {
    total = total + det.total;
  });

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const onSubmit = async (data: any) => {
    const pago = data.pago;
    setPagoGlobal(pago);
    if (pago < total) {
      toast.error("Saldo insuficiente", {
        description: "No se puede confirmar el pago.",
      });

      return;
    }
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
              fetchProcesarVenta(pago);
            }}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Confirmar
          </button>
        </div>
      </div>
    ));

    const fetchProcesarVenta = async (pago: any) => {
      let tipoPago = paymentMethod;
      const ventaPago: VentaPago = {
        Pago: pago,
      };

      const btnProcesar = document.getElementById(
        "btnProcesar"
      ) as HTMLButtonElement;
      const btnCancelar = document.getElementById(
        "btnCancelar"
      ) as HTMLButtonElement;
      const token = localStorage.getItem("token");
      btnProcesar.disabled = true;
      btnCancelar.disabled = true;
      try {
        const data = await procesarVenta(token, idVenta, tipoPago, ventaPago);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }

        const vuelto: respVuelto = data as respVuelto;
        setVuelto(vuelto);
        setMostrarVuelto(true);
        toast.success("Venta procesada correctamente");
      } catch (error: any) {
        toast.error(error.message);
        btnProcesar.disabled = false;
        btnCancelar.disabled = false;
      }
    };
  };

  const printRef = useRef<HTMLDivElement>(null);

  const ModalVuelto = ({ vuelto }: { vuelto: respVuelto | undefined }) => (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center relative">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Vuelto a entregar
          </h2>
          <p className="text-3xl font-bold text-green-600 mb-4">
            Q {vuelto!.vuelto.toFixed(2)}
          </p>
          <div className="flex space-x-10 mt-4">
            <button
              onClick={async () => {
                setMostrarVuelto(false);
                toast.success("Imprimiendo factura...");
                handlePrint();
                toast.success("Volviendo al dashboard...");
                await sleep(1000);
                router.push("/dashboard/ventas");
              }}
              className="w-full bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>

      {/* 🧾 Sección oculta para imprimir */}
      <div
        ref={printRef}
        className="hidden print:block text-sm font-mono w-[250px] mx-auto text-center"
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            padding: "10px",
            width: "260px",
          }}
        >
          <h2 style={{ textAlign: "center", margin: "0" }}>
            AgroServicios Pineda
          </h2>
          <hr />

          <p>
            <b>Factura:</b> {idVenta}
          </p>
          <p>
            <b>Fecha:</b> {new Date().toLocaleString()}
          </p>
          <p>
            <b>Cliente:</b> {cliente?.nombres} {cliente?.apellidos}
          </p>
          <p>
            <b>NIT Cliente:</b> {cliente?.nit}
          </p>
          <p>
            <b>Vendedor:</b> {emailVendedor}
          </p>
          <hr />

          <p style={{ textAlign: "center", marginBottom: "5px" }}>
            <b>DETALLE DE COMPRA</b>
          </p>

          {detalles.map((d, i) => (
            <div key={i} style={{ marginBottom: "4px" }}>
              <p style={{ margin: 0 }}>{d.inventario.nombre}</p>
              <p
                style={{
                  margin: 0,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  {d.cantidad} - {d.unidadMedida}(s) x Q
                  {d.unidadMedidaId == UnidadMedidaEnum.unidad
                    ? (d.precioVentaConDescuento *
                      EquivalenciasConteoUnidades.unidad).toFixed(2)
                    : d.unidadMedidaId == UnidadMedidaEnum.docena
                    ? (d.precioVentaConDescuento *
                      EquivalenciasConteoUnidades.docena).toFixed(2)
                    : d.unidadMedidaId == UnidadMedidaEnum.caja
                    ? (d.precioVentaConDescuento * d.unidadesPorCaja).toFixed(2)
                    : d.unidadMedidaId == UnidadMedidaEnum.libra
                    ? (d.precioVentaConDescuento * EquivalenciasMasaLibras.libra).toFixed(2)
                    : d.unidadMedidaId == UnidadMedidaEnum.arroba
                    ? (d.precioVentaConDescuento * EquivalenciasMasaLibras.arroba).toFixed(2)
                    : d.unidadMedidaId == UnidadMedidaEnum.quintal
                    ? (d.precioVentaConDescuento *
                      EquivalenciasMasaLibras.quintal).toFixed(2)
                    : (d.precioVentaConDescuento).toFixed(2)}
                </span>
                <span>Q{d.total.toFixed(2)}</span>
              </p>
            </div>
          ))}

          <hr />

          <div style={{ textAlign: "right", lineHeight: "1.4" }}>
            <p style={{ margin: 0 }}>
              Total: <b>Q{total.toFixed(2)}</b>
            </p>
            <p style={{ margin: 0 }}>Pago: Q{pagoGlobal}</p>
            <p style={{ margin: 0, color: "green" }}>
              Vuelto: <b>Q{vuelto?.vuelto.toFixed(2)}</b>
            </p>
          </div>

          <hr />
          <p style={{ textAlign: "center", marginTop: "6px" }}>
            ¡Gracias por su compra! 🛒
          </p>
          <p style={{ textAlign: "center", fontSize: "10px", margin: "2px 0" }}>
            “Vuelva pronto”
          </p>
        </div>
      </div>
    </>
  );

  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;
    if (!printContents) return;
    const printWindow = window.open("", "", "width=600,height=600");
    printWindow?.document.write(`
    <html>
      <head>
        <title>Comprobante</title>
        <style>
          body { font-family: monospace; padding: 10px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 2px; font-size: 12px; }
        </style>
      </head>
      <body>${printContents}</body>
    </html>
  `);
    printWindow?.document.close();
    printWindow?.print();
  };

  useEffect(() => {
    const getCliente = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getClienteByVentaId(token, idVenta);
        if (data === 403) {
          return;
        }

        const cliente: Cliente = data as Cliente;
        setCliente(cliente);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    getCliente();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      //onClick={handleOverlayClick}
    >
      <Toaster position="top-center" richColors />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow">
          <div className="relative p-4 border-b border-gray-200 dark:border-gray-600 flex items-center">
            <h3 className="text-lg font-semibold mx-auto">Pago de venta</h3>
            <button
              type="button"
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
          <div>
            <div className="mb-2 flex items-center space-x-10 mt-4">
              <p>Total: </p>
              <p>
                <strong>Q. {Math.ceil(total * 100) / 100}</strong>
              </p>
            </div>
            {/* Tipos de pago seleccionables */}
            <div className="mb-2 mt-6">
              <p className="mb-2 font-medium">Tipos de pago:</p>
              <div className="flex space-x-4 items-center justify-center">
                <button
                  type="button"
                  onClick={() => setPaymentMethod(TipoPagoEnum.Efectivo)}
                  className={`px-4 py-2 rounded ${
                    paymentMethod === TipoPagoEnum.Efectivo
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Efectivo
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod(TipoPagoEnum.Tarjeta)}
                  className={`px-4 py-2 rounded bg-gray-200 opacity-50`}
                  disabled
                >
                  Tarjeta
                  <p className="text-[10px]">No disponible</p>
                </button>
              </div>
              {/* Nuevo: Input condicional solo si es efectivo */}
              {paymentMethod === TipoPagoEnum.Efectivo ? (
                <div className="mt-4">
                  <label
                    htmlFor="pago"
                    className="font-medium mb-1 block md:inline-block"
                  >
                    Pago recibido:
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full border rounded px-3 py-2"
                    id="pago"
                    {...register("pago", {
                      required: "El pago es requerido",
                    })}
                  />
                  {errors.pago && (
                    <span className="text-red-500 text-sm min-h-[1.25rem] block">
                      {errors.pago.message as string}
                    </span>
                  )}{" "}
                </div>
              ) : (
                <div className="mt-4">
                  <p>Pago con tarjeta no disponible</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-10 mt-4">
            <button
              onClick={onClose}
              id="btnCancelar"
              type="submit"
              className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btnProcesar"
              className="w-full bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800"
            >
              Confirmar
            </button>
          </div>
        </div>
      </form>
      {mostrarVuelto && <ModalVuelto vuelto={vuelto} />}
    </div>
  );
}
