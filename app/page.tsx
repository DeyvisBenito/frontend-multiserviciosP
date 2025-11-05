import Link from "next/link";
import Image from "next/image";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { luisitana } from "@/app/ui/fonts";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 md:h-52 rounded-lg bg-green-500 p-4 items-center justify-center">
        <h2 className="text-white text-center text text-2xl md:text-4xl">
          Bienvenido a caja Agropecuaria MP
        </h2>
      </div>
      <div className="mt-4 flex grow flex-col">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:px-20">
          <p
            className={`${luisitana.className} antialiased text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            <strong>Bienvenido</strong> Inicia sesión para acceder a la tienda{" "}.
          </p>
          <Link
            href="/auth/login"
            className="flex items-center gap-5 self-start rounded-lg bg-green-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
      </div>
    </main>
  );
}
