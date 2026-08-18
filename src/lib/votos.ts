import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { ConfiguracionVotacion } from "./admin";

/**
 * Normaliza el nombre para usarlo como ID de documento en Firestore:
 * minúsculas, sin espacios de sobra, sin tildes (para que "José" y "jose"
 * cuenten como la misma persona), y con guiones en vez de espacios porque
 * los IDs de Firestore no pueden contener ciertos caracteres con garantías.
 */
export function normalizarNombre(nombre: string): string {
    return nombre
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quita tildes
        .replace(/\s+/g, "-");
}

/** Comprueba si ese nombre (normalizado) ya tiene un voto registrado. */
export async function yaVoto(nombre: string): Promise<boolean> {
    const votoId = normalizarNombre(nombre);
    const snap = await getDoc(doc(db, "votos", votoId));
    return snap.exists();
}

/**
 * Guarda el voto de la persona. El ID del documento es su nombre
 * normalizado, así que si la misma persona vuelve a votar con el mismo
 * nombre, esto sobrescribe su elección anterior.
 */
export async function guardarVoto(
    nombre: string,
    selecciones: Record<string, string> // categoriaId -> nominadoId
): Promise<void> {
    const votoId = normalizarNombre(nombre);
    await setDoc(doc(db, "votos", votoId), {
        votoId,
        nombre: nombre.trim(),
        votos: selecciones,
        timestamp: serverTimestamp(),
    });
}

/** Lee la configuración de la votación (fecha límite, activa/pausada). Lectura pública. */
export async function leerConfiguracionPublica(): Promise<ConfiguracionVotacion | null> {
    const snap = await getDoc(doc(db, "configuracion", "votacion"));
    return snap.exists() ? (snap.data() as ConfiguracionVotacion) : null;
}