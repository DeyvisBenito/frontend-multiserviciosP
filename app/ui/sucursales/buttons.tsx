"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  EyeIcon,
} from "@heroicons/react/24/outline";


export function SeeSucursal({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/sucursales/details/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}

