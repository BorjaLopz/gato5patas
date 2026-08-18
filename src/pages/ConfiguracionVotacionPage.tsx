import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import {
    obtenerConfiguracionVotacion,
    actualizarConfiguracionVotacion,
} from "../lib/admin";
import { AdminGate } from "../components/AdminGate";
import { SelectorFecha } from "../components/SelectorFecha";
import { ToggleSwitch } from "../components/ToggleSwitch";

function pad(n: number): string {
    return n.toString().padStart(2, "0");
}

function ConfiguracionVotacionContenido() {
    const [fecha, setFecha] = useState<Date>(() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        d.setHours(23, 59, 0, 0);
        return d;
    });
    const [hora, setHora] = useState("23:59"); // "HH:mm", campo aparte de la fecha
    const [activa, setActiva] = useState(true);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [guardadoOk, setGuardadoOk] = useState(false);

    useEffect(() => {
        obtenerConfiguracionVotacion().then((config) => {
            if (config) {
                const f = config.fechaFin.toDate();
                setFecha(f);
                setHora(`${pad(f.getHours())}:${pad(f.getMinutes())}`);
                setActiva(config.activa);
            }
            setCargando(false);
        });
    }, []);

    function combinarFechaYHora(): Date {
        const [h, m] = hora.split(":").map(Number);
        const combinada = new Date(fecha);
        combinada.setHours(h || 0, m || 0, 0, 0);
        return combinada;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setGuardando(true);
        setGuardadoOk(false);
        try {
            await actualizarConfiguracionVotacion({
                fechaFin: Timestamp.fromDate(combinarFechaYHora()),
                activa,
            });
            setGuardadoOk(true);
        } finally {
            setGuardando(false);
        }
    }

    if (cargando) {
        return (
            <div style={{ padding: 24 }}>
                <p style={{ fontSize: 18 }}>Cargando configuración...</p>
            </div>
        );
    }

    return (
        <main style={{ maxWidth: 520, margin: "0 auto", padding: "32px 24px 64px" }}>
            <h1 style={{ fontSize: 26, marginBottom: 24 }}>Configuración de la votación</h1>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="field">
                    <label>Fecha límite para votar</label>
                    <SelectorFecha value={fecha} onChange={setFecha} />
                </div>

                <div className="field" style={{ maxWidth: 160 }}>
                    <label htmlFor="hora">Hora límite</label>
                    <input
                        id="hora"
                        className="input"
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        style={{ fontSize: 16, padding: 12 }}
                    />
                </div>

                <ToggleSwitch
                    checked={activa}
                    onChange={setActiva}
                    label="Votación activa (desactiva para pausarla manualmente)"
                />

                <button type="submit" className="btn btn-primary" disabled={guardando} style={{ fontSize: 16, padding: "14px 24px" }}>
                    {guardando ? "Guardando..." : "Guardar configuración"}
                </button>

                {guardadoOk && (
                    <p style={{ margin: 0, color: "var(--color-accent-2-700)", fontSize: 15 }}>
                        Configuración actualizada correctamente.
                    </p>
                )}

                <p style={{ margin: 0, fontSize: 13, color: "var(--color-neutral-600)" }}>
                    Nota: pasada esta fecha, Firestore rechaza cualquier voto nuevo
                    aunque alguien intente saltarse el frontend — la validación real
                    vive en las Security Rules, no aquí.
                </p>
            </form>
        </main>
    );
}

export function ConfiguracionVotacionPage() {
    return (
        <AdminGate>
            <ConfiguracionVotacionContenido />
        </AdminGate>
    );
}