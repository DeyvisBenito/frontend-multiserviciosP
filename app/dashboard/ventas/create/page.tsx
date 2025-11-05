'use client';

import { useValidateToken } from "@/app/lib/useValidateToken";
import VentaCreatePage from "@/app/ui/ventas/ventaFormCreate";

import { Toaster } from "sonner";

export default function CreateVentaPage() {
  useValidateToken();

  return (
      <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />

      <h1 className="sm:text-3xl font-bold mb-1 text-center">Agregar Venta</h1>
      <VentaCreatePage />
    </div>
  );
}
