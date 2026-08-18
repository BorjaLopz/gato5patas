import { useState } from "react";

interface Props {
    value: Date;
    onChange: (fecha: Date) => void;
}

const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];
const MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function mismodDia(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/** Genera la cuadrícula de días a mostrar (con relleno del mes anterior/siguiente). */
function generarDiasDelMes(mesVisible: Date): Date[] {
    const primerDiaMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 1);
    // Lunes = 0 ... Domingo = 6 (en vez del 0=domingo de JS)
    const offset = (primerDiaMes.getDay() + 6) % 7;
    const inicio = new Date(primerDiaMes);
    inicio.setDate(inicio.getDate() - offset);

    const dias: Date[] = [];
    for (let i = 0; i < 42; i++) {
        const dia = new Date(inicio);
        dia.setDate(inicio.getDate() + i);
        dias.push(dia);
    }
    return dias;
}

export function SelectorFecha({ value, onChange }: Props) {
    const [abierto, setAbierto] = useState(false);
    const [mesVisible, setMesVisible] = useState(new Date(value.getFullYear(), value.getMonth(), 1));

    const dias = generarDiasDelMes(mesVisible);

    function elegirDia(dia: Date) {
        const nuevaFecha = new Date(value);
        nuevaFecha.setFullYear(dia.getFullYear(), dia.getMonth(), dia.getDate());
        onChange(nuevaFecha);
        setAbierto(false);
    }

    function cambiarMes(delta: number) {
        setMesVisible((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
    }

    return (
        <div style={{ position: "relative" }}>
            <button
                type="button"
                className="input"
                onClick={() => setAbierto((a) => !a)}
                style={{
                    fontSize: 16,
                    padding: "12px 16px",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <span style={{ textTransform: "capitalize" }}>
                    {value.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="3"></rect>
                    <path d="M3 10h18M8 2v4M16 2v4"></path>
                </svg>
            </button>

            {abierto && (
                <>
                    {/* Capa invisible para cerrar el calendario al hacer click fuera */}
                    <div
                        onClick={() => setAbierto(false)}
                        style={{ position: "fixed", inset: 0, zIndex: 29 }}
                    />
                    <div
                        className="card elev-lg"
                        style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            left: 0,
                            zIndex: 30,
                            width: 320,
                            padding: 20,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <button type="button" className="btn btn-icon btn-ghost" onClick={() => cambiarMes(-1)} aria-label="Mes anterior">
                                ‹
                            </button>
                            <span style={{ fontFamily: "var(--font-heading)", fontSize: 17, textTransform: "capitalize" }}>
                                {MESES[mesVisible.getMonth()]} {mesVisible.getFullYear()}
                            </span>
                            <button type="button" className="btn btn-icon btn-ghost" onClick={() => cambiarMes(1)} aria-label="Mes siguiente">
                                ›
                            </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
                            {DIAS_SEMANA.map((d) => (
                                <div key={d} style={{ textAlign: "center", fontSize: 12, color: "var(--color-neutral-600)", padding: 4 }}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                            {dias.map((dia) => {
                                const esDelMesVisible = dia.getMonth() === mesVisible.getMonth();
                                const esSeleccionado = mismodDia(dia, value);
                                return (
                                    <button
                                        key={dia.toISOString()}
                                        type="button"
                                        onClick={() => elegirDia(dia)}
                                        style={{
                                            aspectRatio: "1",
                                            border: "none",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            fontSize: 14,
                                            background: esSeleccionado ? "var(--color-accent-500)" : "transparent",
                                            color: esSeleccionado
                                                ? "var(--color-bg)"
                                                : esDelMesVisible
                                                    ? "var(--color-text)"
                                                    : "var(--color-neutral-400)",
                                        }}
                                    >
                                        {dia.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}