import { useEffect, useState } from "react";
import { obtenerTodosLosVotos, agregarResultados } from "../lib/admin";
import { CATEGORIAS } from "../lib/categorias";
import { AdminGate } from "../components/AdminGate";

function ResultadosContenido() {
    const [resultados, setResultados] = useState<Record<
        string,
        Record<string, number>
    > | null>(null);
    const [totalVotantes, setTotalVotantes] = useState(0);

    useEffect(() => {
        obtenerTodosLosVotos().then((votos) => {
            setResultados(agregarResultados(votos));
            setTotalVotantes(votos.length);
        });
    }, []);

    if (!resultados) {
        return (
            <div style={{ padding: 24 }}>
                <p style={{ fontSize: 18 }}>Cargando resultados...</p>
            </div>
        );
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <h1 style={{ fontSize: 26, margin: 0 }}>Resultados de las votaciones</h1>
                    <span style={{ fontSize: 15, color: "var(--color-neutral-700)" }}>
                        {totalVotantes} votos registrados en total
                    </span>
                </div>
            </div>

            <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 64px", display: "flex", flexDirection: "column", gap: 48 }}>
                {CATEGORIAS.map((categoria) => {
                    const votosCategoria = resultados[categoria.id] ?? {};
                    const nominadosOrdenados = [...categoria.nominados].sort(
                        (a, b) => (votosCategoria[b.id] ?? 0) - (votosCategoria[a.id] ?? 0)
                    );
                    const totalCategoria = Object.values(votosCategoria).reduce((s, n) => s + n, 0);
                    const maxVotos = Math.max(0, ...Object.values(votosCategoria));

                    return (
                        <section key={categoria.id} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span className="tag tag-accent" style={{ fontSize: 15 }}>{categoria.titulo}</span>
                                <span style={{ fontSize: 15, color: "var(--color-neutral-700)" }}>{totalCategoria} votos</span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {nominadosOrdenados.map((nominado) => {
                                    const votos = votosCategoria[nominado.id] ?? 0;
                                    const pct = totalCategoria > 0 ? Math.round((votos / totalCategoria) * 100) : 0;
                                    const esGanador = votos === maxVotos && votos > 0;
                                    return (
                                        <div
                                            key={nominado.id}
                                            className="card"
                                            style={{
                                                padding: "16px 20px",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 10,
                                                borderColor: esGanador ? "var(--color-accent-500)" : undefined,
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                                                <span style={{ fontFamily: "var(--font-heading)", fontSize: 19 }}>{nominado.nombre}</span>
                                                <span style={{ fontSize: 16, color: "var(--color-neutral-700)", whiteSpace: "nowrap" }}>
                                                    {votos} votos · {pct}%
                                                </span>
                                            </div>
                                            <div style={{ height: 16, borderRadius: 999, background: "var(--color-neutral-100)", overflow: "hidden" }}>
                                                <div
                                                    style={{
                                                        height: "100%",
                                                        borderRadius: 999,
                                                        background: esGanador ? "var(--color-accent-500)" : "var(--color-accent-2-400)",
                                                        width: `${pct}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </main>
        </div>
    );
}

export function ResultadosPage() {
    return (
        <AdminGate>
            <ResultadosContenido />
        </AdminGate>
    );
}