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
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: "var(--radius-lg)",
                        background: "var(--color-accent-100)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-accent-700)"
                        strokeWidth="2.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 12l2 2 4-4"></path>
                        <circle cx="12" cy="12" r="9"></circle>
                    </svg>
                </div>

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
                        Queremos celebrar a todas las personas que hacen que el Gato
                        siga creciendo y dejando huella. Estos premios reconocen
                        trayectoria, compromiso y esfuerzo — pero también celebran algo
                        más importante: los cambios, los logros y la valentía de
                        quienes forman esta familia gatuna.
                    </p>
                    <p style={{ margin: 0 }}>
                        Elige a una persona por categoría. Piénsalo bien, ¡tu voto
                        cuenta!
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={onVotar}
                    style={{ fontSize: 22, padding: "22px 56px" }}
                >
                    Votar
                </button>
            </div>
        </div>
    );
}