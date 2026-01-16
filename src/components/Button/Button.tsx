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
        <div className={`${S.container} ${disabled ? S.disabled : ""}`}>
            <button onClick={onClick} disabled={disabled}>
                {children}
            </button>
        </div>
    ) : (
        <div
            className={`${S.container} ${S.ghost} ${
                disabled ? S.disabled : ""
            }`}
        >
            <button onClick={onClick} disabled={disabled}>
                {children}
            </button>
        </div>
    );
}
export default Button;
// 폰트사이즈 프롭으로 받아야할듯 개선필요
