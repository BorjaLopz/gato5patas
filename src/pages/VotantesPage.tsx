import { useEffect, useState } from "react";
import { obtenerTodosLosVotos, eliminarVoto, type Voto } from "../lib/admin";
import { AdminGate } from "../components/AdminGate";
import { useIsMobile } from "../lib/useIsMobile";
function VotantesContenido() {
    const [votos, setVotos] = useState<Voto[] | null>(null);
    const [votoAConfirmar, setVotoAConfirmar] = useState<Voto | null>(null);
    const [eliminando, setEliminando] = useState(false);
    const esMobile = useIsMobile();

    function cargar() {
        obtenerTodosLosVotos().then((lista) => {
            lista.sort((a, b) => (a.nombre ?? "").localeCompare(b.nombre ?? ""));
            setVotos(lista);
        });
    }

    useEffect(() => {
        cargar();
    }, []);

    async function confirmarEliminar() {
        if (!votoAConfirmar) return;
        setEliminando(true);
        try {
            await eliminarVoto(votoAConfirmar.votoId);
            setVotoAConfirmar(null);
            cargar();
        } finally {
            setEliminando(false);
        }
    }

    if (!votos) {
        return (
            <div style={{ padding: 24 }}>
                <p style={{ fontSize: 18 }}>Cargando votantes...</p>
            </div>
        );
    }

    return (
        <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 64px" }}>
            <h1 style={{ fontSize: 24, marginBottom: 8 }}>Votantes</h1>
            <p style={{ marginTop: 0, color: "var(--color-neutral-700)" }}>
                {votos.length} personas han votado hasta ahora.
            </p>

            {esMobile ? (
                // ── Vista de tarjetas apiladas, más cómoda en pantallas estrechas ──
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {votos.map((voto) => (
                        <div
                            key={voto.votoId}
                            className="card"
                            style={{ display: "flex", flexDirection: "column", gap: 6, padding: 14 }}
                        >
                            <span style={{ fontFamily: "var(--font-heading)", fontSize: 16 }}>
                                {voto.nombre || (
                                    <em style={{ color: "var(--color-neutral-500)", fontFamily: "var(--font-body)" }}>
                                        (voto sin nombre — {voto.votoId})
                                    </em>
                                )}
                            </span>
                            <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>
                                {voto.timestamp?.toDate ? voto.timestamp.toDate().toLocaleString("es-ES") : "—"}
                            </span>
                            <button
                                className="btn btn-ghost"
                                style={{ color: "var(--color-accent-700)", alignSelf: "flex-start", paddingInline: 0 }}
                                onClick={() => setVotoAConfirmar(voto)}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                // ── Vista de tabla normal en escritorio ──
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {votos.map((voto) => (
                            <tr key={voto.votoId}>
                                <td>
                                    {voto.nombre || (
                                        <em style={{ color: "var(--color-neutral-500)" }}>
                                            (voto de prueba antiguo, sin nombre — ID: {voto.votoId})
                                        </em>
                                    )}
                                </td>
                                <td>
                                    {voto.timestamp?.toDate
                                        ? voto.timestamp.toDate().toLocaleString("es-ES")
                                        : "—"}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-ghost"
                                        style={{ color: "var(--color-accent-700)" }}
                                        onClick={() => setVotoAConfirmar(voto)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {votoAConfirmar && (
                <div className="dialog-backdrop" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <div className="dialog" style={{ maxWidth: 440, width: "100%" }}>
                        <h2 className="dialog-title">Eliminar voto</h2>
                        <div className="dialog-body">
                            ¿Seguro que quieres eliminar el voto de{" "}
                            <strong>{votoAConfirmar.nombre || votoAConfirmar.votoId}</strong>?
                            Esta acción no se puede deshacer.
                        </div>
                        <div className="dialog-actions">
                            <button className="btn btn-ghost" onClick={() => setVotoAConfirmar(null)} disabled={eliminando}>
                                Cancelar
                            </button>
                            <button className="btn btn-primary" onClick={confirmarEliminar} disabled={eliminando}>
                                {eliminando ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export function VotantesPage() {
    return (
        <AdminGate>
            <VotantesContenido />
        </AdminGate>
    );
}