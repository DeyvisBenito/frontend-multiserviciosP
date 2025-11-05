"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import NavLinks from "@/app/ui/dashboard/nav-links";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useUserRole } from "@/app/lib/decodeToken";

export default function SideNav() {
  const router = useRouter();
  const role = useUserRole();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    localStorage.removeItem("token");
    router.push("/auth/login");
  };
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
      {role === "admin" ? (
        <div className="mb-2 flex h-20 items-center justify-center rounded-md bg-green-500 p-4 md:h-40 text-white">
          Gestión de Productos
        </div>
      ) : (
        <div className="mb-2 flex h-20 items-center justify-center rounded-md bg-green-500 p-4 md:h-40 text-white">
          Caja AgroServicios Pineda
        </div>
      )}

      <div className="flex grow flex-row justify-start space-x-2 overflow-x-auto md:flex-col md:space-x-0 md:space-y-2 md:overflow-x-visible scrollbar-hide">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form onSubmit={onSubmit}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Cerrar Sesión</div>
          </button>
        </form>
      </div>
    </div>
  );
}
