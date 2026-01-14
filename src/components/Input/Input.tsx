import S from "./Input.module.css";

function Input({
    placeholder,
    inputLabel,
    isValid,
    feedBackText,
}: {
    placeholder: string;
    inputLabel?: string;
    isValid: boolean;
    feedBackText?: string;
}) {
    return (
        <div className={S.container}>
            <div>{inputLabel}</div>
            <div className={`${S.input} ${isValid ? "" : S.wrong}`}>
                <input type="text" placeholder={placeholder} />
            </div>
            <span
                className={`${S.feedBackText} ${isValid ? S.hidden : S.wrong}`}
            >
                {feedBackText}
            </span>
        </div>
    );
}
export default Input;
