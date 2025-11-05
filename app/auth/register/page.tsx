"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

import {
  LoginConEmailI,
  RegisterConEmail,
  Sucursal,
} from "../../lib/definitions";
import { getSucursales, getUsuarioByEmailBool, registro } from "@/app/lib/api";
import { estados } from "@/app/lib/utilities/estadosEnum";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [sucursales, setSucursales] = useState<Sucursal[] | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    const token = localStorage.getItem("token");
    if (data.password !== data.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const userLogin: RegisterConEmail = {
      Email: data.email,
      Password: data.password,
      SucursalId: data.sucursal,
    };

    try {
      const emailTrim = userLogin.Email.trim();
      const userExist = await getUsuarioByEmailBool(token, emailTrim);
      if (userExist) {
        toast.custom(
          (t) => (
            <div className="bg-white p-4 border border-orange-400 rounded shadow-md flex flex-col gap-2 w-80">
              <p className="text-gray-800 text-sm font-medium">
                El usuario ya existe, pero está{" "}
                <span className="font-bold text-red-500">eliminado</span>.
              </p>
              <p className="text-gray-700 text-sm">
                ¿Deseas reactivarlo con la nueva contraseña y sucursal asignada?
              </p>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    toast.dismiss(t);
                    return;
                  }}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(t);
                    registrarUsuario(data);
                    return;
                  }}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                >
                  Reactivar
                </button>
              </div>
            </div>
          ),
          {
            duration: Infinity, 
            dismissible: true, 
          }
        );
      }else{
        registrarUsuario(data);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  });

  const registrarUsuario = async (data: any) => {
    const token = localStorage.getItem("token");
    const userLogin: RegisterConEmail = {
      Email: data.email,
      Password: data.password,
      SucursalId: data.sucursal,
    };
    try {
      const data = await registro(token, userLogin);
      if (data === 403) {
        toast.error("No tienes acceso a este recurso", {
          description: "Por favor, inicie sesion",
        });
        await sleep(2000);
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      toast.success("Vendedor agregado con existo", {
        description: "Volviendo al dashboard...",
      });
      await sleep(1500);
      router.push("/dashboard/usuarios");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchGetData = async () => {
      try {
        const data = await getSucursales(token);
        if (data === 403) {
          toast.error("No tienes acceso a este recurso", {
            description: "Por favor, inicie sesion",
          });
          await sleep(2000);
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        const sucursalesData: Sucursal[] = data as Sucursal[];
        setSucursales(sucursalesData);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchGetData();
  }, [router]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          {/* Correo electronico */}
          <label htmlFor="email" className="font-medium">
            Correo electrónico
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="email"
            id="email"
            {...register("email", {
              required: {
                value: true,
                message: "El Correo Electrónico es requerido",
              },
            })}
          />

          {errors.email && (
            <span className="text-red-500 text-sm">
              {errors.email.message as string}
            </span>
          )}

          {/* Sucursal */}
          {sucursales && (
            <>
              <label htmlFor="sucursal" className="font-medium mt-4">
                Sucursal:
              </label>
              <select
                id="sucursal"
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
                {...register("sucursal", {
                  required: "La sucursal es requerida",
                })}
              >
                <option value="">Seleccione una sucursal</option>
                {sucursales
                  .filter((s) => s.estadoId === estados.Activo)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
              </select>
              {errors.sucursal && (
                <span className="text-red-500 text-sm">
                  {errors.sucursal.message as string}
                </span>
              )}
            </>
          )}

          {/* Password */}
          <label htmlFor="password" className="font-medium mt-4">
            Contraseña
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="password"
            id="password"
            {...register("password", {
              required: {
                value: true,
                message: "La contraseña es requerida",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message as string}
            </span>
          )}

          {/* Confirmar password */}
          <label htmlFor="confirmPassword" className="font-medium mt-4">
            Confirmar Contraseña
          </label>
          <input
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "El confirmar contraseña es requerida",
              },
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message as string}
            </span>
          )}

          <button className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors">
            Register
          </button>

          <Link
            href="/dashboard/usuarios"
            className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow-md transition-colors inline-block"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
