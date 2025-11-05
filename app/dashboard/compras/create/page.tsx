'use client';

import { useValidateToken } from "@/app/lib/useValidateToken";
import CompraCreatePage from "@/app/ui/compras/compraFormCreate";

import { Toaster } from "sonner";

export default function CreateCompraPage() {
  useValidateToken();

  return (
      <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />

      <h1 className="sm:text-3xl font-bold mb-1 text-center">Agregar Compra</h1>
      <CompraCreatePage />
    </div>
  );
}
