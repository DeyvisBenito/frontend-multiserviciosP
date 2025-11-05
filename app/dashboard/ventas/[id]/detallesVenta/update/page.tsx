"use client";
import { redirect, useParams } from "next/navigation";

export default function VentaPage() {
   const params = useParams();
    const idVenta = Array.isArray(params.id)
      ? params.id[0]
      : params.id;
  redirect(`/dashboard/ventas/${idVenta}/detallesVenta`);
}