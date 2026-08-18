import { useState } from "react";

interface Props {
    checked: boolean;
    onChange: (valor: boolean) => void;
    label: string;
}

export function ToggleSwitch({ checked, onChange, label }: Props) {
    const [enfocado, setEnfocado] = useState(false);

    return (
        <label style={{ display: "inline-flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: 15 }}>
            <span
                style={{
                    position: "relative",
                    width: 44,
                    height: 26,
                    borderRadius: 999,
                    background: checked ? "var(--color-accent-500)" : "var(--color-neutral-300)",
                    transition: "background 0.15s",
                    flex: "none",
                    outline: enfocado ? "2px solid var(--color-accent)" : "none",
                    outlineOffset: 2,
                }}
            >
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    onFocus={() => setEnfocado(true)}
                    onBlur={() => setEnfocado(false)}
                    style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", margin: 0, cursor: "pointer" }}
                />
                <span
                    style={{
                        position: "absolute",
                        top: 3,
                        left: checked ? 21 : 3,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "var(--color-bg)",
                        boxShadow: "var(--shadow-sm)",
                        transition: "left 0.15s",
                    }}
                />
            </span>
            {label}
        </label>
    );
}