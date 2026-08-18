import { useEffect, useState, type ReactNode } from "react";
import { suscribirseAAuth } from "../lib/auth";
import { esOrganizador } from "../lib/admin";

type Estado = "comprobando" | "autorizado" | "no-autorizado" | "sin-sesion";

export function RequiereOrganizador({ children }: { children: ReactNode }) {
    const [estado, setEstado] = useState<Estado>("comprobando");

    useEffect(() => {
        const unsubscribe = suscribirseAAuth(async (user) => {
            if (!user || !user.email) {
                setEstado("sin-sesion");
                return;
            }
            const autorizado = await esOrganizador(user.email);
            setEstado(autorizado ? "autorizado" : "no-autorizado");
        });
        return () => unsubscribe();
    }, []);

    if (estado === "comprobando") {
        return <p>Comprobando acceso...</p>;
    }

    if (estado === "sin-sesion") {
        return <p>Inicia sesión con tu email de organizador para acceder.</p>;
    }

    if (estado === "no-autorizado") {
        return <p role="alert">Esta sección es solo para organizadores.</p>;
    }

    return <>{children}</>;
}