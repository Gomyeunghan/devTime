import S from "./Button.module.css";

function Button({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <div className={S.container}>
            <button onClick={onClick}>{children}</button>
        </div>
    );
}
export default Button;
