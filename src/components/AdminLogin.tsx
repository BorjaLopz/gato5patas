import { useState } from "react";
import { Link } from "react-router-dom";
import { iniciarSesionOrganizador } from "../lib/auth";
import type { User } from "firebase/auth";

interface Props {
    onLogin: (user: User) => void;
}

export function AdminLogin({ onLogin }: Props) {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!usuario.trim() || !password) {
            setError("Rellena usuario y contraseña.");
            return;
        }
        setEnviando(true);
        setError("");
        try {
            const user = await iniciarSesionOrganizador(usuario, password);
            onLogin(user);
        } catch {
            setError("Usuario o contraseña incorrectos.");
        } finally {
            setEnviando(false);
        }
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
                <Link
                    to="/"
                    className="btn btn-ghost"
                    style={{ alignSelf: "flex-start", fontSize: 15, paddingInline: 0 }}
                >
                    ← Volver
                </Link>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                    <span className="tag tag-accent-2">Acceso organizadores</span>
                    <h1 style={{ fontSize: 30, margin: 0 }}>Panel de administración</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div className="field">
                        <label htmlFor="usuario">Usuario</label>
                        <input
                            id="usuario"
                            className="input"
                            type="text"
                            autoComplete="username"
                            style={{ fontSize: 18, padding: 16 }}
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            disabled={enviando}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            className="input"
                            type="password"
                            autoComplete="current-password"
                            style={{ fontSize: 18, padding: 16 }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={enviando}
                        />
                    </div>
                    {error && (
                        <p role="alert" style={{ margin: 0, color: "var(--color-accent-700)", fontSize: 14 }}>
                            {error}
                        </p>
                    )}
                    <button type="submit" className="btn btn-primary btn-block" style={{ fontSize: 19, padding: 18 }} disabled={enviando}>
                        {enviando ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}