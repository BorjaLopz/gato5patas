interface Props {
    onVotar: () => void;
}

export function Landing({ onVotar }: Props) {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 640,
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                    alignItems: "flex-start",
                }}
            >
                <img
                    src="/logo.jpg"
                    alt="Logo de El Gato de 5 Patas"
                    style={{
                        width: 96,
                        height: 96,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid var(--color-accent-200)",
                    }}
                />

                <h1 style={{ fontSize: 40, margin: 0 }}>EL GATO CELEBRA 25 AÑOS</h1>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        fontSize: 19,
                        lineHeight: 1.6,
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
                    style={{ fontSize: 22, padding: "22px 56px" }}
                >
                    Votar
                </button>
            </div>
        </div>
    );
}