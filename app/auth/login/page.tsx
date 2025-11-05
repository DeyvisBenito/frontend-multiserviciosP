"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";

import { LoginConEmailI } from "../../lib/definitions";
import { loginConEmail } from "@/app/lib/api";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const userLogin: LoginConEmailI = {
      Email: data.email,
      Password: data.password,
    };

    try {
      const data = await loginConEmail(userLogin);
      localStorage.setItem("token", data.token);
      router.push("/dashboard/product");
    } catch (error: any) {
      toast.error(error.message);
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full">
      <Toaster position="top-center" richColors />

      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Login</h1>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
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
                message: "La Contraseña es requerida",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message as string}
            </span>
          )}

          <button className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors">
            Sign In
          </button>
          <Link
            href="/auth/recuperarPassword"
            className="text-gray-800 hover:text-gray-600 font-semibold transition-colors"
          >
            Recuperar contraseña
          </Link>
          {/*
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-2 text-gray-500 text-sm">O</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

           <Link
            href="/auth/register"
            className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow-md transition-colors inline-block"
          >
            Sign Up
          </Link> */}
        </div>
      </form>
    </div>
  );
}
