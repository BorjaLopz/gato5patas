import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { iniciarSesionAnonima } from "../lib/auth";
import { yaVoto } from "../lib/votos";
import { Landing } from "../components/Landing";
import { NombreLogin } from "../components/NombreLogin";
import { FormularioVoto } from "../components/FormularioVoto";

const COLORES_CONFETI = ["#c67139", "#d67f48", "#7a8a5e", "#aebf92"];

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

    useEffect(() => {
        if (estado === "voto-guardado") {
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.5 },
                colors: COLORES_CONFETI,
                startVelocity: 40,
            });
        }
    }, [estado]);

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
                        gap: 18,
                    }}
                >
                    <div style={{ background: "var(--color-surface)", lineHeight: 0 }}>
                        <img
                            src="/logo.jpg"
                            alt=""
                            style={{ width: 90, height: "auto", mixBlendMode: "multiply", display: "block" }}
                        />
                    </div>

                    <h1 style={{ fontSize: 30, margin: 0 }}>¡Gracias, {nombre}!</h1>
                    <p style={{ margin: 0, fontSize: 18, color: "var(--color-neutral-700)", lineHeight: 1.5 }}>
                        Tu voto ya forma parte de esta celebración de los{" "}
                        <strong style={{ color: "var(--color-text)" }}>25 años del Gato de 5 Patas</strong>.
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