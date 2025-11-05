"use client";

import TablaBestClientes from "@/app/ui/reportes/tablaBestClientes";
import TablaBestProveedores from "@/app/ui/reportes/tablaBestProveedores";
import TablaComprasDelDia from "@/app/ui/reportes/tablaComprasDelDia";
import TablaVentasDelDia from "@/app/ui/reportes/tablaVentasDelDia";
import { useRef } from "react";
import { Toaster } from "sonner";

export default function PageReportes() {
  const ventasRef = useRef<HTMLDivElement | null>(null);
  const clientesRef = useRef<HTMLDivElement | null>(null);
  const comprasRef = useRef<HTMLDivElement | null>(null);
  const proveedoresRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = (ref: React.RefObject<HTMLDivElement | null>, titulo: string) => {
    if (!ref.current) return;

    const printContents = ref.current.innerHTML;
    const printWindow = window.open("", "", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>${titulo}</h2>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <Toaster position="top-center" richColors />
        <h1 className="text-2xl font-semibold">Reportes</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full p-4 border-t border-gray-500 mt-4">
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => handlePrint(ventasRef, "Ventas del Día")}
        >
          Ventas del Día
        </button>
        <button
          className="w-full bg-black text-white py-3 rounded-lg shadow hover:bg-gray-600 transition"
          onClick={() => handlePrint(clientesRef, "Mejores Clientes por cantidad de Ventas")}
        >
          Mejores Clientes
        </button>
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => handlePrint(comprasRef, "Compras del Día")}
        >
          Compras del Día
        </button>
        <button
          className="w-full bg-black text-white py-3 rounded-lg shadow hover:bg-gray-600 transition"
          onClick={() => handlePrint(proveedoresRef, "Mejores Proveedores por cantidad de Suministros")}
        >
          Mejores Proveedores
        </button>
      </div>

      {/* Render de las tablas en memoria para impresión */}
      <div className="hidden">
        <div ref={ventasRef}>
          <TablaVentasDelDia />
        </div>
        <div ref={clientesRef}>
          <TablaBestClientes />
        </div>
        <div ref={comprasRef}>
          <TablaComprasDelDia />
        </div>
        <div ref={proveedoresRef}>
          <TablaBestProveedores />
        </div>
      </div>
    </>
  );
}
