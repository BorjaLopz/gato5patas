import { useEffect, useState } from "react";

/**
 * Devuelve true cuando el ancho de la ventana es igual o menor que el
 * breakpoint dado (por defecto 640px, un móvil típico). Se recalcula
 * automáticamente si el usuario gira el móvil o cambia el tamaño de
 * la ventana.
 */
export function useIsMobile(breakpoint = 640): boolean {
    const [esMobile, setEsMobile] = useState(
        () => typeof window !== "undefined" && window.innerWidth <= breakpoint
    );

    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
        const actualizar = () => setEsMobile(mq.matches);
        actualizar();
        mq.addEventListener("change", actualizar);
        return () => mq.removeEventListener("change", actualizar);
    }, [breakpoint]);

    return esMobile;
}