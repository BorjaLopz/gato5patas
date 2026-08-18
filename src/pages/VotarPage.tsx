import { useState } from "react";
import { iniciarSesionAnonima } from "../lib/auth";
import { yaVoto } from "../lib/votos";
import { Landing } from "../components/Landing";
import { NombreLogin } from "../components/NombreLogin";
import { FormularioVoto } from "../components/FormularioVoto";

type Estado =
    | "landing"
    | "login"
    | "comprobando-voto"
    | "aviso-repetido"
    | "puede-votar"
    | "voto-guardado"
    | "error";

export function VotarPage() {
    const [estado, setEstado] = useState<Estado>("landing");
    const [nombre, setNombre] = useState<string>("");

    async function empezarAVotar() {
        // Login anónimo silencioso: da una barrera real en las Security Rules
        // (request.auth != null) sin pedir ningún dato a la persona.
        try {
            await iniciarSesionAnonima();
            setEstado("login");
        } catch {
            setEstado("error");
        }
    }

    async function continuarConNombre(nombreEscrito: string) {
        setNombre(nombreEscrito);
        setEstado("comprobando-voto");
        try {
            const votoExistente = await yaVoto(nombreEscrito);
            setEstado(votoExistente ? "aviso-repetido" : "puede-votar");
        } catch {
            setEstado("error");
        }
    }

    function volverAlInicio() {
        setNombre("");
        setEstado("landing");
    }

    const centrado: React.CSSProperties = {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    };

    if (estado === "landing") {
        return <Landing onVotar={empezarAVotar} />;
    }

    if (estado === "login") {
        return <NombreLogin onContinuar={continuarConNombre} onVolver={volverAlInicio} />;
    }

    if (estado === "comprobando-voto") {
        return (
            <div style={centrado}>
                <p style={{ fontSize: 18 }}>Comprobando...</p>
            </div>
        );
    }

    if (estado === "error") {
        return (
            <div style={centrado}>
                <p role="alert" style={{ fontSize: 18 }}>
                    Ha ocurrido un error. Vuelve a intentarlo en unos segundos.
                </p>
            </div>
        );
    }

    if (estado === "aviso-repetido") {
        return (
            <div style={centrado}>
                <div
                    className="card elev-md"
                    style={{ maxWidth: 460, width: "100%", padding: "40px 32px", display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}
                >
                    <h2 style={{ fontSize: 26, margin: 0 }}>Ya has votado antes</h2>
                    <p style={{ margin: 0, fontSize: 17, color: "var(--color-neutral-700)" }}>
                        Con el nombre "{nombre}" ya se había registrado una votación.
                        Si continúas, tu nueva elección sustituirá a la anterior.
                    </p>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button className="btn btn-primary" onClick={() => setEstado("puede-votar")} style={{ fontSize: 16 }}>
                            Continuar (sustituye mi voto anterior)
                        </button>
                        <button className="btn btn-secondary" onClick={volverAlInicio} style={{ fontSize: 16 }}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (estado === "puede-votar") {
        return (
            <FormularioVoto
                nombre={nombre}
                onVotoCompletado={() => setEstado("voto-guardado")}
                onSalir={volverAlInicio}
            />
        );
    }

    if (estado === "voto-guardado") {
        return (
            <div style={centrado}>
                <div
                    className="card elev-md"
                    style={{
                        maxWidth: 460,
                        width: "100%",
                        padding: "48px 32px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            background: "var(--color-accent-2-100)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-700)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                    </div>
                    <h1 style={{ fontSize: 30, margin: 0 }}>¡Has votado con éxito!</h1>
                    <p style={{ margin: 0, fontSize: 18, color: "var(--color-neutral-700)" }}>
                        Gracias por participar en la Gala Gatuna. Tu votación se ha
                        registrado correctamente.
                    </p>
                    <button className="btn btn-primary" onClick={volverAlInicio} style={{ fontSize: 16, marginTop: 8 }}>
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return null;
}