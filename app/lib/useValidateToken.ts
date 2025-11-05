"use client";

import { useRouter } from "next/navigation";

import { validateToken } from "./api";

import { useEffect } from "react";
import { toast } from "sonner";
import { useUserRole } from "./decodeToken";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// Funcion para validar token 
export function useValidateToken() {
    const router = useRouter();

    useEffect(() => {
        const validateTokenEffect = async (): Promise<void> => {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("No tienes acceso a este recurso", {
                    description: "Por favor, inicia sesión",
                });
                await sleep(2000);
                router.push("/auth/login");
                return;
            }
            try {
                const tokenValido = await validateToken(token)
                if (!tokenValido) {
                    toast.error("No tienes acceso a este recurso", {
                        description: "Por favor, inicia sesión",
                    });
                    await sleep(2000);
                    localStorage.removeItem("token");
                    router.push("/auth/login");
                }

            } catch (err: any) {
                toast.error("No tienes acceso a este recurso", {
                    description: "Por favor, inicia sesión",
                });
                await sleep(2000);
                localStorage.removeItem("token");
                router.push("/auth/login");
            }
        };

        validateTokenEffect();
    }, [router]);

    return;
}

export function useValidateAdmin() {
    const router = useRouter();
    const role = useUserRole();
    useEffect(() => {
        const validarAdmin = async () => {
            if (role === null) return; 
            if (role !== 'admin') {
                toast.error("No tienes acceso a este recurso", {
                    description: "Por favor, solicita a tu gerente para acceder",
                });
                router.push("/dashboard/product");
                return;
            }
        }

        validarAdmin();
    }, [router, role]);

    return;
}
