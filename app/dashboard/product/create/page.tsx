'use client';

import { useValidateToken } from "@/app/lib/useValidateToken";
//import ProductFormCreate from "@/app/ui/products/productoFormCreate";

import { Toaster, toast } from "sonner";

export default function PageCreateProduct() {
  useValidateToken();

  return (
      <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />

      <h1 className="sm:text-3xl font-bold mb-1 text-center">Agregar producto al inventario</h1>
     {/* <ProductFormCreate/> */}
    </div>
  );
}
