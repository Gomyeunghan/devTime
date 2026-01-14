import S from "./Button.module.css";

function Button({
    children,
    onClick,
    disabled,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}) {
    return (
        <div className={`${S.container} ${disabled ? S.disabled : ""}`}>
            <button onClick={onClick} disabled={disabled}>
                {children}
            </button>
        </div>
    );
}
export default Button;
// 폰트사이즈 프롭으로 받아야할듯 개선필요
