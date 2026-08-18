import {
    onAuthStateChanged,
    signOut,
    signInAnonymously,
    signInWithEmailAndPassword,
    type User,
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Los organizadores acceden con "usuario y contraseña", pero por debajo
 * seguimos usando Firebase Auth (Email/Password) — no hay otra forma
 * nativa de tener contraseñas sin montar un backend propio. El truco: el
 * "email" real nunca existe de verdad, es un usuario + un dominio
 * ficticio (@gala-gatuna.local), así que no hay bandeja de correo, no
 * hay envíos, no hay cuotas ni spam. Es solo la forma en que Firebase
 * identifica la cuenta internamente.
 */
const DOMINIO_FICTICIO = "gala-gatuna.com";

function normalizarUsuario(usuario: string): string {
    return usuario.trim().toLowerCase().replace(/\s+/g, "");
}

export function emailFicticioDesdeUsuario(usuario: string): string {
    return `${normalizarUsuario(usuario)}@${DOMINIO_FICTICIO}`;
}

/** Login de organizador con usuario y contraseña (sin email real de por medio). */
export async function iniciarSesionOrganizador(
    usuario: string,
    password: string
): Promise<User> {
    const email = emailFicticioDesdeUsuario(usuario);
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
}

/** Suscripción al estado de sesión (para saber si hay usuario logueado). */
export function suscribirseAAuth(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

/** Cierra la sesión real de Firebase (no solo el estado visual de la app). */
export async function cerrarSesion(): Promise<void> {
    await signOut(auth);
}

/**
 * Inicia una sesión anónima de Firebase, sin pedir ningún dato al usuario.
 * Sirve para que la votación (identificada solo por nombre y apellidos)
 * siga teniendo una barrera real en las Security Rules —
 * `request.auth != null` — sin necesitar email ni contraseña.
 */
export async function iniciarSesionAnonima(): Promise<User> {
    const result = await signInAnonymously(auth);
    return result.user;
}