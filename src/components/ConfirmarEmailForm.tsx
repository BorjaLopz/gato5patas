import { useState } from "react";

interface Props {
    onConfirmar: (email: string) => void;
    enviando: boolean;
    error?: string;
}

export function ConfirmarEmailForm({ onConfirmar, enviando, error }: Props) {
    const [email, setEmail] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) return;
        onConfirmar(email.trim());
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
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                    <h1 style={{ fontSize: 30, margin: 0 }}>Confirma tu correo</h1>
                    <p style={{ margin: 0, fontSize: 18, color: "var(--color-neutral-700)" }}>
                        Para terminar de entrar, escribe el mismo correo al que te
                        enviamos el enlace de acceso.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div className="field">
                        <label htmlFor="email-confirmar">Correo electrónico</label>
                        <input
                            id="email-confirmar"
                            className="input"
                            type="email"
                            autoComplete="email"
                            placeholder="tu@correo.com"
                            style={{ fontSize: 18, padding: 16 }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={enviando}
                        />
                    </div>

                    {error && (
                        <p role="alert" style={{ margin: 0, color: "var(--color-accent-700)", fontSize: 15 }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        style={{ fontSize: 19, padding: 18 }}
                        disabled={enviando}
                    >
                        {enviando ? "Comprobando..." : "Continuar"}
                    </button>
                </form>
            </div>
        </div>
    );
}