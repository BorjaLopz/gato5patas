import { useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { suscribirseAAuth, cerrarSesion } from "../lib/auth";
import { esOrganizador } from "../lib/admin";
import { AdminLogin } from "./AdminLogin";

type Estado = "comprobando" | "sin-sesion" | "no-autorizado" | "autorizado";

const centrado: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
};

export function AdminGate({ children }: { children: ReactNode }) {
    const [estado, setEstado] = useState<Estado>("comprobando");
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = suscribirseAAuth((usuarioActual) => {
            // Una sesión anónima (la que usan los votantes) NO cuenta como
            // sesión de organizador — sin este check, si alguien vota y luego
            // entra al panel de admin en la misma pestaña, la app se quedaba
            // "esperando" un email que una sesión anónima nunca tiene.
            if (usuarioActual && !usuarioActual.isAnonymous) {
                setUser(usuarioActual);
            } else {
                setUser(null);
                setEstado("sin-sesion");
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user?.email) return;
        esOrganizador(user.email).then((autorizado) => {
            setEstado(autorizado ? "autorizado" : "no-autorizado");
        });
    }, [user]);

    async function salir() {
        await cerrarSesion();
        setUser(null);
        setEstado("sin-sesion");
        // Al salir del panel de admin, volvemos a la portada pública de la
        // gala — no tiene sentido dejar a nadie en una URL de /resultados
        // mostrando otra vez el formulario de login.
        navigate("/");
    }

    if (estado === "comprobando") {
        return (
            <div style={centrado}>
                <p style={{ fontSize: 18 }}>Comprobando acceso...</p>
            </div>
        );
    }

    if (estado === "sin-sesion") {
        return <AdminLogin onLogin={setUser} />;
    }

    if (estado === "no-autorizado") {
        return (
            <div style={centrado}>
                <div
                    className="card elev-md"
                    style={{ maxWidth: 420, width: "100%", padding: "40px 32px", display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}
                >
                    <h2 style={{ fontSize: 24, margin: 0 }}>Sin acceso</h2>
                    <p style={{ margin: 0, fontSize: 16, color: "var(--color-neutral-700)" }}>
                        Esta cuenta no está autorizada como organizador.
                    </p>
                    <button className="btn btn-secondary" onClick={salir} style={{ fontSize: 15 }}>
                        Probar con otra cuenta
                    </button>
                </div>
            </div>
        );
    }

    const enlaces = [
        { to: "/resultados", label: "Resultados" },
        { to: "/votantes", label: "Votantes" },
        { to: "/configuracion", label: "Configuración" },
    ];

    return (
        <div>
            <div
                className="nav"
                style={{
                    borderBottom: "2px solid var(--color-accent-200)",
                    background: "var(--color-bg)",
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    flexWrap: "wrap",
                }}
            >
                <span className="nav-brand">Gala Gatuna — Admin</span>
                {enlaces.map((enlace) => (
                    <Link
                        key={enlace.to}
                        to={enlace.to}
                        aria-current={location.pathname === enlace.to ? "page" : undefined}
                    >
                        {enlace.label}
                    </Link>
                ))}
                <button className="btn btn-ghost" onClick={salir} style={{ marginLeft: "auto" }}>
                    Salir
                </button>
            </div>
            {children}
        </div>
    );
}