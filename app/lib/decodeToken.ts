"use client";

import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

type JwtPayload = {
    Email: string;
    usuarioId: string;
    rol?: string;
    sucursalId?: string;
    exp: number;
};

export function useUserRole() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = jwtDecode<JwtPayload>(token);
                if (decoded.rol) {
                    setRole(decoded.rol);
                }
            }
        } catch (error) {
            setRole(null);
        }
    }, []);

    return role;
}

export function useUserSucursal() {
    const [sucursal, setSucursal] = useState<string | null>(null);

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = jwtDecode<JwtPayload>(token);
                if (decoded.sucursalId) {
                    setSucursal(decoded.sucursalId);
                }
            }
        } catch (error) {
            setSucursal(null);
        }
    }, []);

    return sucursal;
}

export function useUserEmail() {
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = jwtDecode<JwtPayload>(token);
                if (decoded.Email) {
                    setEmail(decoded.Email);
                }
            }
        } catch (error) {
            setEmail(null);
        }
    }, []);

    return email;
}