import Image from "next/image";
import {
  UpdateProduct,
  DeleteProduct,
  SeeProduct,
  AddProductoToCart,
} from "@/app/ui/products/buttons";

import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "@/app/lib/utils";
import { Inventario } from "@/app/lib/definitions";
import { useUserRole, useUserSucursal } from "@/app/lib/decodeToken";
import { rolEnum } from "@/app/lib/utilities/rolEnum";

export default function ListaProductos({
  inventarios,
  onDeleted,
}: {
  inventarios: Inventario[];
  onDeleted: (id: number) => void;
}) {
  const role = useUserRole();
  const sucursalId = useUserSucursal();

  const inventariosFiltrados = inventarios.filter((inv) => {
    if (role === rolEnum.admin) return true; 
    if (role === rolEnum.vendedor) return inv.sucursalId === Number(sucursalId); 
    return false; 
  });

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {inventariosFiltrados?.map((inventario) => (
        <div
          key={inventario.id}
          className="rounded-lg bg-white shadow p-4 flex flex-col"
        >
          {/* Imagen */}
          <div className="mb-4 h-48 w-full overflow-hidden rounded-lg">
            <img
              src={inventario.urlFoto}
              alt={inventario.nombre}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Nombre */}
          <h2 className="text-lg font-semibold mb-1">{inventario.nombre}</h2>

          {/* Estado */}
          <p
            className={`mb-1 font-medium ${
              inventario.estado === "Activo" ? "text-green-600" : "text-red-600"
            }`}
          >
            {inventario.estado}
          </p>

          {/* Codigo */}
          <p className="text-gray-500 mb-1">Codigo: {inventario.codigo}</p>
          
          {/* Sucursal */}
          <p className="text-gray-500 mb-1">Sucursal: {inventario.sucursal}</p>

          {/* Stock */}
          <p className="text-gray-500 mb-1">Stock: {inventario.stock}</p>

          {/* Precio */}
          <p className="text-xl font-bold mb-2">
            {formatCurrency(inventario.precioVenta)}
          </p>

          {/* Acciones */}
          <div className="mt-auto flex gap-2 justify-end">
            <SeeProduct id={inventario.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
