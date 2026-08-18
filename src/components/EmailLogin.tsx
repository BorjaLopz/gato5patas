import { useState } from "react";
import { enviarMagicLink } from "../lib/auth";

type Estado = "idle" | "enviando" | "enviado" | "error";

interface Props {
    esOrganizador?: boolean;
}

export function EmailLogin({ esOrganizador = false }: Props) {
    const [email, setEmail] = useState("");
    const [estado, setEstado] = useState<Estado>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!email.trim() || !email.includes("@")) {
            setEstado("error");
            setErrorMsg("Introduce un email válido");
            return;
        }

        setEstado("enviando");
        try {
            await enviarMagicLink(email);
            setEstado("enviado");
        } catch (err) {
            setEstado("error");
            setErrorMsg("No se ha podido enviar el correo. Inténtalo de nuevo.");
        }
    }

    const contenedorCentrado: React.CSSProperties = {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    };

    if (estado === "enviado") {
        return (
            <div style={contenedorCentrado}>
                <div
                    className="card elev-md"
                    style={{
                        width: "100%",
                        maxWidth: 420,
                        padding: "40px 32px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 20,
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: "var(--radius-lg)",
                            background: "var(--color-accent-2-100)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--color-accent-2-700)"
                            strokeWidth="2.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 4h16v16H4z"></path>
                            <path d="M4 6l8 7 8-7"></path>
                        </svg>
                    </div>
                    <h1 style={{ fontSize: 28, margin: 0 }}>Revisa tu correo</h1>
                    <p style={{ margin: 0, fontSize: 18, color: "var(--color-neutral-700)" }}>
                        Te hemos enviado un enlace a <strong>{email}</strong>. Ábrelo
                        para entrar{esOrganizador ? " al panel de resultados" : " a votar"}.
                    </p>
                    <p style={{ margin: 0, fontSize: 14, color: "var(--color-neutral-700)" }}>
                        Si no lo ves en la bandeja principal, revisa spam o
                        promociones.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={contenedorCentrado}>
            <div
                className="card elev-md"
                style={{
                    width: "100%",
                    maxWidth: 420,
                    padding: "40px 32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                    {esOrganizador && <span className="tag tag-accent-2">Acceso organizadores</span>}
                    <h1 style={{ fontSize: 32, margin: 0 }}>
                        {esOrganizador ? "Panel de resultados" : "Accede para votar"}
                    </h1>
                    <p style={{ margin: 0, fontSize: 18, color: "var(--color-neutral-700)" }}>
                        Te enviaremos un enlace a tu correo para entrar, sin contraseñas.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div className="field">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            className="input"
                            type="email"
                            autoComplete="email"
                            placeholder="tu@correo.com"
                            style={{ fontSize: 18, padding: 16 }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={estado === "enviando"}
                        />
                    </div>
                    {estado === "error" && (
                        <p role="alert" style={{ margin: 0, color: "var(--color-accent-700)", fontSize: 14 }}>
                            {errorMsg}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        style={{ fontSize: 19, padding: 18 }}
                        disabled={estado === "enviando"}
                    >
                        {estado === "enviando" ? "Enviando..." : "Enviar enlace de acceso"}
                    </button>
                </form>

                {!esOrganizador && (
                    <a href="/resultados" style={{ fontSize: 15, color: "var(--color-accent-700)" }}>
                        ¿Eres organizador/a? Ver resultados →
                    </a>
                )}
            </div>
        </div>
    );
}