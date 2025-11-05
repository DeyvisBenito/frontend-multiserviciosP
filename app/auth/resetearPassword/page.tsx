"use client";

import ResetPasswordPage from "@/app/ui/resetPassword/resetPassword";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
