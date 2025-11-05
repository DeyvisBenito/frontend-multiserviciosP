"use client"
import { redirect, useParams } from "next/navigation";

export default function VentaPage0() {
  const { id } = useParams<{ id: string }>();
  redirect(`/dashboard/ventas/${id}/detallesVenta`);
}

