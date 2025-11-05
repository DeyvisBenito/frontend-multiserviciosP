"use client";

import { useRouter } from "next/navigation";

import { ButtonConfirmarCompra, CreateProduct } from "@/app/ui/products/buttons";
import { useValidateToken } from "@/app/lib/useValidateToken";
import { getCategorias } from "@/app/lib/api";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Categoria } from "@/app/lib/definitions";
import ListaCaja from "@/app/ui/caja/listaCaja";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CajaPage() {
  const router = useRouter();
  useValidateToken();
  const [hasConflict, setHasConflict] = useState<boolean>(false);

  // States for total and current page
  //const [total, setTotal] = useState(0);
  //const [page, setPage] = useState(1);
  // Products per page
  //const sizeProducts: number = 5;

  return (
    <div className="w-full">
      <Toaster position="top-center" richColors />
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Caja</h1>
      </div>
      <div className="mt-4 flex items-center gap-2 md:mt-8 text-end justify-end">
        <ButtonConfirmarCompra hasConflict={hasConflict}/>
      </div>
      <div>
        <h2>Productos por comprar:</h2>
      </div>
      <div>
        <ListaCaja onSetHasConflict={setHasConflict}/>
      </div>
    </div>
  );
}
