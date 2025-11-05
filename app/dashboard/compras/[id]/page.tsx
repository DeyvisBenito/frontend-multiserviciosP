"use client"
import { redirect, useParams } from "next/navigation";

export default function CompraPage() {
  const { id } = useParams<{ id: string }>();
  redirect(`/dashboard/compras/${id}/detallesCompra`);
}

