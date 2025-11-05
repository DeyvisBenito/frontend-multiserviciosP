"use client";
import { redirect, useParams } from "next/navigation";

export default function CompraPage() {
   const params = useParams();
    const idCompra = Array.isArray(params.id)
      ? params.id[0]
      : params.id;
  redirect(`/dashboard/compras/${idCompra}/detallesCompra`);
}