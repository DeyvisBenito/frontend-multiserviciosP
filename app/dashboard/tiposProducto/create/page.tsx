'use client';

import { useValidateAdmin, useValidateToken } from "@/app/lib/useValidateToken";
import TipoProductFormCreate from "@/app/ui/tiposProducto/tipoProductoFormCreate";

import { Toaster } from "sonner";

export default function PageCreateTipoProduct() {
  useValidateToken();
  useValidateAdmin();

  return (
      <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />

      <h1 className="sm:text-3xl font-bold mb-1 text-center">Agregar Tipo de produto</h1>
      <TipoProductFormCreate />
    </div>
  );
}
