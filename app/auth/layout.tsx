'use client'
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen w-screen">
      <Image
        src="/layoutsImg/fondoAuth.png"
        fill
        alt="Fondo Auth"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
