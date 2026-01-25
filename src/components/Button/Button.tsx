import S from "./Button.module.css";

function Button({
    children,
    onClick,
    disabled,
    variant,
}: {
    children: React.ReactNode;
    onClick?: any;
    disabled?: boolean;
    variant: "primary" | "secondary";
}) {
    return variant === "primary" ? (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${S.container} ${disabled ? S.disabled : ""}`}
        >
            {children}
        </button>
    ) : (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${S.container} ${S.ghost} ${
                disabled ? S.disabled : ""
            }`}
        >
            {children}
        </button>
    );
}
export default Button;
