import S from "./Button.module.css";

/**
 * Renders a styled button for the specified variant.
 *
 * @param onClick - Click handler invoked when the button is activated.
 * @param disabled - If `true`, the button is disabled and rendered with disabled styling.
 * @param variant - `"primary"` for the default style, `"secondary"` for the ghost style.
 * @returns A React button element styled according to `variant` and `disabled`, with `children` as its content.
 */
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