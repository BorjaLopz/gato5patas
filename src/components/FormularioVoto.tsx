import { useState } from "react";
import { CATEGORIAS } from "../lib/categorias";
import { guardarVoto } from "../lib/votos";
import { useIsMobile } from "../lib/useIsMobile";

interface Props {
    nombre: string;
    onVotoCompletado: () => void;
    onSalir: () => void;
}

type Estado = "votando" | "confirmando" | "enviando" | "error";

export function FormularioVoto({ nombre, onVotoCompletado, onSalir }: Props) {
    const [pasoActual, setPasoActual] = useState(0);
    const [selecciones, setSelecciones] = useState<Record<string, string>>({});
    const [estado, setEstado] = useState<Estado>("votando");
    const esMobile = useIsMobile();

    const categoria = CATEGORIAS[pasoActual];
    const esPrimero = pasoActual === 0;
    const esUltimo = pasoActual === CATEGORIAS.length - 1;
    const categoriaRespondida = !!selecciones[categoria.id];
    const totalRespondidas = Object.keys(selecciones).length;
    const progresoPct = Math.round((totalRespondidas / CATEGORIAS.length) * 100);

    function seleccionar(nominadoId: string) {
        setSelecciones((prev) => ({ ...prev, [categoria.id]: nominadoId }));
    }

    function siguiente() {
        if (!esUltimo) setPasoActual((p) => p + 1);
    }

    function anterior() {
        if (!esPrimero) setPasoActual((p) => p - 1);
    }

    function rellenarParaPruebas() {
        const todasSeleccionadas = Object.fromEntries(
            CATEGORIAS.map((cat) => [cat.id, cat.nominados[0].id])
        );
        setSelecciones(todasSeleccionadas);
        setPasoActual(CATEGORIAS.length - 1);
    }

    async function confirmarEnvio() {
        setEstado("enviando");
        try {
            await guardarVoto(nombre, selecciones);
            // El padre (VotarPage) se encarga de mostrar la pantalla de éxito
            // y de cerrar la sesión al terminar.
            onVotoCompletado();
        } catch (err) {
            setEstado("error");
        }
    }

    const contenedorCentrado: React.CSSProperties = {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    };

    if (estado === "confirmando") {
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
                    }}
                >
                    <h1 style={{ fontSize: 26, margin: 0 }}>Revisa tu votación</h1>
                    <p style={{ margin: 0, fontSize: 15, color: "var(--color-neutral-700)" }}>
                        Comprueba que todo esté bien antes de enviar.
                    </p>
                </div>

                <main style={{ maxWidth: 640, margin: "0 auto", padding: esMobile ? "16px 16px 140px" : "24px 24px 140px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {CATEGORIAS.map((cat) => {
                            const nominadoId = selecciones[cat.id];
                            const nominado = cat.nominados.find((n) => n.id === nominadoId);
                            return (
                                <div
                                    key={cat.id}
                                    style={{
                                        display: "flex",
                                        flexDirection: esMobile ? "column" : "row",
                                        alignItems: esMobile ? "flex-start" : "center",
                                        justifyContent: esMobile ? "flex-start" : "space-between",
                                        gap: esMobile ? 8 : 16,
                                        padding: esMobile ? "12px 0" : "14px 0",
                                        borderBottom: "2px solid var(--color-accent-100)",
                                    }}
                                >
                                    <span style={{ fontSize: esMobile ? 13 : 16, color: "var(--color-neutral-700)" }}>{cat.titulo}</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: esMobile ? 10 : 12 }}>
                                        {nominado?.fotoUrl ? (
                                            <img
                                                src={nominado.fotoUrl}
                                                alt=""
                                                style={{ width: esMobile ? 40 : 52, height: esMobile ? 40 : 52, borderRadius: "50%", objectFit: "cover", flex: "none" }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: esMobile ? 40 : 52,
                                                    height: esMobile ? 40 : 52,
                                                    borderRadius: "50%",
                                                    background: "var(--color-neutral-200)",
                                                    flex: "none",
                                                }}
                                            />
                                        )}
                                        <span style={{ fontFamily: "var(--font-heading)", fontSize: esMobile ? 16 : 19 }}>{nominado?.nombre}</span>
                                    </div>
                                </div>
                            );
                        })}
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
                        padding: esMobile ? "12px 16px" : "16px 24px",
                        boxShadow: "var(--shadow-lg)",
                        display: "flex",
                        justifyContent: "center",
                        zIndex: 20,
                    }}
                >
                    <div style={{ width: "100%", maxWidth: 640, display: "flex", justifyContent: "space-between", gap: esMobile ? 10 : 16 }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setEstado("votando")}
                            style={{ fontSize: esMobile ? 14 : 17, padding: esMobile ? "12px 14px" : "14px 28px" }}
                        >
                            {esMobile ? "← Revisar" : "Volver a revisar"}
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={confirmarEnvio}
                            style={{ fontSize: esMobile ? 14 : 17, padding: esMobile ? "12px 14px" : "14px 28px" }}
                        >
                            {esMobile ? "Confirmar" : "Confirmar y enviar"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (estado === "enviando") {
        return (
            <div style={contenedorCentrado}>
                <p style={{ fontSize: 18 }}>Guardando tu votación...</p>
            </div>
        );
    }

    if (estado === "error") {
        return (
            <div style={contenedorCentrado}>
                <p role="alert" style={{ fontSize: 17, maxWidth: 460 }}>
                    No se ha podido guardar tu voto. Es posible que el plazo de
                    votación haya finalizado.
                </p>
            </div>
        );
    }

    return (
        <div>
            {import.meta.env.DEV && (
                <div style={{ background: "#ffe9b3", padding: 8 }}>
                    <button onClick={rellenarParaPruebas}>
                        🧪 Rellenar todo con la 1ª opción (solo dev)
                    </button>
                </div>
            )}

            <div
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    background: "var(--color-bg)",
                    borderBottom: "2px solid var(--color-accent-200)",
                    padding: "16px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <h1 style={{ fontSize: 26, margin: 0 }}>Votación anual</h1>
                    <button className="btn btn-ghost" onClick={onSalir} style={{ fontSize: 16 }}>
                        Salir
                    </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ flex: 1, height: 14, borderRadius: 999, background: "var(--color-accent-100)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 999, background: "var(--color-accent-500)", width: `${progresoPct}%` }} />
                    </div>
                    <span style={{ fontSize: 16, whiteSpace: "nowrap", color: "var(--color-neutral-700)" }}>
                        {totalRespondidas} de {CATEGORIAS.length} votadas
                    </span>
                </div>
            </div>

            <main style={{ maxWidth: 900, margin: "0 auto", padding: esMobile ? "16px 12px 140px" : "24px 24px 140px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", textAlign: "center" }}>
                        <span className="tag tag-accent" style={{ fontSize: 15 }}>
                            PASO {pasoActual + 1} DE {CATEGORIAS.length}
                        </span>
                        <h2 style={{ fontSize: 32, margin: 0 }}>{categoria.titulo}</h2>
                        <p style={{ margin: 0, fontSize: 18, color: "var(--color-neutral-700)", maxWidth: 560 }}>
                            {categoria.descripcion}
                        </p>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: esMobile ? 12 : 20 }}>
                        {categoria.nominados.map((nominado) => {
                            const seleccionado = selecciones[categoria.id] === nominado.id;
                            return (
                                <label
                                    key={nominado.id}
                                    className="card"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        textAlign: "center",
                                        gap: esMobile ? 8 : 14,
                                        width: esMobile ? 148 : 210,
                                        padding: esMobile ? "16px 10px 14px" : "24px 16px 20px",
                                        cursor: "pointer",
                                        border: `3px solid ${seleccionado ? "var(--color-accent-500)" : "var(--color-neutral-200)"}`,
                                        background: seleccionado ? "var(--color-accent-100)" : "var(--color-surface)",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name={categoria.id}
                                        checked={seleccionado}
                                        onChange={() => seleccionar(nominado.id)}
                                        style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
                                    />
                                    {nominado.fotoUrl ? (
                                        <img
                                            src={nominado.fotoUrl}
                                            alt=""
                                            style={{
                                                width: esMobile ? 88 : 130,
                                                height: esMobile ? 88 : 130,
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: esMobile ? 88 : 130,
                                                height: esMobile ? 88 : 130,
                                                borderRadius: "50%",
                                                background: "var(--color-neutral-200)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: esMobile ? 12 : 14,
                                                color: "var(--color-neutral-600)",
                                            }}
                                        >
                                            Foto
                                        </div>
                                    )}
                                    <span style={{ fontFamily: "var(--font-heading)", fontSize: esMobile ? 15 : 19, lineHeight: 1.2 }}>
                                        {nominado.nombre}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
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
                    padding: esMobile ? "12px 16px" : "16px 24px",
                    boxShadow: "var(--shadow-lg)",
                    display: "flex",
                    justifyContent: "center",
                    zIndex: 20,
                }}
            >
                <div style={{ width: "100%", maxWidth: 900, display: "flex", justifyContent: "space-between", gap: esMobile ? 10 : 16 }}>
                    <button
                        className="btn btn-secondary"
                        onClick={anterior}
                        disabled={esPrimero}
                        style={{ fontSize: esMobile ? 15 : 19, padding: esMobile ? "12px 16px" : "18px 32px" }}
                    >
                        ← Anterior
                    </button>
                    {esUltimo ? (
                        <button
                            className="btn btn-primary"
                            onClick={() => setEstado("confirmando")}
                            disabled={!categoriaRespondida || totalRespondidas < CATEGORIAS.length}
                            style={{ fontSize: esMobile ? 15 : 19, padding: esMobile ? "12px 16px" : "18px 32px" }}
                        >
                            {esMobile ? "Revisar" : "Revisar y guardar"}
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={siguiente}
                            disabled={!categoriaRespondida}
                            style={{ fontSize: esMobile ? 15 : 19, padding: esMobile ? "12px 16px" : "18px 32px" }}
                        >
                            Siguiente →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}