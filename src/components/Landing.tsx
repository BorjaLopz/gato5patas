import { useIsMobile } from "../lib/useIsMobile";

interface Props {
    onVotar: () => void;
}

export function Landing({ onVotar }: Props) {
    const esMobile = useIsMobile();
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Forma decorativa suave detrás del logo, como pide el sistema Organic.
          Más pequeñas y más hacia las esquinas en móvil, para que no
          invadan el bloque de texto en pantallas estrechas. */}
            <div
                style={{
                    position: "absolute",
                    top: esMobile ? "-6%" : "8%",
                    right: esMobile ? "-10%" : "8%",
                    width: esMobile ? 160 : 340,
                    height: esMobile ? 160 : 340,
                    borderRadius: "50%",
                    background: "var(--color-accent-2-100)",
                    zIndex: 0,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: esMobile ? "4%" : "10%",
                    left: esMobile ? "-8%" : "4%",
                    width: esMobile ? 110 : 180,
                    height: esMobile ? 110 : 180,
                    borderRadius: "50%",
                    background: "var(--color-accent-100)",
                    zIndex: 0,
                }}
            />

            <div
                style={{
                    width: "100%",
                    maxWidth: 640,
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    alignItems: "flex-start",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <div style={{ background: "var(--color-bg)", lineHeight: 0 }}>
                    <img
                        src="/logo.jpg"
                        alt="Logo de la Asociación El Gato de 5 Patas"
                        style={{
                            width: esMobile ? 150 : 180,
                            height: "auto",
                            mixBlendMode: "multiply",
                            display: "block",
                        }}
                    />
                </div>

                <span className="tag tag-accent-2" style={{ fontSize: 14 }}>
                    Gala del 25 aniversario
                </span>

                <h1 style={{ fontSize: esMobile ? 32 : 42, margin: 0, lineHeight: 1.1 }}>
                    EL GATO CELEBRA 25 AÑOS
                </h1>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        fontSize: esMobile ? 16 : 18,
                        lineHeight: 1.55,
                        color: "var(--color-neutral-700)",
                    }}
                >
                    <p style={{ margin: 0 }}>
                        La Asociación El Gato de 5 Patas cumple{" "}
                        <strong style={{ color: "var(--color-text)" }}>¡¡25 años!!</strong> y
                        por ello queremos celebrar a todas las personas que hacen que el
                        Gato siga creciendo y dejando huella.
                    </p>
                    <p style={{ margin: 0 }}>
                        Estos premios no solo reconocen años de trayectoria, compromiso o
                        esfuerzo. También celebran algo mucho más importante: las
                        personas, sus cambios, sus logros, sus ideas, su valentía y todo
                        lo que aportan a los demás.
                    </p>
                    <p style={{ margin: 0 }}>
                        Aquí encontrarás todas las categorías y sus nominados. Tú decides
                        quién debería ganar cada premio: puedes votar a una sola persona
                        por categoría, así que piensa bien tu elección…
                    </p>
                    <p style={{ margin: 0 }}>
                        ¡Gracias por participar y por formar parte de esta gran familia
                        gatuna!
                    </p>
                </div>

                <button
                    className="btn btn-primary btn-block"
                    onClick={onVotar}
                    style={{ fontSize: esMobile ? 19 : 22, padding: esMobile ? "18px 24px" : "22px 56px" }}
                >
                    Votar
                </button>

                <a
                    href="/resultados-publicos"
                    style={{ fontSize: 15, color: "var(--color-accent-700)", alignSelf: "center" }}
                >
                    Ver resultados de la gala →
                </a>
            </div>
        </div>
    );
}