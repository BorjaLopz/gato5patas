import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { obtenerConfiguracionVotacion, obtenerTodosLosVotos, agregarResultados } from "../lib/admin";
import { CATEGORIAS } from "../lib/categorias";
import { useIsMobile } from "../lib/useIsMobile";

type Estado = "comprobando" | "no-disponible" | "disponible";

// Colores de marca para el confeti (acento terracota + acento-2 salvia)
const COLORES_CONFETI = ["#c67139", "#d67f48", "#7a8a5e", "#aebf92"];

function lanzarConfeti() {
    confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.5 },
        colors: COLORES_CONFETI,
        startVelocity: 45,
        scalar: 1.1,
    });
}

export function ResultadosPublicosPage() {
    const [estado, setEstado] = useState<Estado>("comprobando");
    const [resultados, setResultados] = useState<Record<string, Record<string, number>> | null>(null);
    const [pasoActual, setPasoActual] = useState(0); // 0..CATEGORIAS.length-1 = categorías; == length = pantalla de gracias
    const [reveladas, setReveladas] = useState<Set<string>>(new Set());
    const esMobile = useIsMobile();

    useEffect(() => {
        obtenerConfiguracionVotacion().then(async (config) => {
            if (!config?.resultadosPublicos) {
                setEstado("no-disponible");
                return;
            }
            const votos = await obtenerTodosLosVotos();
            setResultados(agregarResultados(votos));
            setEstado("disponible");
        });
    }, []);

    const centrado: React.CSSProperties = {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    };

    if (estado === "comprobando") {
        return (
            <div style={centrado}>
                <p style={{ fontSize: 18 }}>Comprobando...</p>
            </div>
        );
    }

    if (estado === "no-disponible") {
        return (
            <div style={centrado}>
                <div
                    className="card elev-md"
                    style={{ maxWidth: 460, width: "100%", padding: "40px 32px", display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}
                >
                    <h1 style={{ fontSize: 26, margin: 0 }}>Resultados aún no disponibles</h1>
                    <p style={{ margin: 0, fontSize: 17, color: "var(--color-neutral-700)" }}>
                        Los ganadores se anunciarán pronto. ¡Vuelve más
                        tarde!
                    </p>
                    <a href="/" style={{ fontSize: 15, color: "var(--color-accent-700)" }}>
                        ← Volver al inicio
                    </a>
                </div>
            </div>
        );
    }

    const esPantallaFinal = pasoActual === CATEGORIAS.length;
    const esPrimero = pasoActual === 0;
    const esUltimaCategoria = pasoActual === CATEGORIAS.length - 1;

    function anterior() {
        if (pasoActual > 0) setPasoActual((p) => p - 1);
    }

    function siguiente() {
        if (pasoActual < CATEGORIAS.length) setPasoActual((p) => p + 1);
    }

    // ── Pantalla final de agradecimiento ──────────────────────────────
    if (esPantallaFinal) {
        return (
            <div>
                <main style={{ ...centrado, textAlign: "center" }}>
                    <div
                        className="card elev-md"
                        style={{ maxWidth: 460, width: "100%", padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
                    >
                        <img
                            src="/logo.jpg"
                            alt="Logo de El Gato de 5 Patas"
                            style={{ width: 100, height: "auto", mixBlendMode: "multiply" }}
                        />
                        <h1 style={{ fontSize: 28, margin: 0 }}>¡Gracias por celebrar con nosotros!</h1>
                        <p style={{ margin: 0, fontSize: 17, color: "var(--color-neutral-700)" }}>
                            Enhorabuena a todas las personas ganadoras, y gracias a toda la
                            familia gatuna por hacer posibles estos 25 años.
                        </p>
                        <a href="/" className="btn btn-primary" style={{ fontSize: 17, padding: "14px 32px", marginTop: 8 }}>
                            Volver al inicio
                        </a>
                    </div>
                </main>

                <div
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "var(--color-bg)",
                        borderTop: "2px solid var(--color-accent-200)",
                        padding: "16px 24px",
                        boxShadow: "var(--shadow-lg)",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ width: "100%", maxWidth: 760, display: "flex", justifyContent: "flex-start" }}>
                        <button className="btn btn-secondary" onClick={anterior} style={{ fontSize: 17, padding: "14px 28px" }}>
                            ← Anterior
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Pantalla de una categoría ─────────────────────────────────────
    const categoria = CATEGORIAS[pasoActual];
    const revelada = reveladas.has(categoria.id);

    const votosCategoria = resultados?.[categoria.id] ?? {};
    const nominadosOrdenados = [...categoria.nominados].sort(
        (a, b) => (votosCategoria[b.id] ?? 0) - (votosCategoria[a.id] ?? 0)
    );
    const totalCategoria = Object.values(votosCategoria).reduce((s, n) => s + n, 0);
    const ganador = nominadosOrdenados[0];
    const resto = nominadosOrdenados.slice(1);

    function revelar() {
        setReveladas((prev) => new Set(prev).add(categoria.id));
        lanzarConfeti();
    }

    return (
        <div>
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    background: "var(--color-bg)",
                    borderBottom: "2px solid var(--color-accent-200)",
                    padding: "16px 24px",
                    textAlign: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <img
                        src="/logo.jpg"
                        alt=""
                        style={{ width: 40, height: "auto", mixBlendMode: "multiply", flex: "none" }}
                    />
                    <h1 style={{ fontSize: 24, margin: 0 }}>25 años del Gato de 5 Patas</h1>
                </div>
                <span className="tag tag-accent" style={{ fontSize: 13, marginTop: 6, display: "inline-block" }}>
                    Categoría {pasoActual + 1} de {CATEGORIAS.length}
                </span>
            </div>

            <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 160px", display: "flex", flexDirection: "column", gap: 28, alignItems: "center", textAlign: "center" }}>
                <div>
                    <h2 style={{ fontSize: 30, margin: 0 }}>{categoria.titulo}</h2>
                    <p style={{ margin: "6px 0 0", fontSize: 16, color: "var(--color-neutral-700)" }}>{categoria.descripcion}</p>
                </div>

                {!revelada ? (
                    <>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 }}>
                            {categoria.nominados.map((n) => (
                                <div key={n.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 130 }}>
                                    {n.fotoUrl ? (
                                        <img src={n.fotoUrl} alt="" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--color-neutral-200)" }} />
                                    )}
                                    <span style={{ fontFamily: "var(--font-heading)", fontSize: 15 }}>{n.nombre}</span>
                                </div>
                            ))}
                        </div>

                        <button className="btn btn-primary" onClick={revelar} style={{ fontSize: 20, padding: "18px 40px" }}>
                            🎉 Revelar ganador/a
                        </button>
                    </>
                ) : (
                    <>
                        {totalCategoria > 0 ? (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                                    {ganador.fotoUrl ? (
                                        <img
                                            src={ganador.fotoUrl}
                                            alt=""
                                            style={{ width: 160, height: 160, borderRadius: "50%", objectFit: "cover", border: "5px solid var(--color-accent-500)" }}
                                        />
                                    ) : (
                                        <div
                                            style={{ width: 160, height: 160, borderRadius: "50%", background: "var(--color-neutral-200)", border: "5px solid var(--color-accent-500)" }}
                                        />
                                    )}
                                    <span className="tag tag-accent-2" style={{ fontSize: 14 }}>Ganador/a</span>
                                    <span style={{ fontFamily: "var(--font-heading)", fontSize: 28 }}>{ganador.nombre}</span>
                                    <span style={{ fontSize: 16, color: "var(--color-neutral-700)" }}>
                                        {votosCategoria[ganador.id] ?? 0} votos · {Math.round(((votosCategoria[ganador.id] ?? 0) / totalCategoria) * 100)}%
                                    </span>
                                </div>

                                {resto.length > 0 && (
                                    <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                                        {resto.map((n) => {
                                            const votos = votosCategoria[n.id] ?? 0;
                                            const pct = totalCategoria > 0 ? Math.round((votos / totalCategoria) * 100) : 0;
                                            return (
                                                <div key={n.id} style={{ display: "flex", alignItems: "center", gap: esMobile ? 8 : 12 }}>
                                                    {n.fotoUrl ? (
                                                        <img
                                                            src={n.fotoUrl}
                                                            alt=""
                                                            style={{ width: esMobile ? 28 : 36, height: esMobile ? 28 : 36, borderRadius: "50%", objectFit: "cover", flex: "none" }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: esMobile ? 28 : 36, height: esMobile ? 28 : 36, borderRadius: "50%", background: "var(--color-neutral-200)", flex: "none" }} />
                                                    )}
                                                    <span
                                                        style={{
                                                            fontSize: esMobile ? 13 : 15,
                                                            flex: "none",
                                                            width: esMobile ? 84 : 130,
                                                            textAlign: "left",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {n.nombre}
                                                    </span>
                                                    <div style={{ flex: 1, height: 10, borderRadius: 999, background: "var(--color-neutral-100)", overflow: "hidden" }}>
                                                        <div style={{ height: "100%", borderRadius: 999, background: "var(--color-accent-2-400)", width: `${pct}%` }} />
                                                    </div>
                                                    <span
                                                        style={{
                                                            fontSize: esMobile ? 12 : 13,
                                                            color: "var(--color-neutral-700)",
                                                            flex: "none",
                                                            width: esMobile ? 48 : 70,
                                                            textAlign: "right",
                                                        }}
                                                    >
                                                        {votos}{esMobile ? "" : " votos"}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p style={{ fontSize: 16, color: "var(--color-neutral-600)" }}>
                                Sin votos registrados en esta categoría.
                            </p>
                        )}
                    </>
                )}
            </main>

            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "var(--color-bg)",
                    borderTop: "2px solid var(--color-accent-200)",
                    padding: "16px 24px",
                    boxShadow: "var(--shadow-lg)",
                    display: "flex",
                    justifyContent: "center",
                    zIndex: 20,
                }}
            >
                <div style={{ width: "100%", maxWidth: 760, display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <button className="btn btn-secondary" onClick={anterior} disabled={esPrimero} style={{ fontSize: 17, padding: "14px 28px" }}>
                        ← Anterior
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={siguiente}
                        disabled={!revelada}
                        style={{ fontSize: 17, padding: "14px 28px" }}
                    >
                        {esUltimaCategoria ? "Finalizar →" : "Siguiente →"}
                    </button>
                </div>
            </div>
        </div>
    );
}