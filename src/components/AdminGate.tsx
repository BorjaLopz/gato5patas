import { useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { suscribirseAAuth, cerrarSesion } from "../lib/auth";
import { esOrganizador } from "../lib/admin";
import { AdminLogin } from "./AdminLogin";
import { useIsMobile } from "../lib/useIsMobile";

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
    const [menuAbierto, setMenuAbierto] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const esMobile = useIsMobile();

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

    useEffect(() => {
        setMenuAbierto(false);
    }, [location.pathname]);

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
            <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
                <div
                    className="nav"
                    style={{
                        borderBottom: "2px solid var(--color-accent-200)",
                        background: "var(--color-bg)",
                        flexWrap: "nowrap",
                    }}
                >
                    <div className="nav-brand" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <img
                            src="/logo.jpg"
                            alt=""
                            style={{ width: 40, height: "auto", mixBlendMode: "multiply", flex: "none" }}
                        />
                        <span>Admin</span>
                    </div>

                    {esMobile ? (
                        <button
                            className="btn btn-icon btn-ghost"
                            onClick={() => setMenuAbierto((a) => !a)}
                            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
                            aria-expanded={menuAbierto}
                        >
                            {menuAbierto ? (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M6 6l12 12M18 6L6 18" />
                                </svg>
                            ) : (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M4 7h16M4 12h16M4 17h16" />
                                </svg>
                            )}
                        </button>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>

                {esMobile && menuAbierto && (
                    <>
                        <div
                            onClick={() => setMenuAbierto(false)}
                            style={{ position: "fixed", inset: 0, zIndex: 49 }}
                        />
                        <div
                            className="card elev-lg"
                            style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                zIndex: 51,
                                borderRadius: 0,
                                padding: 8,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            {enlaces.map((enlace) => (
                                <Link
                                    key={enlace.to}
                                    to={enlace.to}
                                    aria-current={location.pathname === enlace.to ? "page" : undefined}
                                    style={{
                                        padding: "14px 16px",
                                        fontSize: 17,
                                        borderRadius: "var(--radius-md)",
                                        background: location.pathname === enlace.to ? "var(--color-accent-100)" : "transparent",
                                    }}
                                >
                                    {enlace.label}
                                </Link>
                            ))}
                            <button
                                className="btn btn-ghost"
                                onClick={salir}
                                style={{ padding: "14px 16px", fontSize: 17, textAlign: "left", justifyContent: "flex-start" }}
                            >
                                Salir
                            </button>
                        </div>
                    </>
                )}
            </div>
            {children}
        </div>
    );
}