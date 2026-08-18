import { useState } from "react";

interface Props {
    onContinuar: (nombre: string) => void;
    onVolver: () => void;
}

export function NombreLogin({ onContinuar, onVolver }: Props) {
    const [nombre, setNombre] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const limpio = nombre.trim();
        if (limpio.length < 3) {
            setError("Escribe tu nombre y apellidos completos.");
            return;
        }
        setError("");
        onContinuar(limpio);
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
            }}
        >
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
                <button
                    type="button"
                    onClick={onVolver}
                    className="btn btn-ghost"
                    style={{ alignSelf: "flex-start", fontSize: 15, paddingInline: 0 }}
                >
                    ← Volver
                </button>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                    <h1 style={{ fontSize: 32, margin: 0 }}>Accede para votar</h1>
                    <p style={{ margin: 0, fontSize: 18, color: "var(--color-neutral-700)" }}>
                        Escribe tu nombre y apellidos para empezar.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div className="field">
                        <label htmlFor="nombre">Nombre y apellidos</label>
                        <input
                            id="nombre"
                            className="input"
                            type="text"
                            autoComplete="name"
                            placeholder="Ana García"
                            style={{ fontSize: 18, padding: 16 }}
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    {error && (
                        <p role="alert" style={{ margin: 0, color: "var(--color-accent-700)", fontSize: 14 }}>
                            {error}
                        </p>
                    )}
                    <button type="submit" className="btn btn-primary btn-block" style={{ fontSize: 19, padding: 18 }}>
                        Continuar
                    </button>
                </form>

                <a href="/resultados" style={{ fontSize: 15, color: "var(--color-accent-700)" }}>
                    ¿Eres organizador/a? →
                </a>
            </div>
        </div>
    );
}