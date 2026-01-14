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
        <>
            <div>{inputLabel}</div>
            <div className={`${S.button} ${isValid ? "" : S.wrong}`}>
                <input type="text" placeholder={placeholder} />
            </div>
            <span
                className={`${S.feedBackText} ${isValid ? S.hidden : S.wrong}`}
            >
                {feedBackText}
            </span>
        </>
    );
}
export default Input;
