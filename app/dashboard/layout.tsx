"use client";

import SideNav from "@/app/ui/dashboard/sidenav";
import { useValidateToken } from "@/app/lib/useValidateToken";
import { useUserRole } from "@/app/lib/decodeToken";

export default function Layout({ children }: { children: React.ReactNode }) {
  //useValidateToken();
  const role = useUserRole();

  return (
    <div className="flex flex-col md:flex-row">

      <div className="w-full md:w-64 md:sticky md:top-0 md:h-screen">
        <SideNav />
      </div>

      <div className="flex-1 p-6 md:p-12">
        {children}
      </div>
    </div>
  );
}
