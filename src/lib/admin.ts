import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    collection,
    getDocs,
    Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface ConfiguracionVotacion {
    fechaFin: Timestamp;
    activa: boolean;
}

export interface Voto {
    votoId: string;
    nombre: string;
    votos: { [categoriaId: string]: string }; // categoriaId -> nominadoId
    timestamp: Timestamp;
}

/** Comprueba si el email dado está en la colección de organizadores. */
export async function esOrganizador(email: string): Promise<boolean> {
    const ref = doc(db, "organizadores", email.trim().toLowerCase());
    const snap = await getDoc(ref);
    return snap.exists();
}

/** Lee la configuración actual de la votación (fecha límite, activa/pausada). */
export async function obtenerConfiguracionVotacion(): Promise<ConfiguracionVotacion | null> {
    const ref = doc(db, "configuracion", "votacion");
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as ConfiguracionVotacion) : null;
}

/** Actualiza la fecha límite y/o el estado activo de la votación. Solo organizadores (según Security Rules). */
export async function actualizarConfiguracionVotacion(
    config: ConfiguracionVotacion
): Promise<void> {
    const ref = doc(db, "configuracion", "votacion");
    await setDoc(ref, config, { merge: true });
}

/** Lee todos los votos emitidos, con su ID de documento incluido. Solo organizadores. */
export async function obtenerTodosLosVotos(): Promise<Voto[]> {
    const snap = await getDocs(collection(db, "votos"));
    return snap.docs.map((d) => ({ ...(d.data() as Voto), votoId: d.id }));
}

/**
 * Elimina un voto concreto por su ID de documento. Solo organizadores
 * (según Security Rules) — por ejemplo, para retirar un voto duplicado
 * o hecho por error.
 */
export async function eliminarVoto(votoId: string): Promise<void> {
    await deleteDoc(doc(db, "votos", votoId));
}

/**
 * Agrega los votos por categoría y nominado.
 * Devuelve, por cada categoría, un recuento de votos por nominadoId.
 */
export function agregarResultados(
    votos: Voto[]
): Record<string, Record<string, number>> {
    const resultados: Record<string, Record<string, number>> = {};

    for (const voto of votos) {
        for (const [categoriaId, nominadoId] of Object.entries(voto.votos)) {
            if (!resultados[categoriaId]) {
                resultados[categoriaId] = {};
            }
            resultados[categoriaId][nominadoId] =
                (resultados[categoriaId][nominadoId] ?? 0) + 1;
        }
    }

    return resultados;
}