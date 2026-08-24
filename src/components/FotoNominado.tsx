import type { CSSProperties } from "react";
import { LOGO_ASOCIACION } from "../lib/categorias";

interface Props {
	fotoUrl: string;
	size: number;
	style?: CSSProperties;
}

/**
 * Avatar circular de un nominado. El logo de la asociación (foto de
 * sustitución cuando no hay autorización) no es cuadrado ni tiene fondo
 * transparente — object-fit: cover lo recortaría. Aquí se hace mix-blend-mode:
 * multiply sobre un fondo del mismo color que el círculo: el blanco del logo
 * se funde con ese fondo y solo queda visible el gato.
 */
export function FotoNominado({ fotoUrl, size, style }: Props) {
	const esLogo = fotoUrl === LOGO_ASOCIACION;

	if (!esLogo) {
		return (
			<img
				src={fotoUrl}
				alt=""
				style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flex: "none", ...style }}
			/>
		);
	}

	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: "50%",
				background: "var(--color-neutral-200)",
				overflow: "hidden",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flex: "none",
				...style,
			}}
		>
			<img
				src={fotoUrl}
				alt=""
				style={{ width: "78%", height: "78%", objectFit: "contain", mixBlendMode: "multiply" }}
			/>
		</div>
	);
}
